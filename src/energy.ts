import type {
  EnergyPreferences,
  HassEntity,
  PowerChannel,
  PowerChannelRole,
  PowerInsights,
  PowerSnapshot,
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

export function discoverPowerChannels(
  preferences: EnergyPreferences,
): PowerChannel[] {
  const channels: PowerChannel[] = [];

  for (const source of preferences.energy_sources ?? []) {
    if (!isRecord(source)) continue;
    const type = stringValue(source, "type");
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

  return channels.filter((channel) => channel.multiplier !== 0);
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
    if (rawPower === null) continue;

    const signedPower = rawPower * channel.multiplier;
    snapshot.activeChannels += 1;

    if (channel.role === "solar") {
      snapshot.solar += Math.max(0, signedPower);
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
    snapshot.solar > 0
      ? percent((snapshot.solar - snapshot.gridExport) / snapshot.solar)
      : 0;

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
