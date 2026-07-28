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
  config?: {
    time_zone?: string;
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
  solarUsedPercent: number | null;
  netGridWatts: number;
  netBatteryWatts: number;
  recommendation: string;
}

export type StatisticsPeriod = "5minute" | "hour" | "day" | "week" | "month";

export interface StatisticsRow {
  start: number;
  end: number;
  mean?: number | null;
}

export interface StatisticsMetadata {
  statistic_id: string;
  display_unit_of_measurement?: string | null;
  unit_class?: string | null;
  has_mean?: boolean;
}

export interface BaselineHour {
  hour: number;
  low: number;
  median: number;
  high: number;
  liveLow: number | null;
  liveHigh: number | null;
  samples: number;
}

export interface BandPoint {
  hour: number;
  low: number;
  high: number;
}

export interface Baseline {
  hours: (BaselineHour | null)[];
  days: number;
  status: "ok" | "provisional" | "learning";
}

export interface TodayHour {
  hour: number;
  watts: number;
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
