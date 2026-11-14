import type { HassEntity } from "./types";

export const DEFAULT_FORECAST_ENTITY = "sensor.battery_runout_forecast";
const FRESH_MS = 1_500_000;

export interface BatteryForecast {
  status: "runout" | "risk" | "ok" | "offpeak";
  updated: number;
  end: number;
  runout: number | null;
  cautious: number | null;
  soc: number;
  reserve: number;
  shortfall: number | null;
  cost: number | null;
}

export type ForecastResult =
  | { forecast: BatteryForecast; error?: never }
  | { forecast?: never; error: string };

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function timestamp(value: unknown): number | null {
  const number = finite(value);
  return number !== null && number > 0 && number <= 8.64e15 ? number : null;
}

export function readBatteryForecast(
  entity: HassEntity | undefined,
  now: number,
): ForecastResult {
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) {
    return { error: "Battery forecast unavailable." };
  }
  const a = entity.attributes;
  const updated = typeof a.updated === "string" ? Date.parse(a.updated) : NaN;
  if (!Number.isFinite(updated) || now - updated > FRESH_MS || updated > now + 60_000) {
    return { error: "Battery forecast not updating — check the forecast sensor." };
  }
  const statuses: Record<string, BatteryForecast["status"]> = {
    "Run-out": "runout",
    "At risk": "risk",
    OK: "ok",
    "Off-peak": "offpeak",
  };
  const status = Object.hasOwn(statuses, entity.state) ? statuses[entity.state] : undefined;
  const end = timestamp(a.peak_end_ts);
  const runout = timestamp(a.runout_ts);
  const cautious = timestamp(a.runout_ts_cautious);
  const soc = finite(a.soc);
  const reserve = finite(a.min_soc);
  if (
    !status || end === null || soc === null || reserve === null ||
    soc < 0 || soc > 100 || reserve < 0 || reserve > 100 ||
    (status === "runout" && (runout === null || runout > end)) ||
    (status === "risk" && (cautious === null || cautious > end))
  ) {
    return { error: "Battery forecast data incomplete — check the forecast sensor." };
  }
  if (end <= now) {
    return { error: "Battery forecast expired — waiting for the next forecast." };
  }
  const shortfall = finite(a.shortfall_kwh);
  const cost = finite(a.est_cost_gbp);
  return {
    forecast: {
      status, updated, end, runout, cautious, soc, reserve,
      shortfall: shortfall !== null && shortfall >= 0 ? shortfall : null,
      cost: cost !== null && cost >= 0 ? cost : null,
    },
  };
}

export function forecastRemaining(target: number, now: number): string {
  if (target <= now) return "reserve due now";
  const minutes = Math.ceil((target - now) / 60_000);
  return `in ${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
