import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  IDLE_WATTS,
  configuredEnergyFlows,
  discoverEnergyFlows,
  discoverPowerChannels,
  entityPowerInWatts,
  flowPowerInWatts,
  powerInsights,
  powerSnapshotInWatts,
  totalPowerInWatts,
} from "./energy";
import {
  FULL_CONFIDENCE_DAYS,
  PROVISIONAL_DAYS,
  bandRuns,
  describeDeviation,
  deviationBounds,
  fetchBaseline,
  fetchToday,
  fractionalHour,
  hourlyBounds,
  missingStatistics,
  niceCeiling,
} from "./statistics";
import type {
  BandPoint,
  Baseline,
  BaselineHour,
  EnergyFlow,
  EnergyFlowKind,
  EnergyPreferences,
  HomeAssistant,
  PowerChannel,
  PowerOrbConfig,
  TodayHour,
} from "./types";

const PREFERENCES_REFRESH_MS = 5 * 60 * 1_000;
const TODAY_REFRESH_MS = 5 * 60 * 1_000;
const BASELINE_REFRESH_MS = 60 * 60 * 1_000;
const TICK_MS = 30 * 1_000;
const COMPACT_WIDTH = 300;

const VIEW = 400;
const CENTRE = VIEW / 2;
const RADIUS_OUT = 174;
const RADIUS_IN = 62;
const MIN_BAND = 5;
const MIN_TICK = 9;

/**
 * Shared across card instances so one dashboard issues one query.
 *
 * The baseline and today's series have deliberately different lifetimes: the
 * 28-day scan is expensive and only meaningful once an hour, while today's
 * series gains a bucket every hour and is cheap to refresh.
 */
const baselineCache = new Map<string, Promise<Baseline>>();
const todayCache = new Map<string, Promise<TodayHour[]>>();
const metadataCache = new Map<string, Promise<string[]>>();

interface HistoryBundle {
  baseline: Baseline | null;
  today: TodayHour[];
  missing: string[];
}

function cached<T>(
  store: Map<string, Promise<T>>,
  prefix: string,
  key: string,
  build: () => Promise<T>,
): Promise<T> {
  const existing = store.get(key);
  if (existing) return existing;
  const request = build();
  store.set(key, request);
  for (const other of [...store.keys()]) {
    if (other !== key && other.startsWith(prefix)) store.delete(other);
  }
  return request;
}

function polar(hour: number, radius: number): [number, number] {
  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
  return [CENTRE + radius * Math.cos(angle), CENTRE + radius * Math.sin(angle)];
}

function point(coords: [number, number]): string {
  return `${coords[0].toFixed(2)},${coords[1].toFixed(2)}`;
}

/** An annular wedge between two hours, used to shade the hours not yet lived. */
function sector(from: number, to: number, inner: number, outer: number): string {
  if (to - from < 0.01) return "";
  const large = to - from > 12 ? 1 : 0;
  const a = polar(from, outer);
  const b = polar(to, outer);
  const c = polar(to, inner);
  const d = polar(from, inner);
  return [
    `M ${point(a)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${point(b)}`,
    `L ${point(c)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${point(d)}`,
    "Z",
  ].join(" ");
}

