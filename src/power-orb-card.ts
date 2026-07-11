import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  discoverPowerChannels,
  entityPowerInWatts,
  powerInsights,
  powerSnapshotInWatts,
  totalPowerInWatts,
} from "./energy";
import type {
  EnergyPreferences,
  HomeAssistant,
  PowerChannel,
  PowerOrbConfig,
  PowerSnapshot,
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
      ? [{ entityId: config.entity, multiplier: 1, role: "grid" }]
      : [];
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

  private currentSnapshot(): PowerSnapshot | null {
    if (!this._hass || this.config.entity) return null;
    return powerSnapshotInWatts(this._hass.states, this.channels);
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

  private flowStyle(watts: number, maxPower: number): string {
    const flow = maxPower > 0 ? Math.min(1, Math.max(0, watts / maxPower)) : 0;
    return `--flow:${flow}`;
  }

  private metric(label: string, watts: number, detail: string) {
    const formatted = this.formatPower(watts);
    return html`
      <div class=${`metric ${watts > 0 ? "active" : ""}`}>
        <span>${label}</span>
        <strong>${formatted.value}<small>${formatted.unit}</small></strong>
        <em>${detail}</em>
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
    const snapshot = this.currentSnapshot();
    const insights = snapshot ? powerInsights(snapshot) : undefined;
    const gridNet = insights?.netGridWatts ?? 0;
    const batteryNet = insights?.netBatteryWatts ?? 0;

    return html`
      <ha-card>
        <div class="card" style=${`--intensity:${intensity}`}>
          <header>
            <span>${this.config.name ?? "Power Orb"}</span>
            <span class="status" title="Live data">
              <i class=${power === null ? "offline" : ""}></i> live
            </span>
          </header>

          ${snapshot
            ? html`
                <section class="dashboard" aria-label="Live energy dashboard">
                  <div class="sky" aria-hidden="true">
                    <div class="sun"></div>
                    <svg class="arc" viewBox="0 0 260 100" preserveAspectRatio="none">
                      <path d="M12 88 C 70 8, 188 8, 248 88"></path>
                    </svg>
                  </div>

                  <div class="flow flow-solar ${snapshot.solar > 0 ? "active" : ""}" style=${this.flowStyle(snapshot.solar, maxPower)}></div>
                  <div class="flow flow-grid ${gridNet !== 0 ? "active" : ""}" style=${this.flowStyle(Math.abs(gridNet), maxPower)}></div>
                  <div class="flow flow-battery ${batteryNet !== 0 ? "active" : ""}" style=${this.flowStyle(Math.abs(batteryNet), maxPower)}></div>

                  <div class="node solar-node">
                    <span>Solar</span>
                    <strong>${this.formatPower(snapshot.solar).value}<small>${this.formatPower(snapshot.solar).unit}</small></strong>
                  </div>
                  <div class="node home-node">
                    <span>Home</span>
                    <strong>${this.formatPower(snapshot.homeLoad).value}<small>${this.formatPower(snapshot.homeLoad).unit}</small></strong>
                  </div>
                  <div class="node grid-node">
                    <span>Grid</span>
                    <strong>${this.formatPower(Math.abs(gridNet)).value}<small>${this.formatPower(Math.abs(gridNet)).unit}</small></strong>
                  </div>
                  <div class="node battery-node">
                    <span>Battery</span>
                    <strong>${this.formatPower(Math.abs(batteryNet)).value}<small>${this.formatPower(Math.abs(batteryNet)).unit}</small></strong>
                  </div>
                </section>

                <section class="metrics" aria-label="Energy source details">
                  ${this.metric("Solar", snapshot.solar, "production")}
                  ${this.metric(
                    "Grid",
                    Math.abs(gridNet),
                    gridNet < 0 ? "exporting" : gridNet > 0 ? "importing" : "idle",
                  )}
                  ${this.metric(
                    "Battery",
                    Math.abs(batteryNet),
                    batteryNet < 0 ? "charging" : batteryNet > 0 ? "discharging" : "idle",
                  )}
                  ${this.metric("Home", snapshot.homeLoad, "estimated load")}
                </section>

                <section class="insights" aria-label="Automatic energy insights">
                  <div>
                    <span>Self powered</span>
                    <strong>${insights?.selfPoweredPercent ?? 0}<small>%</small></strong>
                  </div>
                  <div>
                    <span>Solar used</span>
                    <strong>${insights?.solarUsedPercent ?? 0}<small>%</small></strong>
                  </div>
                  <p>${insights?.recommendation}</p>
                </section>
              `
            : html`
                <div class="visual">
                  <div class="orb" aria-hidden="true">
                    <div class="core"></div>
                    <div class="ring ring-one"></div>
                    <div class="ring ring-two"></div>
                  </div>
                  <div class="reading" aria-live="polite">
                    ${formatted
                      ? html`<strong>${formatted.value}</strong
                          ><span>${formatted.unit}</span>`
                      : html`<strong>—</strong>`}
                    <small>live power</small>
                  </div>
                </div>
              `}

          <div class="trend">
            <div class="trend-label">
              <span>Recent load</span>
              ${formatted
                ? html`<strong>${formatted.value}<small>${formatted.unit}</small></strong>`
                : nothing}
            </div>
            ${this.sparkline()}
          </div>

          ${this.loading
            ? html`<p class="message">Discovering Energy dashboard…</p>`
            : this.error
              ? html`<p class="message error">${this.error}</p>`
              : html`<p class="message">
                  ${this.config.entity
                    ? this.config.entity
                    : `${this.channels.length} Energy dashboard ${this.channels.length === 1 ? "sensor" : "sensors"} mapped automatically`}
                </p>`}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 35%, rgba(23, 104, 122, 0.24), transparent 45%),
        var(--ha-card-background, var(--card-background-color, #10161d));
      color: var(--primary-text-color, #f4fbff);
    }
    .card {
      min-height: 430px;
      padding: 20px;
      position: relative;
      box-sizing: border-box;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      font-weight: 600;
    }
    .status {
      color: var(--secondary-text-color, #aab8c2);
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
      background: #44e0a1;
      box-shadow: 0 0 8px #44e0a1;
    }
    .status i.offline {
      background: #7f8b93;
      box-shadow: none;
    }
    .visual {
      height: 205px;
      display: grid;
      place-items: center;
      position: relative;
    }
    .orb {
      width: 156px;
      height: 156px;
      position: relative;
      border-radius: 50%;
      background:
        radial-gradient(circle at 42% 38%, rgba(255, 255, 255, 0.9), transparent 5%),
        radial-gradient(circle at 50% 50%, #8cf7ee 0%, #20b8ca 30%, #086177 68%, #032d3c 100%);
      box-shadow:
        0 0 calc(18px + 36px * var(--intensity)) rgba(41, 218, 222, calc(0.2 + 0.55 * var(--intensity))),
        inset -18px -16px 30px rgba(0, 12, 28, 0.55);
      transform: scale(calc(0.94 + 0.06 * var(--intensity)));
      transition: box-shadow 0.8s ease, transform 0.8s ease;
    }
    .core {
      position: absolute;
      inset: 18%;
      border-radius: 50%;
      border: 1px solid rgba(177, 255, 250, 0.35);
      animation: breathe 3s ease-in-out infinite;
    }
    .ring {
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(77, 225, 232, 0.35);
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
      text-shadow: 0 2px 12px #002b37;
    }
    .reading strong {
      font-size: 35px;
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
      color: rgba(235, 255, 255, 0.82);
      font-size: 10px;
      letter-spacing: 0.1em;
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
      stroke: #55dce3;
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .dashboard {
      position: relative;
      min-height: 230px;
      margin: 18px 0 14px;
      border-radius: 18px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(24, 91, 120, 0.34), transparent 54%),
        linear-gradient(180deg, transparent 58%, rgba(38, 83, 48, 0.28) 59%, rgba(25, 43, 32, 0.58));
      box-shadow: inset 0 0 0 1px rgba(180, 231, 232, 0.12);
    }
    .sky {
      position: absolute;
      inset: 12px 16px auto;
      height: 88px;
      opacity: 0.95;
    }
    .sun {
      position: absolute;
      left: 50%;
      top: 4px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #ffd978;
      box-shadow: 0 0 34px rgba(255, 207, 94, 0.76);
      transform: translateX(-50%);
    }
    .arc {
      position: absolute;
      inset: 10px 0 0;
      width: 100%;
      height: 82px;
    }
    .arc path {
      fill: none;
      stroke: rgba(255, 238, 188, 0.5);
      stroke-width: 1.4;
      stroke-dasharray: 4 6;
    }
    .flow {
      position: absolute;
      background: rgba(113, 234, 220, calc(0.22 + 0.58 * var(--flow)));
      border-radius: 999px;
      box-shadow: 0 0 calc(8px + 18px * var(--flow)) rgba(76, 229, 220, calc(0.12 + 0.5 * var(--flow)));
      opacity: 0.36;
      transform-origin: center;
      transition: opacity 0.5s ease, box-shadow 0.5s ease;
    }
    .flow.active {
      opacity: 1;
    }
    .flow::after {
      content: "";
      position: absolute;
      inset: -2px auto -2px 0;
      width: 28%;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.86), transparent);
      animation: flow 2.3s linear infinite;
    }
    .flow-solar {
      left: 49%;
      top: 84px;
      width: 5px;
      height: 66px;
    }
    .flow-solar::after {
      width: 100%;
      height: 24px;
      animation-name: flow-down;
    }
    .flow-grid {
      left: 62%;
      top: 154px;
      width: 23%;
      height: calc(2px + 5px * var(--flow));
    }
    .flow-battery {
      left: 17%;
      top: 154px;
      width: 23%;
      height: calc(2px + 5px * var(--flow));
    }
    .node {
      position: absolute;
      display: grid;
      place-items: center;
      width: 88px;
      min-height: 58px;
      padding: 8px;
      box-sizing: border-box;
      border-radius: 14px;
      background: rgba(7, 22, 30, 0.72);
      border: 1px solid rgba(175, 239, 235, 0.18);
      box-shadow: 0 14px 26px rgba(0, 0, 0, 0.18);
      text-align: center;
    }
    .node span,
    .metric span,
    .trend-label span {
      color: var(--secondary-text-color, #aab8c2);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .node strong,
    .metric strong,
    .trend-label strong {
      font-size: 18px;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
    .node small,
    .metric small,
    .trend-label small {
      margin-left: 3px;
      font-size: 10px;
      font-weight: 600;
    }
    .solar-node {
      left: 50%;
      top: 62px;
      transform: translateX(-50%);
    }
    .home-node {
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%);
      background: rgba(6, 35, 43, 0.9);
      border-color: rgba(102, 235, 226, 0.38);
    }
    .grid-node {
      right: 16px;
      bottom: 22px;
    }
    .battery-node {
      left: 16px;
      bottom: 22px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }
    .metric {
      min-width: 0;
      padding: 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.045);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
    }
    .metric.active {
      background: rgba(61, 211, 198, 0.1);
    }
    .metric strong {
      display: block;
      margin-top: 7px;
    }
    .metric em {
      display: block;
      margin-top: 3px;
      color: var(--secondary-text-color, #aab8c2);
      font-size: 11px;
      font-style: normal;
    }
    .trend {
      margin-top: 12px;
    }
    .insights {
      display: grid;
      grid-template-columns: minmax(78px, 0.45fr) minmax(78px, 0.45fr) minmax(0, 1.3fr);
      gap: 8px;
      margin-top: 8px;
      align-items: stretch;
    }
    .insights div,
    .insights p {
      margin: 0;
      padding: 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.055);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
    }
    .insights span {
      display: block;
      color: var(--secondary-text-color, #aab8c2);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .insights strong {
      display: block;
      margin-top: 5px;
      font-size: 22px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .insights small {
      margin-left: 2px;
      font-size: 11px;
    }
    .insights p {
      color: var(--primary-text-color, #f4fbff);
      font-size: 12px;
      line-height: 1.35;
    }
    .trend-label {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 3px;
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
    @keyframes flow {
      to { transform: translateX(360%); }
    }
    @keyframes flow-down {
      to { transform: translateY(280%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .core, .ring-two, .flow::after { animation: none; }
    }
    @media (max-width: 420px) {
      .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .insights {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .insights p {
        grid-column: 1 / -1;
      }
      .node {
        width: 78px;
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
    description: "Live solar, grid, battery, and home power from the Energy dashboard",
    documentationURL: "https://github.com/ITSpecialist111/PowerOrb",
    preview: true,
  });
}
