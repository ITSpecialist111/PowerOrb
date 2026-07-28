import { describe, expect, it, vi } from "vitest";
import {
  MIN_BUCKET_SAMPLES,
  bandBounds,
  bandRuns,
  bucketLoad,
  deviationBounds,
  fetchBaseline,
  fetchToday,
  hourlyBounds,
  missingStatistics,
  niceCeiling,
} from "../src/statistics";
import type {
  BaselineHour,
  HomeAssistant,
  PowerChannel,
  StatisticsRow,
} from "../src/types";

const HOUR = 3_600_000;
const FIVE_MIN = 300_000;

const channels: PowerChannel[] = [
  { entityId: "sensor.solar", multiplier: 1, role: "solar" },
  { entityId: "sensor.grid_import", multiplier: 1, role: "grid_import" },
  { entityId: "sensor.grid_export", multiplier: -1, role: "grid_export" },
];

/** 2026-07-28T12:00:00Z, so UTC hour buckets align with UTC local hours. */
const NOW = Date.parse("2026-07-28T12:00:00Z");
const MIDNIGHT = Date.parse("2026-07-28T00:00:00Z");

function row(start: number, mean: number, span = HOUR): StatisticsRow {
  return { start, end: start + span, mean };
}

function fakeHass(
  handler: (message: Record<string, unknown>) => unknown,
): HomeAssistant {
  return {
    states: {},
    callWS: vi.fn(async (message: Record<string, unknown>) => handler(message) as never),
    connection: { subscribeEvents: vi.fn() },
  } as unknown as HomeAssistant;
}

describe("bucketLoad", () => {
  const rows = new Map<string, StatisticsRow>([
    ["sensor.solar", row(0, 1_000)],
    ["sensor.grid_import", row(0, 500)],
    ["sensor.grid_export", row(0, 200)],
  ]);

  it("sums signed channels and clamps once, matching the live path", () => {
    expect(bucketLoad(channels, rows)).toBe(1_300);
  });

  it("discards a bucket that is missing any channel rather than part-summing", () => {
    const partial = new Map(rows);
    partial.delete("sensor.grid_export");
    expect(bucketLoad(channels, partial)).toBeNull();
  });

  it("never reports a negative home load", () => {
    expect(
      bucketLoad(
        channels,
        new Map([
          ["sensor.solar", row(0, 100)],
          ["sensor.grid_import", row(0, 0)],
          ["sensor.grid_export", row(0, 5_000)],
        ]),
      ),
    ).toBe(0);
  });
});

describe("missingStatistics", () => {
  it("accepts statistics recorded in the power unit class", async () => {
    const hass = fakeHass(() => [
      { statistic_id: "sensor.solar", unit_class: "power", has_mean: true },
      { statistic_id: "sensor.grid_import", display_unit_of_measurement: "kW" },
      { statistic_id: "sensor.grid_export", display_unit_of_measurement: "W" },
    ]);
    expect(await missingStatistics(hass, channels)).toEqual([]);
  });

  it("reports channels with no statistics at all", async () => {
    const hass = fakeHass(() => [
      { statistic_id: "sensor.solar", unit_class: "power" },
    ]);
    expect(await missingStatistics(hass, channels)).toEqual([
      "sensor.grid_import",
      "sensor.grid_export",
    ]);
  });

  it("rejects a statistic recorded in a non-power unit", async () => {
    const hass = fakeHass(() => [
      { statistic_id: "sensor.solar", display_unit_of_measurement: "kWh" },
      { statistic_id: "sensor.grid_import", unit_class: "power" },
      { statistic_id: "sensor.grid_export", unit_class: "power" },
    ]);
    expect(await missingStatistics(hass, channels)).toEqual(["sensor.solar"]);
  });
});

/**
 * Hourly means sit near 500 W. The five-minute series alternates between a
 * 200 W floor and a 3 kW appliance, which is the realistic domestic shape the
 * live envelope has to tolerate.
 */
