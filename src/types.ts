export interface HassEntity {
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeEvents(
      callback: () => void,
      eventType: string,
    ): Promise<() => void>;
  };
  locale?: {
    language?: string;
  };
  language?: string;
}

export interface PowerOrbConfig {
  type: "custom:power-orb";
  name?: string;
  entity?: string;
  entities?: Partial<Record<EnergyFlowKind, EnergyFlowConfig>>;
  max_power?: number;
  unit?: "W" | "kW";
}

export interface EnergyPreferences {
  energy_sources?: unknown[];
}

export type PowerChannelRole =
  | "solar"
  | "grid"
  | "grid_import"
  | "grid_export"
  | "battery"
  | "battery_charge"
  | "battery_discharge";

export interface PowerChannel {
  entityId: string;
  multiplier: number;
  role: PowerChannelRole;
}

export interface PowerSnapshot {
  solar: number;
  gridImport: number;
  gridExport: number;
  batteryCharge: number;
  batteryDischarge: number;
  homeLoad: number;
  activeChannels: number;
}

export interface PowerInsights {
  selfPoweredPercent: number;
  solarUsedPercent: number;
  netGridWatts: number;
  netBatteryWatts: number;
  recommendation: string;
}

export type EnergyFlowKind = "solar" | "grid" | "battery";

export type EnergyFlowConfig =
  | string
  | string[]
  | {
      entity?: string | string[];
      inverted?: string | string[];
      from?: string | string[];
      to?: string | string[];
    };

export interface EnergyFlow {
  kind: EnergyFlowKind;
  channels: PowerChannel[];
}
