import { describe, expect, it } from "vitest";
import { forecastRemaining, readBatteryForecast } from "../src/forecast";
import type { HassEntity } from "../src/types";

const now = Date.parse("2026-11-14T11:40:00Z");
function entity(attributes: Record<string, unknown> = {}, state = "Run-out"): HassEntity {
  return {
    state,
    attributes: {
      updated: new Date(now).toISOString(),
      peak_end_ts: Date.parse("2026-11-14T23:30:00Z"),
      runout_ts: Date.parse("2026-11-14T17:26:00Z"),
      runout_ts_cautious: Date.parse("2026-11-14T16:15:00Z"),
      soc: 27,
      min_soc: 10,
      shortfall_kwh: 4.3,
      est_cost_gbp: 1.51,
      ...attributes,
    },
  };
}

describe("battery forecast", () => {
  it("uses the supplied reserve predictions and costs without recomputing them", () => {
    expect(readBatteryForecast(entity(), now).forecast).toMatchObject({
      status: "runout", reserve: 10, soc: 27, shortfall: 4.3, cost: 1.51,
      runout: Date.parse("2026-11-14T17:26:00Z"),
      cautious: Date.parse("2026-11-14T16:15:00Z"),
    });
  });

  it("expires exactly after the dashboard's 25-minute freshness window", () => {
    expect(readBatteryForecast(entity(), now + 1_500_000).forecast).toBeDefined();
    expect(readBatteryForecast(entity(), now + 1_500_001).error).toContain("not updating");
    expect(readBatteryForecast(entity({ updated: undefined }), now).error).toContain("not updating");
    expect(readBatteryForecast(entity({ updated: new Date(now + 61_000).toISOString() }), now).error)
      .toContain("not updating");
  });

  it("never presents missing, unavailable or unrecognized data as safe", () => {
    expect(readBatteryForecast(undefined, now).error).toContain("unavailable");
    expect(readBatteryForecast(entity({}, "unavailable"), now).error).toContain("unavailable");
    expect(readBatteryForecast(entity({}, "Unexpected"), now).error).toContain("incomplete");
    for (const attributes of [
      { soc: "" }, { min_soc: -1 }, { soc: 101 }, { runout_ts: null },
      { peak_end_ts: Infinity }, { runout_ts: now + 86_400_000 },
    ]) {
      expect(readBatteryForecast(entity(attributes), now).error).toContain("incomplete");
    }
  });

  it("requires only the cautious run-out for an at-risk day, neither on safe days", () => {
    expect(readBatteryForecast(entity({ runout_ts: null }, "At risk"), now).forecast?.status).toBe("risk");
    expect(readBatteryForecast(entity({ runout_ts_cautious: null }, "At risk"), now).error).toContain("incomplete");
    for (const state of ["OK", "Off-peak"]) {
      expect(readBatteryForecast(entity({ runout_ts: null, runout_ts_cautious: null }, state), now).forecast)
        .toBeDefined();
    }
  });

  it("rejects expired horizons and omits invalid optional financial estimates", () => {
    expect(readBatteryForecast(entity({ peak_end_ts: now, runout_ts: now }), now).error).toContain("expired");
    expect(readBatteryForecast(entity({ shortfall_kwh: -1, est_cost_gbp: "1.51" }), now).forecast)
      .toMatchObject({ shortfall: null, cost: null });
  });

  it("handles passed reserve times and rounds the countdown up instead of going negative", () => {
    expect(forecastRemaining(now - 1, now)).toBe("reserve due now");
    expect(forecastRemaining(now, now)).toBe("reserve due now");
    expect(forecastRemaining(now + 60_001, now)).toBe("in 0h 2m");
    expect(forecastRemaining(now + 3_600_000, now)).toBe("in 1h 0m");
  });
});