function statsResponse(
  message: Record<string, unknown>,
  options: { days?: number; liveDays?: number } = {},
): Record<string, StatisticsRow[]> {
  const response: Record<string, StatisticsRow[]> = {
    "sensor.solar": [],
    "sensor.grid_import": [],
    "sensor.grid_export": [],
  };
  const hourly = message.period === "hour";
  const days = hourly ? (options.days ?? 28) : (options.liveDays ?? 5);

  for (let day = 1; day <= days; day += 1) {
    for (let hour = 0; hour < 24; hour += 1) {
      const hourStart = MIDNIGHT - day * 24 * HOUR + hour * HOUR;
      if (hourly) {
        response["sensor.solar"]?.push(row(hourStart, 0));
        response["sensor.grid_import"]?.push(row(hourStart, 500));
        response["sensor.grid_export"]?.push(row(hourStart, 0));
        continue;
      }
      for (let slot = 0; slot < 12; slot += 1) {
        const start = hourStart + slot * FIVE_MIN;
        const watts = slot % 6 === 0 ? 3_000 : 200;
        response["sensor.solar"]?.push(row(start, 0, FIVE_MIN));
        response["sensor.grid_import"]?.push(row(start, watts, FIVE_MIN));
        response["sensor.grid_export"]?.push(row(start, 0, FIVE_MIN));
      }
    }
  }
  return response;
}

describe("fetchBaseline", () => {
  it("requests both series in watts, ending at local midnight", async () => {
    const seen: Record<string, unknown>[] = [];
    const hass = fakeHass((message) => {
      seen.push(message);
      return statsResponse(message);
    });
    await fetchBaseline(hass, channels, NOW, "UTC");

    const hourly = seen.find((message) => message.period === "hour");
    const live = seen.find((message) => message.period === "5minute");
    expect(hourly?.types).toEqual(["mean"]);
    expect(hourly?.units).toEqual({ power: "W" });
    expect(hourly?.end_time).toBe("2026-07-28T00:00:00.000Z");
    expect(hourly?.start_time).toBe("2026-06-30T00:00:00.000Z");
    expect(live?.start_time).toBe("2026-07-23T00:00:00.000Z");
  });

  it("derives the live envelope from co-occurring five-minute samples", async () => {
    const hass = fakeHass((message) => statsResponse(message));
    const baseline = await fetchBaseline(hass, channels, NOW, "UTC");
    const hour = baseline.hours[7] as BaselineHour;

    expect(baseline.status).toBe("ok");
    expect(hour.median).toBe(500);
    // The envelope spans the real domestic range, not a worst-case sum.
    expect(hour.liveLow).toBe(200);
    expect(hour.liveHigh).toBe(3_000);
  });

  it("keeps the live envelope within a sane multiple of the median", async () => {
    // Guards the failure mode where a worst-case bound over many signed
    // channels widens the band until nothing can ever read as abnormal.
    const hass = fakeHass((message) => statsResponse(message));
    const baseline = await fetchBaseline(hass, channels, NOW, "UTC");
    for (const hour of baseline.hours) {
      if (!hour || hour.liveHigh === null) continue;
      expect(hour.liveHigh / Math.max(hour.median, 1)).toBeLessThan(10);
    }
  });

  it("omits the envelope when there are too few five-minute samples", async () => {
    const hass = fakeHass((message) =>
      message.period === "hour"
        ? statsResponse(message)
        : { "sensor.solar": [], "sensor.grid_import": [], "sensor.grid_export": [] },
    );
    const baseline = await fetchBaseline(hass, channels, NOW, "UTC");
    expect(baseline.hours[7]?.liveHigh).toBeNull();
    expect(baseline.hours[7]?.median).toBe(500);
  });

  it("reports learning while there is too little history", async () => {
    const hass = fakeHass((message) => statsResponse(message, { days: 4 }));
    const baseline = await fetchBaseline(hass, channels, NOW, "UTC");
    expect(baseline.status).toBe("learning");
    expect(baseline.days).toBe(4);
  });

  it("reports a provisional baseline between one and two weeks", async () => {
    const hass = fakeHass((message) => statsResponse(message, { days: 10 }));
    expect((await fetchBaseline(hass, channels, NOW, "UTC")).status).toBe(
      "provisional",
    );
  });

  it("copes with a completely empty response", async () => {
    const hass = fakeHass(() => ({}));
    const baseline = await fetchBaseline(hass, channels, NOW, "UTC");
    expect(baseline.status).toBe("learning");
    expect(baseline.days).toBe(0);
    expect(baseline.hours.every((hour) => hour === null)).toBe(true);
  });

  it("leaves a gap for any hour below the minimum sample count", async () => {
    const hass = fakeHass((message) => {
      const response = statsResponse(message);
      if (message.period !== "hour") return response;
      for (const key of Object.keys(response)) {
        response[key] = (response[key] ?? []).filter(
          (entry) =>
            new Date(entry.start).getUTCHours() !== 3 ||
            entry.start > Date.parse("2026-07-20T00:00:00Z"),
        );
      }
      return response;
    });
    const baseline = await fetchBaseline(hass, channels, NOW, "UTC");

    expect(baseline.hours[3]).toBeNull();
    expect(baseline.hours[4]?.samples).toBeGreaterThanOrEqual(MIN_BUCKET_SAMPLES);
  });
});