@customElement("power-orb")
export class PowerOrbCard extends LitElement {
  @property({ attribute: false })
  public set hass(value: HomeAssistant) {
    const previous = this._hass;
    this._hass = value;
    if (!previous || this.watchedChanged(previous, value)) {
      this.requestUpdate();
    }
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  @state() private channels: PowerChannel[] = [];
  @state() private flows: EnergyFlow[] = [];
  @state() private loading = true;
  @state() private error?: string;
  @state() private baseline: Baseline | null = null;
  @state() private today: TodayHour[] = [];
  @state() private historyNote?: string;
  @state() private compact = false;
  /** Advances on a timer so the live bead keeps pace with the clock. */
  @state() private now = Date.now();

  private _hass?: HomeAssistant;
  private config: PowerOrbConfig = { type: "custom:power-orb" };
  private unsubscribe?: () => void;
  private refreshTimer?: number;
  private historyTimer?: number;
  private tickTimer?: number;
  private connectionGeneration = 0;
  private connecting?: Promise<void>;
  private resizeObserver?: ResizeObserver;
  private retryTimer?: number;
  private kneeCache?: { hours: unknown; knee: number };
  private historyAttempted = false;
  private historyRetried = false;

  public setConfig(config: PowerOrbConfig): void {
    if (!config || config.type !== "custom:power-orb") {
      throw new Error("Power Orb requires type: custom:power-orb");
    }
    if (config.max_power !== undefined && config.max_power <= 0) {
      throw new Error("max_power must be greater than zero");
    }
    if (config.entity && config.entities !== undefined) {
      throw new Error("Configure either entity or entities, not both");
    }
    const configuredFlows =
      config.entities === undefined ? [] : configuredEnergyFlows(config.entities);
    this.config = config;
    this.channels = config.entity
      ? [{ entityId: config.entity, multiplier: 1, role: "grid" }]
      : configuredFlows.flatMap((flow) => flow.channels);
    this.flows = configuredFlows;
    this.loading = !config.entity && config.entities === undefined;
    this.error = undefined;
    this.resetHistory();
    this.disconnectData();
    if (this.isConnected && this._hass) void this.connect();
  }

  public static getStubConfig(): PowerOrbConfig {
    return { type: "custom:power-orb" };
  }

  public getCardSize(): number {
    return 10;
  }

  public getGridOptions(): {
    rows: number;
    columns: number;
    min_rows: number;
    min_columns: number;
  } {
    return { rows: 10, columns: 12, min_rows: 8, min_columns: 6 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.tickTimer = window.setInterval(() => {
      this.now = Date.now();
    }, TICK_MS);
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      const compact = width > 0 && width < COMPACT_WIDTH;
      if (compact !== this.compact) this.compact = compact;
    });
    this.resizeObserver.observe(this);
    if (this._hass) void this.connect();
  }

