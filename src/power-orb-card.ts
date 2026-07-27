import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  discoverEnergyFlows,
  discoverPowerChannels,
  entityPowerInWatts,
  flowPowerInWatts,
  totalPowerInWatts,
} from "./energy";
import type {
  EnergyFlow,
  EnergyFlowKind,
  EnergyPreferences,
  HomeAssistant,
  PowerChannel,
  PowerOrbConfig,
} from "./types";

const HISTORY_LENGTH = 60;
const PREFERENCES_REFRESH_MS = 5 * 60 * 1_000;

@customElement("power-orb")
export class PowerOrbCard extends LitElement {
  @property({ attribute: false })
  public set hass(value: HomeAssistant) {
    this._hass = value;
    this.captureSample();
    this.requestUpdate();
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  @state() private channels: PowerChannel[] = [];
  @state() private flows: EnergyFlow[] = [];
  @state() private loading = true;
  @state() private error?: string;
  @state() private samples: number[] = [];

  private _hass?: HomeAssistant;
  private config: PowerOrbConfig = { type: "custom:power-orb" };
  private unsubscribe?: () => void;
  private refreshTimer?: number;
  private connectionGeneration = 0;
  private connecting?: Promise<void>;
  private lastSampleAt = 0;

  public setConfig(config: PowerOrbConfig): void {
    if (!config || config.type !== "custom:power-orb") {
      throw new Error("Power Orb requires type: custom:power-orb");
    }
    if (config.max_power !== undefined && config.max_power <= 0) {
      throw new Error("max_power must be greater than zero");
    }
    this.config = config;
    this.channels = config.entity
      ? [{ entityId: config.entity, multiplier: 1 }]
      : [];
    this.flows = [];
    this.loading = !config.entity;
    this.error = undefined;
    this.samples = [];
    this.disconnectData();
    if (this.isConnected && this._hass) void this.connect();
  }

  public static getStubConfig(): PowerOrbConfig {
    return { type: "custom:power-orb" };
  }

  public getCardSize(): number {
    return 7;
  }

  public getGridOptions(): {
    rows: number;
    columns: number;
    min_rows: number;
    min_columns: number;
  } {
    return {
      rows: 6,
      columns: 6,
      min_rows: 6,
      min_columns: 3,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this._hass) void this.connect();
  }

  public disconnectedCallback(): void {
    this.disconnectData();
    super.disconnectedCallback();
  }

  private connect(): Promise<void> {
    if (!this._hass || this.config.entity) return Promise.resolve();
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
    if (this.refreshTimer !== undefined) {
      window.clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
    this.connecting = undefined;
  }

  private async loadEnergyPreferences(): Promise<void> {
    if (!this._hass || this.config.entity) return;
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
      this.captureSample(true);
    } catch {
      this.error = "Power Orb could not read the Energy dashboard.";
    } finally {
      this.loading = false;
    }
  }

  private currentPower(): number | null {
    if (!this._hass) return null;
    if (this.config.entity) {
      return entityPowerInWatts(this._hass.states[this.config.entity]);
    }
    return totalPowerInWatts(this._hass.states, this.channels);
  }

  private captureSample(force = false): void {
    const now = Date.now();
    if (!force && now - this.lastSampleAt < 1_000) return;
    const power = this.currentPower();
    if (power === null) return;
    this.lastSampleAt = now;
    this.samples = [...this.samples.slice(-(HISTORY_LENGTH - 1)), power];
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

  private sparkline() {
    if (this.samples.length < 2) return nothing;
    const max = Math.max(...this.samples, 1);
    const denominator = Math.max(this.samples.length - 1, 1);
    const points = this.samples
      .map((value, index) => {
        const x = (index / denominator) * 100;
        const y = 38 - (value / max) * 34;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
    return svg`
      <svg class="sparkline" viewBox="0 0 100 42" preserveAspectRatio="none"
        role="img" aria-label="Recent power trend">
        <polyline points=${points}></polyline>
      </svg>
    `;
  }

  private flowValue(kind: EnergyFlowKind): number | null {
    if (!this._hass) return null;
    const flow = this.flows.find((candidate) => candidate.kind === kind);
    return flow ? flowPowerInWatts(this._hass.states, flow) : null;
  }

  private flowLabel(kind: EnergyFlowKind, watts: number): string {
    if (Math.abs(watts) < 1) return "idle";
    if (kind === "grid") return watts > 0 ? "importing" : "exporting";
    if (kind === "battery") return watts > 0 ? "supplying" : "charging";
    return watts > 0 ? "generating" : "idle";
  }

  private renderFlow(kind: EnergyFlowKind) {
    const flow = this.flows.find((candidate) => candidate.kind === kind);
    if (!flow) return nothing;

    const watts = this.flowValue(kind);
    const formatted = watts === null ? undefined : this.formatPower(Math.abs(watts));
    const active = watts !== null && Math.abs(watts) >= 1;
    const speed = active
      ? Math.max(0.9, 4.5 - Math.min(Math.abs(watts), 10_000) / 2_800)
      : 0;
    const direction = watts !== null && watts < 0 ? "outward" : "inward";
    const names: Record<EnergyFlowKind, string> = {
      solar: "Solar",
      grid: "Grid",
      battery: "Battery",
    };

    return html`
      <div
        class=${`flow flow-${kind} ${active ? direction : "idle"}`}
        style=${`--flow-speed:${speed}s`}
        aria-label=${`${names[kind]} ${formatted ? `${formatted.value} ${formatted.unit}, ${this.flowLabel(kind, watts ?? 0)}` : "unavailable"}`}
      >
        <span class="flow-icon" aria-hidden="true"></span>
        <span class="flow-copy">
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

  protected render() {
    const power = this.currentPower();
    const maxPower =
      this.config.max_power ?? Math.max(...this.samples, power ?? 0, 5_000);
    const intensity =
      power === null ? 0 : Math.min(1, Math.max(0.08, power / maxPower));
    const formatted = power === null ? undefined : this.formatPower(power);

    return html`
      <ha-card>
        <div class="card" style=${`--intensity:${intensity}`}>
          <header>
            <div>
              <small>Energy constellation</small>
              <span>${this.config.name ?? "Power Orb"}</span>
            </div>
            <span class="status" title="Live data">
              <i class=${power === null ? "offline" : ""}></i> live
            </span>
          </header>

          <div class=${`constellation ${this.config.entity ? "direct" : ""}`}>
            <svg
              class="flow-map"
              viewBox="0 0 600 360"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              ${(["solar", "grid", "battery"] as EnergyFlowKind[]).map(
                (kind) => {
                  if (!this.flows.some((flow) => flow.kind === kind)) {
                    return nothing;
                  }
                  const paths: Record<EnergyFlowKind, string> = {
                    solar: "M 105 78 C 185 78, 205 180, 300 180",
                    grid: "M 495 78 C 415 78, 395 180, 300 180",
                    battery: "M 105 286 C 185 286, 205 180, 300 180",
                  };
                  const watts = this.flowValue(kind);
                  const active = watts !== null && Math.abs(watts) >= 1;
                  const direction = watts !== null && watts < 0 ? "outward" : "inward";
                  const speed = active
                    ? Math.max(
                        0.9,
                        4.5 - Math.min(Math.abs(watts), 10_000) / 2_800,
                      )
                    : 0;
                  return svg`
                    <path class=${`track ${kind}`} d=${paths[kind]}></path>
                    <path
                      class=${`energy ${kind} ${active ? direction : "idle"}`}
                      style=${`--flow-speed:${speed}s`}
                      d=${paths[kind]}
                    ></path>
                  `;
                },
              )}
            </svg>

            ${this.config.entity
              ? nothing
              : html`
                  ${this.renderFlow("solar")}
                  ${this.renderFlow("grid")}
                  ${this.renderFlow("battery")}
                `}

            <div class="home">
              <div class="orb" aria-hidden="true">
                <div class="facet"></div>
                <div class="core"></div>
                <div class="ring ring-one"></div>
                <div class="ring ring-two"></div>
              </div>
              <div class="reading" aria-live="polite">
                <small>Home</small>
                ${formatted
                  ? html`<strong>${formatted.value}</strong
                      ><span>${formatted.unit}</span>`
                  : html`<strong>—</strong>`}
                <em>live demand</em>
              </div>
            </div>
          </div>

          <div class="trend">
            <span>60-second demand trace</span>
            ${this.sparkline()}
          </div>
          ${this.loading
            ? html`<p class="message">Discovering Energy dashboard…</p>`
            : this.error
              ? html`<p class="message error">${this.error}</p>`
              : html`<p class="message">
                  ${this.config.entity
                    ? this.config.entity
                    : `${this.channels.length} live ${this.channels.length === 1 ? "sensor" : "sensors"}`}
                </p>`}
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
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 45%, rgba(45, 120, 126, 0.15), transparent 35%),
        radial-gradient(circle at 8% 0%, rgba(95, 68, 132, 0.16), transparent 34%),
        linear-gradient(145deg, #11121a, #08090e 60%, #0d1018);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--primary-text-color, #f7f8ff);
    }
    .card {
      min-height: 500px;
      padding: 22px;
      position: relative;
      box-sizing: border-box;
    }
    .card::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.22;
      background-image: radial-gradient(rgba(255, 255, 255, 0.32) 0.5px, transparent 0.5px);
      background-size: 7px 7px;
      mask-image: linear-gradient(to bottom, black, transparent 70%);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 2;
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
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.035);
      color: #a7abbd;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
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
    .constellation {
      height: 350px;
      margin-top: 8px;
      position: relative;
    }
    .constellation.direct {
      display: grid;
      place-items: center;
    }
    .flow-map {
      position: absolute;
      width: 100%;
      height: 100%;
      inset: 0;
      overflow: visible;
    }
    .flow-map path {
      fill: none;
      vector-effect: non-scaling-stroke;
    }
    .flow-map .track {
      stroke: rgba(255, 255, 255, 0.08);
      stroke-width: 2;
    }
    .flow-map .energy {
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 1 14;
      animation: current var(--flow-speed) linear infinite;
      filter: drop-shadow(0 0 5px currentColor);
    }
    .flow-map .energy.inward {
      animation-direction: reverse;
    }
    .flow-map .energy.idle {
      opacity: 0.2;
      animation: none;
    }
    .flow-map .solar { color: var(--orb-solar); stroke: var(--orb-solar); }
    .flow-map .grid { color: var(--orb-grid); stroke: var(--orb-grid); }
    .flow-map .battery { color: var(--orb-battery); stroke: var(--orb-battery); }
    .flow {
      width: 116px;
      min-height: 68px;
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 9px;
      position: absolute;
      z-index: 2;
      box-sizing: border-box;
      border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
      border-radius: 16px;
      background: rgba(18, 20, 30, 0.76);
      box-shadow: inset 0 1px rgba(255, 255, 255, 0.055), 0 14px 35px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(12px);
    }
    .flow-solar,
    .flow-grid,
    .flow-battery {
      transform: translate(-50%, -50%);
    }
    .flow-solar { top: 21.67%; left: 17.5%; color: var(--orb-solar); }
    .flow-grid { top: 21.67%; left: 82.5%; color: var(--orb-grid); }
    .flow-battery { top: 79.44%; left: 17.5%; color: var(--orb-battery); }
    .flow-icon {
      width: 12px;
      height: 12px;
      flex: 0 0 auto;
      border: 2px solid currentColor;
      border-radius: 50%;
      box-shadow: 0 0 13px currentColor;
    }
    .flow-battery .flow-icon {
      border-radius: 3px;
    }
    .flow-grid .flow-icon {
      transform: rotate(45deg);
      border-radius: 2px;
    }
    .flow-copy {
      min-width: 0;
      display: grid;
    }
    .flow-copy small,
    .flow-copy > span {
      color: #8f93a8;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .flow-copy strong {
      margin: 2px 0;
      color: #f7f8ff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 16px;
      font-weight: 650;
      font-variant-numeric: tabular-nums;
    }
    .flow-copy em {
      margin-left: 3px;
      color: currentColor;
      font-size: 9px;
      font-style: normal;
    }
    .home {
      width: 174px;
      height: 174px;
      display: grid;
      place-items: center;
      position: absolute;
      z-index: 3;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .direct .home {
      position: relative;
      left: auto;
      top: auto;
      transform: none;
    }
    .orb {
      width: 146px;
      height: 146px;
      position: absolute;
      border-radius: 50%;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.12), transparent 38%),
        radial-gradient(circle at 45% 42%, #26363c 0%, #111b22 44%, #06090d 76%);
      border: 1px solid rgba(164, 255, 238, 0.24);
      box-shadow:
        0 0 calc(12px + 30px * var(--intensity)) rgba(85, 234, 211, calc(0.14 + 0.36 * var(--intensity))),
        inset -22px -18px 34px rgba(0, 0, 0, 0.62);
      transform: scale(calc(0.94 + 0.06 * var(--intensity)));
      transition: box-shadow 0.8s ease, transform 0.8s ease;
    }
    .facet {
      position: absolute;
      inset: 9%;
      border-radius: 42% 58% 48% 52%;
      background:
        linear-gradient(32deg, transparent 48%, rgba(145, 255, 235, 0.08) 49%, transparent 51%),
        linear-gradient(145deg, transparent 47%, rgba(255, 255, 255, 0.07) 48%, transparent 50%);
      transform: rotate(14deg);
    }
    .core {
      position: absolute;
      inset: 18%;
      border-radius: 50%;
      border: 1px solid rgba(155, 255, 237, 0.28);
      animation: breathe 3s ease-in-out infinite;
    }
    .ring {
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(114, 245, 220, 0.3);
      border-radius: 50%;
      transform: rotateX(68deg) rotateZ(12deg);
    }
    .ring-two {
      inset: -22px 2px;
      transform: rotateY(67deg) rotateZ(-22deg);
      animation: orbit 8s linear infinite;
    }
    .reading {
      position: absolute;
      z-index: 2;
      display: grid;
      grid-template-columns: auto auto;
      align-items: baseline;
      gap: 5px;
      text-align: center;
      text-shadow: 0 2px 12px #001b18;
    }
    .reading strong {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 31px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .reading span {
      font-size: 15px;
      font-weight: 600;
    }
    .reading small,
    .reading em {
      grid-column: 1 / -1;
      color: rgba(221, 255, 249, 0.76);
      font-size: 9px;
      font-style: normal;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .reading small { margin-bottom: 5px; }
    .reading em { margin-top: 6px; }
    .trend {
      height: 54px;
      padding: 7px 10px 0;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.025);
    }
    .trend > span {
      position: absolute;
      color: #74788d;
      font-size: 8px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .sparkline {
      display: block;
      width: 100%;
      height: 42px;
      opacity: 0.75;
    }
    .sparkline polyline {
      fill: none;
      stroke: var(--orb-home);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .message {
      min-height: 16px;
      margin: 8px 0 0;
      color: var(--secondary-text-color, #aab8c2);
      font-size: 12px;
      text-align: center;
    }
    .message.error {
      color: var(--error-color, #ff7b7b);
    }
    @keyframes breathe {
      50% { transform: scale(1.08); opacity: 0.65; }
    }
    @keyframes orbit {
      to { transform: rotateY(67deg) rotateZ(338deg); }
    }
    @keyframes current {
      to { stroke-dashoffset: 30; }
    }
    @media (max-width: 430px) {
      .card { padding: 17px; }
      .flow { width: 104px; padding: 8px; }
      .flow-copy strong { font-size: 14px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .core, .ring-two, .flow-map .energy { animation: none; }
      .flow-map .energy { stroke-dasharray: none; opacity: 0.65; }
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
    description: "Live home power from the Home Assistant Energy dashboard",
    documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
    preview: true,
  });
}