describe("fetchToday", () => {
  it("excludes the hour still in progress", async () => {
    const hass = fakeHass(() => {
      const response: Record<string, StatisticsRow[]> = {
        "sensor.solar": [],
        "sensor.grid_import": [],
        "sensor.grid_export": [],
      };
      for (let hour = 0; hour <= 12; hour += 1) {
        const start = MIDNIGHT + hour * HOUR;
        response["sensor.solar"]?.push(row(start, 0));
        response["sensor.grid_import"]?.push(row(start, 1_000));
        response["sensor.grid_export"]?.push(row(start, 0));
      }
      return response;
    });

    const today = await fetchToday(hass, channels, NOW, "UTC");
    expect(today).toHaveLength(12);
    expect(today[today.length - 1]?.hour).toBe(11);
  });

  it("drops hours where a channel has no data", async () => {
    const hass = fakeHass(() => ({
      "sensor.solar": [row(MIDNIGHT, 0), row(MIDNIGHT + HOUR, 0)],
      "sensor.grid_import": [row(MIDNIGHT, 500), row(MIDNIGHT + HOUR, 500)],
      "sensor.grid_export": [row(MIDNIGHT, 0)],
    }));
    expect(await fetchToday(hass, channels, NOW, "UTC")).toEqual([
      { hour: 0, watts: 500 },
    ]);
  });
});

function hour(value: number): BaselineHour {
  return {
    hour: value,
    low: 100,
    median: 200,
    high: 300,
    liveLow: 50,
    liveHigh: 500,
    samples: 28,
  };
}

function hours(present: number[]): (BaselineHour | null)[] {
  return Array.from({ length: 24 }, (_, index) =>
    present.includes(index) ? hour(index) : null,
  );
}

describe("bandRuns", () => {
  const all = Array.from({ length: 24 }, (_, index) => index);

  it("closes a complete day into one ring when wrapping", () => {
    const runs = bandRuns(hours(all), true);
    expect(runs).toHaveLength(1);
    expect(runs[0]).toHaveLength(25);
    expect(runs[0]?.[24]?.hour).toBe(24);
  });

  it("joins a run that spans midnight", () => {
    const runs = bandRuns(hours([0, 1, 2, 3, 4, 5, 12, 13, 14, 22, 23]), true);
    expect(runs).toHaveLength(2);
    const wrapped = runs[runs.length - 1];
    expect(wrapped?.map((entry) => entry.hour)).toEqual([22, 23, 24, 25, 26, 27, 28, 29]);
  });

  it("never continues past hour 23 when wrapping is off", () => {
    for (const runs of [
      bandRuns(hours(all), false),
      bandRuns(hours([0, 1, 22, 23]), false),
    ]) {
      for (const run of runs) {
        for (const entry of run) expect(entry.hour).toBeLessThan(24);
      }
    }
  });

  it("keeps every hour reachable on a strip when the day spans midnight", () => {
    const runs = bandRuns(hours([0, 1, 22, 23]), false);
    expect(runs.flat().map((entry) => entry.hour)).toEqual([0, 1, 22, 23]);
  });

  it("leaves an open arc alone", () => {
    const runs = bandRuns(hours([3, 4, 5, 6, 7, 8]), true);
    expect(runs).toHaveLength(1);
    expect(runs[0]?.map((entry) => entry.hour)).toEqual([3, 4, 5, 6, 7, 8]);
  });

  it("survives an empty and a single-hour baseline", () => {
    expect(bandRuns([], true)).toEqual([]);
    expect(bandRuns(hours([]), true)).toEqual([]);
    expect(bandRuns(hours([9]), true)).toHaveLength(1);
  });
});

