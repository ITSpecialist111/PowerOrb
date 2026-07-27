import type {
  EnergyFlow,
  EnergyFlowKind,
  EnergyPreferences,
  HassEntity,
  PowerChannel,
} from "./types";

type UnknownRecord = Record<string, unknown>;

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
): void {
  if (!entityId) return;
  const existing = channels.find((channel) => channel.entityId === entityId);
  if (existing) {
    existing.multiplier += multiplier;
  } else {
    channels.push({ entityId, multiplier });
  }
}

function addPowerConfigChannels(
  channels: PowerChannel[],
  config: UnknownRecord,
): void {
  const standard = stringValue(config, "stat_rate");
  const inverted = stringValue(config, "stat_rate_inverted");
  if (standard || inverted) {
    addChannel(channels, standard, 1);
    addChannel(channels, inverted, -1);
    return;
  }

  addChannel(channels, stringValue(config, "stat_rate_from"), 1);
  addChannel(channels, stringValue(config, "stat_rate_to"), -1);
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
      addChannel(channels, stringValue(source, "stat_rate"), 1);
    } else if (type === "grid") {
      const directRate = stringValue(source, "stat_rate");
      if (directRate) {
        addChannel(channels, directRate, 1);
      } else {
        addPowerConfigChannels(channels, powerConfig);
      }
    } else if (type === "battery") {
      addPowerConfigChannels(channels, powerConfig);
    }
  }

  return [...flows.entries()]
    .map(([kind, channels]) => ({
      kind,
      channels: channels.filter((channel) => channel.multiplier !== 0),
    }))
    .filter((flow) => flow.channels.length > 0);
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
    const entityIds = typeof configured === "string" ? [configured] : configured;
    if (
      !Array.isArray(entityIds) ||
      entityIds.length === 0 ||
      entityIds.some((entityId) => typeof entityId !== "string" || !entityId)
    ) {
      throw new Error(`${kind} must contain one or more entity IDs`);
    }
    for (const entityId of entityIds) {
      if (assigned.has(entityId)) {
        throw new Error(`${entityId} cannot be assigned to more than one role`);
      }
      assigned.add(entityId);
    }
    flows.push({
      kind,
      channels: entityIds.map((entityId) => ({ entityId, multiplier: 1 })),
    });
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

export function totalPowerInWatts(
  states: Record<string, HassEntity>,
  channels: PowerChannel[],
): number | null {
  let total = 0;
  let validChannels = 0;

  for (const channel of channels) {
    const value = entityPowerInWatts(states[channel.entityId]);
    if (value === null) continue;
    total += value * channel.multiplier;
    validChannels += 1;
  }

  return validChannels > 0 ? Math.max(0, total) : null;
}

export function flowPowerInWatts(
  states: Record<string, HassEntity>,
  flow: EnergyFlow,
): number | null {
  let total = 0;
  let validChannels = 0;

  for (const channel of flow.channels) {
    const value = entityPowerInWatts(states[channel.entityId]);
    if (value === null) continue;
    total += value * channel.multiplier;
    validChannels += 1;
  }

  return validChannels > 0 ? total : null;
}
