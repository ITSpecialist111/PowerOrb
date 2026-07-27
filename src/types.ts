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
  max_power?: number;
  unit?: "W" | "kW";
}

export interface EnergyPreferences {
  energy_sources?: unknown[];
}

export interface PowerChannel {
  entityId: string;
  multiplier: number;
}

export type EnergyFlowKind = "solar" | "grid" | "battery";

export interface EnergyFlow {
  kind: EnergyFlowKind;
  channels: PowerChannel[];
}