describe("niceCeiling", () => {
  it("rounds up to the next step on a fine ladder", () => {
    expect(niceCeiling(1_100)).toBe(1_250);
    expect(niceCeiling(2_400)).toBe(2_500);
    expect(niceCeiling(5_100)).toBe(6_000);
    expect(niceCeiling(900)).toBe(1_000);
  });

  it("keeps the overshoot small, so one outlier hour cannot squash the dial", () => {
    // A coarse 1/2/5 ladder turned this into 10 kW, pushing an ordinary
    // 400-1500 W day into the innermost fifth of the radius.
    for (const value of [1_100, 2_400, 4_100, 5_500, 7_200, 9_100]) {
      expect(niceCeiling(value) / value).toBeLessThan(1.25);
    }
  });

  it("is stable across small changes, so the scale does not creep", () => {
    expect(niceCeiling(5_100)).toBe(niceCeiling(5_900));
  });

  it("never rounds below its input, so a band cannot clip at the rim", () => {
    for (const value of [1, 999, 1_001, 4_999, 7_500, 12_345]) {
      expect(niceCeiling(value)).toBeGreaterThanOrEqual(value);
    }
  });

  it("falls back for degenerate input", () => {
    expect(niceCeiling(0)).toBe(1_000);
    expect(niceCeiling(Number.NaN)).toBe(1_000);
  });
});

describe("bandBounds", () => {
  it("draws the spread of hourly means, matching the line drawn on it", () => {
    expect(bandBounds(hour(5))).toEqual({ low: 100, high: 300 });
  });

  it("is the same range bandRuns plots, so drawn and judged cannot drift", () => {
    const runs = bandRuns(hours([5]), false);
    expect(runs[0]?.[0]).toEqual({ hour: 5, ...bandBounds(hour(5)) });
  });
});

describe("comparators", () => {
  it("judges a completed hour a fixed distance outside the drawn ring", () => {
    // The grace is in band widths, so it is the same number of pixels for
    // every hour. A multiplicative margin would give a tight, high-level hour
    // a grace zone spanning the whole dial.
    const bounds = hourlyBounds(hour(5));
    expect(bounds.high).toBeCloseTo(320);
    expect(bounds.low).toBeCloseTo(80);
  });

  it("judges an instant against the wider within-hour envelope", () => {
    const bounds = deviationBounds(hour(5));
    expect(bounds?.high).toBeCloseTo(550);
    expect(bounds?.low).toBeCloseTo(45.45);
  });

  it("keeps the two apart, or an hourly mean could never look abnormal", () => {
    // An hourly mean is the average of twelve five-minute means, so its spread
    // is far narrower. Judging it against the instant envelope would make the
    // trace permanently normal.
    const hourly = hourlyBounds(hour(5));
    const instant = deviationBounds(hour(5));
    expect(instant?.high).toBeGreaterThan(hourly.high);
    expect(instant?.low).toBeLessThan(hourly.low);
  });

  it("makes no instantaneous claim without an envelope", () => {
    expect(deviationBounds({ ...hour(5), liveLow: null, liveHigh: null })).toBeNull();
  });

  it("still judges completed hours when the envelope is gone", () => {
    const bounds = hourlyBounds({ ...hour(5), liveLow: null, liveHigh: null });
    expect(bounds.high).toBeCloseTo(320);
  });
});