  public disconnectedCallback(): void {
    this.disconnectData();
    if (this.tickTimer !== undefined) {
      window.clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    super.disconnectedCallback();
  }

  private watchedChanged(previous: HomeAssistant, next: HomeAssistant): boolean {
    if (previous.locale !== next.locale) return true;
    for (const channel of this.channels) {
      if (previous.states[channel.entityId] !== next.states[channel.entityId]) {
        return true;
      }
    }
    return false;
  }

  private get timeZone(): string | undefined {
    return this._hass?.config?.time_zone;
  }

  private connect(): Promise<void> {
    if (!this._hass) return Promise.resolve();
    if (this.connecting) return this.connecting;

    const generation = this.connectionGeneration;
    this.connecting = this.startDiscovery(generation).finally(() => {
      if (generation === this.connectionGeneration) this.connecting = undefined;
    });
    return this.connecting;
  }

  private async startDiscovery(generation: number): Promise<void> {
    await this.loadEnergyPreferences();
    if (generation !== this.connectionGeneration || !this._hass) return;

    void this.loadHistory();
    this.historyTimer = window.setInterval(
      () => void this.loadHistory(true),
      TODAY_REFRESH_MS,
    );

    if (this.config.entity || this.config.entities !== undefined) return;

    this.refreshTimer = window.setInterval(
      () => void this.loadEnergyPreferences(),
      PREFERENCES_REFRESH_MS,
    );
    try {
      const unsubscribe = await this._hass.connection.subscribeEvents(
        () => void this.loadEnergyPreferences(),
        "power_orb_refresh",
      );
      if (generation !== this.connectionGeneration) {
        unsubscribe();
      } else {
        this.unsubscribe = unsubscribe;
      }
    } catch {
      // Periodic refresh remains available if event subscriptions are denied.
    }
  }

  private disconnectData(): void {
    this.connectionGeneration += 1;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    for (const timer of [this.refreshTimer, this.historyTimer]) {
      if (timer !== undefined) window.clearInterval(timer);
    }
    if (this.retryTimer !== undefined) {
      window.clearTimeout(this.retryTimer);
      this.retryTimer = undefined;
    }
    this.refreshTimer = undefined;
    this.historyTimer = undefined;
    this.connecting = undefined;
  }

  private resetHistory(): void {
    this.baseline = null;
    this.today = [];
    this.historyNote = undefined;
    this.historyAttempted = false;
    this.historyRetried = false;
  }

  private async loadEnergyPreferences(): Promise<void> {
    if (!this._hass || this.config.entity || this.config.entities !== undefined) {
      return;
    }
    this.loading = true;
    try {
      const preferences = await this._hass.callWS<EnergyPreferences>({
        type: "energy/get_prefs",
      });
      this.flows = discoverEnergyFlows(preferences);
      this.channels = discoverPowerChannels(preferences);
      this.error =
        this.channels.length === 0
          ? "Add real-time power sensors to your Energy dashboard."
          : undefined;
    } catch {
      this.error = "Power Orb could not read the Energy dashboard.";
    } finally {
      this.loading = false;
    }
  }

  private async loadHistory(refreshOnly = false): Promise<void> {
    const hass = this._hass;
    if (!hass || this.channels.length === 0) return;
    if (refreshOnly && !this.historyAttempted) return;
    this.historyAttempted = true;

    const now = Date.now();
    const prefix = `${[...new Set(this.channels.map((c) => c.entityId))].sort().join("|")}::`;

    try {
      const missing = await cached(
        metadataCache,
        prefix,
        `${prefix}${Math.floor(now / BASELINE_REFRESH_MS)}`,
        () => missingStatistics(hass, this.channels),
      );
      if (missing.length > 0) {
        this.applyHistory({ baseline: null, today: [], missing });
        return;
      }

      const [baseline, today] = await Promise.all([
        cached(
          baselineCache,
          prefix,
          `${prefix}${Math.floor(now / BASELINE_REFRESH_MS)}`,
          () => fetchBaseline(hass, this.channels, now, this.timeZone),
        ),
        cached(
          todayCache,
          prefix,
          `${prefix}${Math.floor(now / TODAY_REFRESH_MS)}`,
          () => fetchToday(hass, this.channels, now, this.timeZone),
        ),
      ]);
      this.applyHistory({ baseline, today, missing: [] });
      this.historyRetried = false;
    } catch {
      metadataCache.delete(`${prefix}${Math.floor(now / BASELINE_REFRESH_MS)}`);
      baselineCache.delete(`${prefix}${Math.floor(now / BASELINE_REFRESH_MS)}`);
      todayCache.delete(`${prefix}${Math.floor(now / TODAY_REFRESH_MS)}`);
      if (!this.historyRetried) {
        this.historyRetried = true;
        this.retryTimer = window.setTimeout(() => void this.loadHistory(), 5_000);
        return;
      }
      this.baseline = null;
      this.today = [];
      this.historyNote = "Baseline unavailable — could not read recorder history.";
    }
  }

  private applyHistory(bundle: HistoryBundle): void {
    if (bundle.missing.length > 0) {
      this.baseline = null;
      this.today = [];
      this.historyNote =
        bundle.missing.length === 1
          ? `No recorder statistics for ${bundle.missing[0]} — baseline unavailable.`
          : `No recorder statistics for ${bundle.missing.length} sensors — baseline unavailable.`;
      return;
    }

    this.today = bundle.today;
    const baseline = bundle.baseline;
    if (!baseline || baseline.status === "learning") {
      this.baseline = null;
      this.historyNote = `Learning your normal — ${baseline?.days ?? 0} of ${PROVISIONAL_DAYS} days.`;
      return;
    }
    this.baseline = baseline;
    if (baseline.status === "provisional") {
      this.historyNote = `Provisional baseline — ${baseline.days} of ${FULL_CONFIDENCE_DAYS} days.`;
      return;
    }
    // The verdict needs five-minute statistics. They follow recorder's
    // purge_keep_days, so a very short retention silently disables it.
    const hasEnvelope = baseline.hours.some((hour) => hour?.liveHigh !== null);
    this.historyNote = hasEnvelope
      ? undefined
      : "Not enough recorder detail for a live verdict — raise recorder purge_keep_days.";
  }

  private currentPower(): number | null {
    // Both branches route through the same all-or-nothing, clamp-once
    // derivation the historical baseline uses.
    return this._hass ? totalPowerInWatts(this._hass.states, this.channels) : null;
  }

  private formatPower(watts: number): { value: string; unit: string } {
    const useKilowatts =
      this.config.unit === "kW" ||
      (this.config.unit === undefined && Math.abs(watts) >= 1_000);
    const locale = this._hass?.locale?.language ?? this._hass?.language;
    const value = useKilowatts ? watts / 1_000 : watts;
    return {
      value: new Intl.NumberFormat(locale, {
        maximumFractionDigits: useKilowatts ? 2 : 0,
      }).format(value),
      unit: useKilowatts ? "kW" : "W",
    };
  }

  /**
   * Quantised to a round ceiling and deliberately independent of the live
   * reading, so one oven preheat cannot silently rescale the whole dial. A
   * live spike beyond the ceiling clips at the rim.
   */
  private scaleMax(): number {
    let max = this.config.max_power ?? 0;
    for (const hour of this.baseline?.hours ?? []) {
      if (!hour) continue;
      // Both windows matter: the live envelope covers five days and the drawn
      // band twenty-eight, so neither is reliably the larger. A ceiling below
      // the band would clip it at the rim and collapse the deviation ticks.
      max = Math.max(max, hour.high, hour.liveHigh ?? 0);
    }
    for (const entry of this.today) max = Math.max(max, entry.watts);
    return niceCeiling(Math.max(max, 1_000));
  }

  /** Square root, so the overnight band stays visible against evening peaks. */
  private radius(watts: number, max: number): number {
    const ratio = Math.sqrt(Math.min(Math.max(watts, 0), max) / max);
    return RADIUS_IN + (RADIUS_OUT - RADIUS_IN) * ratio;
  }

  /**
   * Runs of consecutive hours that carry a baseline. The dial wraps across
   * midnight; the cartesian strip cannot.
   */
  private bandRuns(wrap: boolean): BandPoint[][] {
    return bandRuns(this.baseline?.hours ?? [], wrap);
  }

  /** Which side of the usual range a completed hour fell, if either. */
  private departure(hour: number, watts: number): "above" | "below" | null {
    const band = this.baseline?.hours[hour];
    if (!band) return null;
    const bounds = hourlyBounds(band);
    if (watts > bounds.high) return "above";
    if (watts < bounds.low) return "below";
    return null;
  }

  /** True while the live reading is adjacent to the last completed hour. */
  private beadJoinsTrace(now: number): boolean {
    const last = this.today[this.today.length - 1];
    if (!last) return false;
    const delta = Math.floor(now) - last.hour;
    return delta === 0 || delta === 1;
  }

  /** Consecutive runs of today's hours, so a recorder gap is not bridged. */
  private traceRuns(): TodayHour[][] {
    const runs: TodayHour[][] = [];
    let run: TodayHour[] = [];
    for (const entry of this.today) {
      const previous = run[run.length - 1];
      if (previous && entry.hour !== previous.hour + 1) {
        runs.push(run);
        run = [];
      }
      run.push(entry);
    }
    if (run.length > 0) runs.push(run);
    return runs;
  }

  private renderBand(max: number) {
    return this.bandRuns(true).map((run) => {
      const outer = run.map((entry) => {
        const inner = this.radius(entry.low, max);
        const outerRadius = Math.max(this.radius(entry.high, max), inner + MIN_BAND);
        return point(polar(entry.hour + 0.5, outerRadius));
      });
      const inner = [...run]
        .reverse()
        .map((entry) => point(polar(entry.hour + 0.5, this.radius(entry.low, max))));
      return svg`<polygon class="band" points=${[...outer, ...inner].join(" ")} />`;
    });
  }

  /**
   * Deviation is drawn as fixed-width radial ticks rather than a filled area,
   * so the ink scales with the size of the deviation and not with the radius
   * at which it happens to occur.
   */
  private renderTicks(max: number, live: number | null) {
    const hours = this.baseline?.hours;
    if (!hours) return nothing;

    const marks = this.today.map((entry) => {
      const band = hours[entry.hour];
      if (!band) return nothing;
      return this.tick(entry.hour + 0.5, entry.watts, hourlyBounds(band), max);
    });

    // The hour in progress has no completed bucket, so the live reading has to
    // supply its own tick, judged against the five-minute envelope because it
    // is an instant rather than an hourly mean.
    const nowHour = fractionalHour(this.now, this.timeZone);
    const current = hours[Math.floor(nowHour)];
    const bounds = current ? deviationBounds(current) : null;
    if (live !== null && bounds) {
      marks.push(this.tick(nowHour, live, bounds, max));
    }
    return marks;
  }

  /** One deviation mark, from the edge of the given range out to the reading. */
  private tick(
    hour: number,
    watts: number,
    bounds: { low: number; high: number },
    max: number,
  ) {
    const above = watts > bounds.high;
    if (!above && watts >= bounds.low) return nothing;

    const edge = this.radius(above ? bounds.high : bounds.low, max);
    const tip = this.radius(watts, max);
    // A short excursion would otherwise land inside a single dash gap.
    const reach =
      Math.abs(tip - edge) < MIN_TICK
        ? edge + (above ? MIN_TICK : -MIN_TICK)
        : tip;
    const from = polar(hour, edge);
    const to = polar(hour, Math.min(Math.max(reach, RADIUS_IN), RADIUS_OUT));
    return svg`<line
      class=${`tick ${above ? "above" : "below"}`}
      x1=${from[0]} y1=${from[1]} x2=${to[0]} y2=${to[1]}
    />`;
  }

  /**
   * Today's line, split into segments coloured by how that hour compared with
   * the usual range. Colouring the line itself means the card has something to
   * say every day, not only on the days something went wrong.
   */
  private traceSegments(
    max: number,
    live: number | null,
  ): { points: string; state: string }[] {
    const nodes: { hour: number; watts: number; state: string }[] = [];
    for (const run of this.traceRuns()) {
      if (nodes.length > 0) nodes.push({ hour: -1, watts: 0, state: "break" });
      for (const entry of run) {
        nodes.push({
          hour: entry.hour + 0.5,
          watts: entry.watts,
          state: this.departure(entry.hour, entry.watts) ?? "normal",
        });
      }
    }

    const now = fractionalHour(this.now, this.timeZone);
    if (live !== null && this.beadJoinsTrace(now)) {
      nodes.push({
        hour: now,
        watts: live,
        state: this.departure(Math.floor(now), live) ?? "normal",
      });
    }

    const segments: { points: string; state: string }[] = [];
    for (let index = 1; index < nodes.length; index += 1) {
      const from = nodes[index - 1];
      const to = nodes[index];
      if (!from || !to || from.state === "break" || to.state === "break") continue;
      segments.push({
        // The later of the two ends decides the colour, so a segment entering a
        // departure is already marked when it arrives.
        state: to.state === "normal" ? from.state : to.state,
        points: `${point(polar(from.hour, this.radius(from.watts, max)))} ${point(
          polar(to.hour, this.radius(to.watts, max)),
        )}`,
      });
    }
    return segments;
  }

  private renderDial(live: number | null) {
    const max = this.scaleMax();
    const now = fractionalHour(this.now, this.timeZone);
    const bead = live === null ? null : polar(now, this.radius(live, max));
    const scale = this.formatPower(max);
    const quarter = this.formatPower(max / 4);

    return svg`
      <svg class="dial" viewBox="0 0 ${VIEW} ${VIEW}" role="img"
        aria-label=${this.summary(live)}>
        <path class="lived" d=${sector(0, now, RADIUS_IN, RADIUS_OUT)} />
        <circle class="rim" cx=${CENTRE} cy=${CENTRE} r=${RADIUS_OUT} />
        <circle class="rim" cx=${CENTRE} cy=${CENTRE} r=${RADIUS_IN} />
        <circle class="rim mid" cx=${CENTRE} cy=${CENTRE}
          r=${this.radius(max / 4, max)} />
        ${[0, 6, 12, 18].map((hour) => {
          const from = polar(hour, RADIUS_IN);
          const to = polar(hour, RADIUS_OUT);
          const label = polar(hour, RADIUS_OUT + 15);
          return svg`
            <line class="spoke" x1=${from[0]} y1=${from[1]} x2=${to[0]} y2=${to[1]} />
            <text class="hour" x=${label[0]} y=${label[1]}>${String(hour).padStart(2, "0")}</text>
          `;
        })}
        ${this.renderBand(max)} ${this.renderTicks(max, live)}
        ${this.traceSegments(max, live).map(
          (segment) =>
            svg`<polyline class=${`trace ${segment.state}`} points=${segment.points} />`,
        )}
        ${bead
          ? svg`
              <circle class="bead-halo" cx=${bead[0]} cy=${bead[1]} r="11" />
              <circle class="bead" cx=${bead[0]} cy=${bead[1]} r="6" />
            `
          : nothing}
        ${this.renderNowBracket(max, now)}
        <text class="scale" x=${polar(21, RADIUS_OUT)[0]} y=${polar(21, RADIUS_OUT)[1]}>
          ${scale.value} ${scale.unit}
        </text>
        <text class="scale" x=${polar(21, this.radius(max / 4, max))[0]}
          y=${polar(21, this.radius(max / 4, max))[1]}>
          ${quarter.value} ${quarter.unit}
        </text>
      </svg>
    `;
  }

  /**
   * A bracket at the current angle spanning the range a reading right now can
   * take without counting as a departure.
   *
   * The drawn band is a range of hourly means and cannot judge an instant, so
   * the envelope that can is shown only where it applies: at now.
   */
  private renderNowBracket(max: number, now: number) {
    const band = this.baseline?.hours[Math.floor(now)];
    const bounds = band ? deviationBounds(band) : null;
    if (!bounds) return nothing;
    const from = polar(now, this.radius(bounds.low, max));
    const to = polar(now, this.radius(bounds.high, max));
    return svg`<line class="now-range" x1=${from[0]} y1=${from[1]}
      x2=${to[0]} y2=${to[1]} />`;
  }

  private renderStrip(live: number | null) {
    const max = this.scaleMax();
    const width = 400;
    const height = 170;
    const floor = height - 22;
    const span = floor - 18;
    const y = (watts: number) =>
      floor - span * Math.sqrt(Math.min(Math.max(watts, 0), max) / max);
    const x = (hour: number) => (hour / 24) * width;
    const scale = this.formatPower(max);
    const hours = this.baseline?.hours;

    const runs = this.bandRuns(false).map((run) => {
      const top = run.map((entry) => {
        const low = y(entry.low);
        return `${x(entry.hour + 0.5)},${Math.min(y(entry.high), low - MIN_BAND)}`;
      });
      const bottom = [...run]
        .reverse()
        .map((entry) => `${x(entry.hour + 0.5)},${y(entry.low)}`);
      return svg`<polygon class="band" points=${[...top, ...bottom].join(" ")} />`;
    });

    const ticks = hours
      ? this.today.map((entry) => {
          const band = hours[entry.hour];
          if (!band) return nothing;
          const bounds = hourlyBounds(band);
          const above = entry.watts > bounds.high;
          if (!above && entry.watts >= bounds.low) return nothing;
          return svg`<line
            class=${`tick ${above ? "above" : "below"}`}
            x1=${x(entry.hour + 0.5)} y1=${y(above ? bounds.high : bounds.low)}
            x2=${x(entry.hour + 0.5)} y2=${y(entry.watts)}
          />`;
        })
      : nothing;

    const traces = this.traceRuns().map((run) =>
      run.map((entry) => `${x(entry.hour + 0.5)},${y(entry.watts)}`).join(" "),
    );
    const now = fractionalHour(this.now, this.timeZone);
    const tail = traces[traces.length - 1];
    if (live !== null && tail && this.beadJoinsTrace(now)) {
      traces[traces.length - 1] = `${tail} ${x(now)},${y(live)}`;
    }

    return svg`
      <svg class="strip" viewBox="0 0 ${width} ${height}" role="img"
        aria-label=${this.summary(live)}>
        ${[0, 6, 12, 18].map(
          (hour) => svg`
            <line class="spoke" x1=${x(hour)} y1="18" x2=${x(hour)} y2=${floor} />
            <text class="hour" x=${x(hour) + 4} y=${height - 6}
              text-anchor="start">${String(hour).padStart(2, "0")}</text>
          `,
        )}
        ${runs} ${ticks}
        ${traces
          .filter((points) => points.includes(" "))
          .map((points) => svg`<polyline class="trace" points=${points} />`)}
        ${live !== null
          ? svg`<circle class="bead" cx=${x(now)} cy=${y(live)} r="5" />`
          : nothing}
        <text class="scale" x="4" y="12" text-anchor="start">
          ${scale.value} ${scale.unit}
        </text>
      </svg>
    `;
  }

  private flowValue(kind: EnergyFlowKind): number | null {
    if (!this._hass) return null;
    const flow = this.flows.find((candidate) => candidate.kind === kind);
    return flow ? flowPowerInWatts(this._hass.states, flow) : null;
  }

  private flowLabel(kind: EnergyFlowKind, watts: number): string {
    if (Math.abs(watts) < IDLE_WATTS) return "idle";
    if (kind === "grid") return watts > 0 ? "importing" : "exporting";
    if (kind === "battery") return watts > 0 ? "supplying" : "charging";
    return "generating";
  }

  private renderChip(kind: EnergyFlowKind) {
    if (!this.flows.some((flow) => flow.kind === kind)) return nothing;
    const watts = this.flowValue(kind);
    const formatted = watts === null ? undefined : this.formatPower(Math.abs(watts));
    const names: Record<EnergyFlowKind, string> = {
      solar: "Solar",
      grid: "Grid",
      battery: "Battery",
    };
    return html`
      <div class=${`chip chip-${kind}`}>
        <span class="dot" aria-hidden="true"></span>
        <span class="chip-copy">
          <small>${names[kind]}</small>
          <strong
            >${formatted
              ? html`${formatted.value}<em>${formatted.unit}</em>`
              : "—"}</strong
          >
          <span>${watts === null ? "unavailable" : this.flowLabel(kind, watts)}</span>
        </span>
      </div>
    `;
  }

  private deviation(live: number | null) {
    if (live === null || !this.baseline) return null;
    const hour = Math.floor(fractionalHour(this.now, this.timeZone));
    return describeDeviation(live, this.baseline.hours[hour] ?? null);
  }

  private summary(live: number | null): string {
    if (live === null) return "Home power unavailable";
    const formatted = this.formatPower(live);
    const deviation = this.deviation(live);
    const base = `Home load ${formatted.value} ${formatted.unit}`;
    return deviation ? `${base}, ${deviation.sentence.toLowerCase()}` : base;
  }

  protected render() {
    const live = this.currentPower();
    const formatted = live === null ? undefined : this.formatPower(live);
    const deviation = this.deviation(live);
    const snapshot =
      this.config.entity || !this._hass
        ? null
        : powerSnapshotInWatts(this._hass.states, this.channels);
    const selfPowered = snapshot ? powerInsights(snapshot).selfPoweredPercent : null;

    return html`
      <ha-card>
        <div class=${`card ${this.compact ? "is-compact" : ""}`}>
          <header>
            <div>
              <small>Today against normal</small>
              <span>${this.config.name ?? "Home load"}</span>
            </div>
            <span class="status" title="Live data">
              <i class=${live === null ? "offline" : ""}></i> live
            </span>
          </header>

          <div class="scene">
            ${this.compact ? this.renderStrip(live) : this.renderDial(live)}
            <div class="reading">
              ${formatted
                ? html`<strong>${formatted.value}</strong><span>${formatted.unit}</span>`
                : html`<strong>—</strong>`}
              <small>home now</small>
            </div>
          </div>

          <p
            class=${`verdict ${deviation ? deviation.direction : "unknown"}`}
            title=${deviation ? deviation.sentence : "Baseline not available yet"}
          >
            ${deviation ? deviation.sentence : "Comparing with your normal day"}
          </p>

          <div class="legend" aria-hidden="true">
            <span class="key band"></span>usual range
            <span class="key line"></span>today
            <span class="key line above"></span>above
            <span class="key line below"></span>below
            <span class="key dot"></span>now
          </div>

          <div class="chips">
            ${this.renderChip("solar")} ${this.renderChip("grid")}
            ${this.renderChip("battery")}
            ${selfPowered !== null
              ? html`
                  <div class="chip chip-self">
                    <span class="dot" aria-hidden="true"></span>
                    <span class="chip-copy">
                      <small>Self powered</small>
                      <strong>${selfPowered}<em>%</em></strong>
                      <span>of home load</span>
                    </span>
                  </div>
                `
              : nothing}
          </div>

          ${this.loading
            ? html`<p class="message">Discovering Energy dashboard…</p>`
            : this.error
              ? html`<p class="message error">${this.error}</p>`
              : this.historyNote
                ? html`<p class="message">${this.historyNote}</p>`
                : nothing}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --orb-solar: #ffc857;
      --orb-grid: #68a7ff;
      --orb-battery: #b68cff;
      --orb-home: #72f5dc;
      --orb-above: #ff7a5c;
      --orb-below: #a8e05f;
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 42%, rgba(45, 120, 126, 0.16), transparent 38%),
        radial-gradient(circle at 8% 0%, rgba(95, 68, 132, 0.16), transparent 34%),
        linear-gradient(145deg, #11121a, #08090e 60%, #0d1018);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #f7f8ff;
    }
    .card {
      padding: 20px;
      position: relative;
      box-sizing: border-box;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    header div {
      display: grid;
      gap: 4px;
    }
    header div > small {
      color: #8f93a8;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    header div > span {
      font-size: 19px;
      font-weight: 650;
      letter-spacing: -0.02em;
    }
    .status {
      padding: 6px 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      color: #a7abbd;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .status i {
      display: inline-block;
      width: 7px;
      height: 7px;
      margin-right: 5px;
      border-radius: 50%;
      background: var(--orb-home);
      box-shadow: 0 0 8px var(--orb-home);
    }
    .status i.offline {
      background: #7f8b93;
      box-shadow: none;
    }
    .scene {
      margin-top: 10px;
      position: relative;
      display: grid;
      place-items: center;
    }
    .dial {
      width: 100%;
      max-width: 380px;
      height: auto;
      display: block;
    }
    .strip {
      width: 100%;
      height: auto;
      display: block;
    }
    .rim {
      fill: none;
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 1;
    }
    .spoke {
      stroke: rgba(255, 255, 255, 0.2);
      stroke-width: 1;
    }
    .hour,
    .scale {
      fill: #8b90a6;
      font-size: 13px;
      letter-spacing: 0.08em;
    }
    .hour {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .scale {
      fill: #6f7488;
      font-size: 11px;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .band {
      fill: rgba(160, 178, 210, 0.13);
      stroke: rgba(196, 212, 238, 0.42);
      stroke-width: 1;
      stroke-linejoin: round;
    }
    .lived {
      fill: rgba(255, 255, 255, 0.025);
      stroke: none;
      pointer-events: none;
    }
    .now-range {
      stroke: rgba(255, 255, 255, 0.35);
      stroke-width: 6;
      stroke-linecap: round;
    }
    .rim.mid {
      stroke: rgba(255, 255, 255, 0.07);
    }
    .tick {
      stroke-width: 4;
      stroke-linecap: round;
    }
    .tick.above {
      stroke: var(--orb-above);
      stroke-dasharray: 3 3;
    }
    .tick.below {
      stroke: var(--orb-below);
    }
    .trace {
      fill: none;
      stroke: var(--orb-home);
      stroke-width: 3;
      stroke-linejoin: round;
      stroke-linecap: round;
      filter: drop-shadow(0 0 4px currentColor);
      color: var(--orb-home);
    }
    .trace.above {
      stroke: var(--orb-above);
      color: var(--orb-above);
    }
    .trace.below {
      stroke: var(--orb-below);
      color: var(--orb-below);
    }
    .bead {
      fill: var(--orb-home);
    }
    .bead-halo {
      fill: none;
      stroke: var(--orb-home);
      stroke-width: 2;
      opacity: 0.5;
      animation: pulse 2.4s ease-out infinite;
    }
    .reading {
      position: absolute;
      display: grid;
      grid-template-columns: auto auto;
      align-items: baseline;
      justify-content: center;
      gap: 5px;
      text-align: center;
      pointer-events: none;
    }
    .is-compact .reading {
      position: static;
      margin-top: 4px;
    }
    .reading strong {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 34px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .reading span {
      font-size: 15px;
      font-weight: 600;
    }
    .reading small {
      grid-column: 1 / -1;
      margin-top: 6px;
      color: rgba(221, 255, 249, 0.72);
      font-size: 9px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .verdict {
      margin: 12px 0 0;
      padding: 9px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      font-size: 13px;
      line-height: 1.3;
      text-align: center;
    }
    .verdict.above {
      color: var(--orb-above);
    }
    .verdict.below {
      color: var(--orb-below);
    }
    .verdict.normal,
    .verdict.unknown {
      color: #9aa0b4;
    }
    .legend {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 4px 12px;
      margin-top: 8px;
      color: #767b90;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .key {
      width: 14px;
      height: 10px;
      margin-right: 5px;
      display: inline-block;
      vertical-align: middle;
    }
    .key.band {
      background: rgba(160, 178, 210, 0.14);
      box-shadow: inset 0 0 0 1px rgba(196, 212, 238, 0.4);
      border-radius: 2px;
    }
    .key.line {
      height: 2px;
      background: var(--orb-home);
    }
    .key.line.above {
      background: var(--orb-above);
    }
    .key.line.below {
      background: var(--orb-below);
    }
    .key.dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--orb-home);
    }
    .chips {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 10px;
      border-radius: 12px;
      background: rgba(20, 22, 32, 0.9);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
    }
    .chip-solar {
      color: var(--orb-solar);
    }
    .chip-grid {
      color: var(--orb-grid);
    }
    .chip-battery {
      color: var(--orb-battery);
    }
    .chip-self {
      color: var(--orb-home);
    }
    .dot {
      width: 10px;
      height: 10px;
      flex: 0 0 auto;
      border: 2px solid currentColor;
      border-radius: 50%;
    }
    .chip-battery .dot {
      border-radius: 3px;
    }
    .chip-grid .dot {
      transform: rotate(45deg);
      border-radius: 2px;
    }
    .chip-copy {
      min-width: 0;
      display: grid;
    }
    .chip-copy small,
    .chip-copy > span {
      color: #8f93a8;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-copy strong {
      margin: 2px 0;
      color: #f7f8ff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 15px;
      font-variant-numeric: tabular-nums;
    }
    .chip-copy em {
      margin-left: 3px;
      color: currentColor;
      font-size: 9px;
      font-style: normal;
    }
    .message {
      margin: 8px 0 0;
      color: #9aa0b4;
      font-size: 11px;
      text-align: center;
    }
    .message.error {
      color: var(--error-color, #ff7b7b);
    }
    @keyframes pulse {
      to {
        opacity: 0;
        stroke-width: 5;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bead-halo {
        animation: none;
        opacity: 0.35;
      }
    }
  `;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "power-orb")) {
  window.customCards.push({
    type: "power-orb",
    name: "Power Orb",
    description: "Live home power compared with your own normal day",
    documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
    preview: true,
  });
}
