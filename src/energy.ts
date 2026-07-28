import type {
  EnergyFlow,
  EnergyFlowKind,
  EnergyPreferences,
  HassEntity,
  PowerChannel,
  PowerChannelRole,
  PowerInsights,
  PowerSnapshot,
} from "./types";

type UnknownRecord = Record<string, unknown>;

/**
 * Below this a channel is treated as idle.
 *
 * Anything smaller also rounds away at the card's display precision, so a
 * single constant keeps the label and the number from disagreeing.
 */
export const IDLE_WATTS = 25;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function stringValue(record: UnknownRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function addChannel(
  channels: PowerChannel[],
  entityId: string | undefined,
  multiplier: number,
  role: PowerChannelRole,
): void {
  if (!entityId) return;
  const existing = channels.find(
    (channel) => channel.entityId === entityId && channel.role === role,
  );
  if (existing) {
    existing.multiplier += multiplier;
  } else {
    channels.push({ entityId, multiplier, role });
  }
}

function addPowerConfigChannels(
  channels: PowerChannel[],
  config: UnknownRecord,
  roles: {
    net: PowerChannelRole;
    positive: PowerChannelRole;
    negative: PowerChannelRole;
  },
): void {
  const standard = stringValue(config, "stat_rate");
  const inverted = stringValue(config, "stat_rate_inverted");
  if (standard || inverted) {
    addChannel(channels, standard, 1, roles.net);
    addChannel(channels, inverted, -1, roles.net);
    return;
  }

  addChannel(channels, stringValue(config, "stat_rate_from"), 1, roles.positive);
  addChannel(channels, stringValue(config, "stat_rate_to"), -1, roles.negative);
}

export function discoverEnergyFlows(
  preferences: EnergyPreferences,
): EnergyFlow[] {
  const flows = new Map<EnergyFlowKind, PowerChannel[]>();

  for (const source of preferences.energy_sources ?? []) {
    if (!isRecord(source)) continue;
    const type = stringValue(source, "type");
    if (type !== "solar" && type !== "grid" && type !== "battery") continue;

    const channels = flows.get(type) ?? [];
    flows.set(type, channels);
    const powerConfig = isRecord(source.power_config)
      ? source.power_config
      : source;

    if (type === "solar") {
      addChannel(channels, stringValue(source, "stat_rate"), 1, "solar");
    } else if (type === "grid") {
      const directRate = stringValue(source, "stat_rate");
      if (directRate) {
        addChannel(channels, directRate, 1, "grid");
      } else {
        addPowerConfigChannels(channels, powerConfig, {
          net: "grid",
          positive: "grid_import",
          negative: "grid_export",
        });
      }
    } else if (type === "battery") {
      addPowerConfigChannels(channels, powerConfig, {
        net: "battery",
        positive: "battery_discharge",
        negative: "battery_charge",
      });
    }
  }

  return [...flows.entries()]
    .map(([kind, channels]) => ({
      kind,
      channels: channels.filter((channel) => channel.multiplier !== 0),
    }))
    .filter((flow) => flow.channels.length > 0);
}

const FLOW_ROLES: Record<
  EnergyFlowKind,
  { positive: PowerChannelRole; negative: PowerChannelRole }
> = {
  solar: { positive: "solar", negative: "solar" },
  grid: { positive: "grid_import", negative: "grid_export" },
  battery: { positive: "battery_discharge", negative: "battery_charge" },
};

function entityList(value: unknown, kind: string, key: string): string[] {
  const list = typeof value === "string" ? [value] : value;
  if (
    !Array.isArray(list) ||
    list.length === 0 ||
    list.some((entityId) => typeof entityId !== "string" || !entityId)
  ) {
    throw new Error(`${kind}.${key} must contain one or more entity IDs`);
  }
  return list as string[];
}

function configuredChannels(
  kind: EnergyFlowKind,
  configured: unknown,
): PowerChannel[] {
  if (typeof configured === "string" || Array.isArray(configured)) {
    return entityList(configured, kind, "entity").map((entityId) => ({
      entityId,
      multiplier: 1,
      role: kind,
    }));
  }

  if (!isRecord(configured)) {
    throw new Error(`${kind} must contain one or more entity IDs`);
  }

  const allowed = ["entity", "inverted", "from", "to"];
  const unsupported = Object.keys(configured).filter(
    (key) => !allowed.includes(key),
  );
  if (unsupported.length > 0) {
    throw new Error(`${kind} does not support ${unsupported.join(", ")}`);
  }

  const directional = "from" in configured || "to" in configured;
  const modes =
    Number("entity" in configured) + Number("inverted" in configured) + Number(directional);
  if (modes > 1) {
    throw new Error(
      `${kind} must use only one of entity, inverted, or from and to`,
    );
  }

  if ("entity" in configured) {
    return entityList(configured.entity, kind, "entity").map((entityId) => ({
      entityId,
      multiplier: 1,
      role: kind,
    }));
  }

  if ("inverted" in configured) {
    return entityList(configured.inverted, kind, "inverted").map((entityId) => ({
      entityId,
      multiplier: -1,
      role: kind,
    }));
  }

  if (directional) {
    if (kind === "solar") {
      throw new Error("solar does not support from and to; use a single entity");
    }
    if (!("from" in configured) || !("to" in configured)) {
      throw new Error(`${kind} requires both from and to`);
    }
    const roles = FLOW_ROLES[kind];
    return [
      ...entityList(configured.from, kind, "from").map((entityId) => ({
        entityId,
        multiplier: 1,
        role: roles.positive,
      })),
      ...entityList(configured.to, kind, "to").map((entityId) => ({
        entityId,
        multiplier: -1,
        role: roles.negative,
      })),
    ];
  }

  throw new Error(`${kind} must define entity, inverted, or from and to`);
}

export function configuredEnergyFlows(mapping: unknown): EnergyFlow[] {
  if (!isRecord(mapping)) {
    throw new Error("entities must map solar, grid, or battery to entity IDs");
  }

  const kinds: EnergyFlowKind[] = ["solar", "grid", "battery"];
  if (Object.keys(mapping).some((key) => !kinds.includes(key as EnergyFlowKind))) {
    throw new Error("entities only supports solar, grid, and battery roles");
  }

  const assigned = new Set<string>();
  const flows: EnergyFlow[] = [];
  for (const kind of kinds) {
    const configured = mapping[kind];
    if (configured === undefined) continue;

    const channels = configuredChannels(kind, configured);
    for (const channel of channels) {
      if (assigned.has(channel.entityId)) {
        throw new Error(
          `${channel.entityId} cannot be assigned to more than one role`,
        );
      }
      assigned.add(channel.entityId);
    }
    flows.push({ kind, channels });
  }

  if (flows.length === 0) {
    throw new Error("entities must define at least one energy role");
  }
  return flows;
}

export function discoverPowerChannels(
  preferences: EnergyPreferences,
): PowerChannel[] {
  return discoverEnergyFlows(preferences).flatMap((flow) => flow.channels);
}

export function entityPowerInWatts(entity: HassEntity | undefined): number | null {
  if (!entity) return null;
  const value = Number(entity.state);
  if (!Number.isFinite(value)) return null;

  const unit = entity.attributes.unit_of_measurement?.toLowerCase();
  if (unit === "kw") return value * 1_000;
  if (unit === "mw") return value * 1_000_000;
  return unit === "w" || unit === undefined ? value : null;
}

/**
 * Home load from every configured channel.
 *
 * All-or-nothing on purpose: dropping an unavailable channel would leave a
 * number that looks plausible but omits a whole term, and it would no longer
 * be comparable with the historical baseline, which discards partial buckets.
 */
export function totalPowerInWatts(
  states: Record<string, HassEntity>,
  channels: PowerChannel[],
): number | null {
  if (channels.length === 0) return null;
  let total = 0;

  for (const channel of channels) {
    const value = entityPowerInWatts(states[channel.entityId]);
    if (value === null) return null;
    total += value * channel.multiplier;
  }

  return Math.max(0, total);
}

export function flowPowerInWatts(
  states: Record<string, HassEntity>,
  flow: EnergyFlow,
): number | null {
  let total = 0;
  let validChannels = 0;

  for (const channel of flow.channels) {
    const value = entityPowerInWatts(states[channel.entityId]);
    if (value === null) return null;
    total += value * channel.multiplier;
    validChannels += 1;
  }

  return validChannels > 0 ? total : null;
}

export function powerSnapshotInWatts(
  states: Record<string, HassEntity>,
  channels: PowerChannel[],
): PowerSnapshot | null {
  const snapshot: PowerSnapshot = {
    solar: 0,
    gridImport: 0,
    gridExport: 0,
    batteryCharge: 0,
    batteryDischarge: 0,
    homeLoad: 0,
    activeChannels: 0,
  };

  for (const channel of channels) {
    const rawPower = entityPowerInWatts(states[channel.entityId]);
    // All-or-nothing, matching totalPowerInWatts. A snapshot built from a
    // surviving subset would give a confident breakdown of a load the card has
    // already admitted it cannot measure.
    if (rawPower === null) return null;

    const signedPower = rawPower * channel.multiplier;
    snapshot.activeChannels += 1;

    if (channel.role === "solar") {
      snapshot.solar += signedPower;
    } else if (channel.role === "grid" || channel.role === "grid_import") {
      if (signedPower >= 0) snapshot.gridImport += signedPower;
      else snapshot.gridExport += Math.abs(signedPower);
    } else if (channel.role === "grid_export") {
      if (signedPower <= 0) snapshot.gridExport += Math.abs(signedPower);
      else snapshot.gridImport += signedPower;
    } else if (channel.role === "battery" || channel.role === "battery_discharge") {
      if (signedPower >= 0) snapshot.batteryDischarge += signedPower;
      else snapshot.batteryCharge += Math.abs(signedPower);
    } else if (channel.role === "battery_charge") {
      if (signedPower <= 0) snapshot.batteryCharge += Math.abs(signedPower);
      else snapshot.batteryDischarge += signedPower;
    }
  }

  if (snapshot.activeChannels === 0) return null;

  snapshot.homeLoad = Math.max(
    0,
    snapshot.solar +
      snapshot.gridImport +
      snapshot.batteryDischarge -
      snapshot.gridExport -
      snapshot.batteryCharge,
  );
  return snapshot;
}

function percent(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value * 100)));
}

