import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  discoverPowerChannels,
  entityPowerInWatts,
  totalPowerInWatts,
} from "./energy";
import type {
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
            <span>${this.config.name ?? "Power Orb"}</span>
            <span class="status" title="Live data">
              <i class=${power === null ? "offline" : ""}></i> live
            </span>
          </header>

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
              <small>home power</small>
            </div>
          </div>

          ${this.sparkline()}
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
    }
    ha-card {
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 35%, rgba(23, 104, 122, 0.24), transparent 45%),
        var(--ha-card-background, var(--card-background-color, #10161d));
      color: var(--primary-text-color, #f4fbff);
    }
    .card {
      min-height: 320px;
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
    @media (prefers-reduced-motion: reduce) {
      .core, .ring-two { animation: none; }
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