export function powerInsights(snapshot: PowerSnapshot): PowerInsights {
  const netGridWatts = snapshot.gridImport - snapshot.gridExport;
  const netBatteryWatts = snapshot.batteryDischarge - snapshot.batteryCharge;
  const selfPoweredPercent =
    snapshot.homeLoad > 0
      ? percent((snapshot.homeLoad - snapshot.gridImport) / snapshot.homeLoad)
      : 100;
  const solarUsedPercent =
    snapshot.solar > IDLE_WATTS
      ? percent((snapshot.solar - snapshot.gridExport) / snapshot.solar)
      : null;

  let recommendation = "Waiting for enough live energy data.";
  if (snapshot.gridExport > 250) {
    recommendation = "Solar surplus now: run flexible loads or charge storage.";
  } else if (snapshot.gridImport > 500 && snapshot.solar > 0) {
    recommendation = "Importing from grid: shift flexible loads toward brighter periods.";
  } else if (snapshot.batteryCharge > 250) {
    recommendation = "Battery is charging: preserve stored energy for the evening peak.";
  } else if (snapshot.batteryDischarge > 250) {
    recommendation = "Battery is covering demand: keep heavy loads staggered.";
  } else if (snapshot.solar > 0) {
    recommendation = "Solar is covering the home with minimal grid movement.";
  }

  return {
    selfPoweredPercent,
    solarUsedPercent,
    netGridWatts,
    netBatteryWatts,
    recommendation,
  };
}
