import { describe, expect, it } from "vitest";
import {
  describeDeviation,
  fractionalHour,
  localMidnight,
  percentile,
  zonedHour,
} from "../src/statistics";

describe("percentile", () => {
  it("interpolates between neighbouring order statistics", () => {
    const sorted = [0, 10, 20, 30, 40];
    expect(percentile(sorted, 0)).toBe(0);
    expect(percentile(sorted, 0.5)).toBe(20);
    expect(percentile(sorted, 1)).toBe(40);
    expect(percentile(sorted, 0.1)).toBeCloseTo(4);
  });

  it("survives degenerate inputs", () => {
    expect(percentile([], 0.5)).toBe(0);
    expect(percentile([7], 0.9)).toBe(7);
  });
});

describe("time zone handling", () => {
  // 2026-07-28T22:30:00Z is 23:30 in London and 04:00 the next day in Kolkata.
  const instant = Date.parse("2026-07-28T22:30:00Z");

  it("reads the hour in the Home Assistant zone, not the browser zone", () => {
    expect(zonedHour(instant, "Europe/London")).toBe(23);
    expect(zonedHour(instant, "UTC")).toBe(22);
  });

  it("supports half-hour offset zones", () => {
    expect(zonedHour(instant, "Asia/Kolkata")).toBe(4);
    expect(fractionalHour(instant, "Asia/Kolkata")).toBeCloseTo(4);
  });

  it("resolves local midnight in the requested zone", () => {
    const midnight = localMidnight(instant, "Europe/London");
    expect(new Date(midnight).toISOString()).toBe("2026-07-27T23:00:00.000Z");
    expect(zonedHour(midnight, "Europe/London")).toBe(0);
  });
});

describe("describeDeviation", () => {
  // low/median/high describe hourly means; liveLow/liveHigh describe the spread
  // seen *within* past hours, which is what an instantaneous reading is judged
  // against.
  const band = {
    hour: 19,
    low: 800,
    median: 1_000,
    high: 1_400,
    liveLow: 500,
    liveHigh: 1_500,
    samples: 28,
  };

  it("stays silent inside the band", () => {
    expect(describeDeviation(1_000, band)).toEqual({
      ratio: 1,
      direction: "normal",
      sentence: "Normal for 19:00–20:00",
    });
  });

  it("tolerates a kettle-sized spike that a band of hourly means would flag", () => {
    // 1.4x the median, but well inside the within-hour envelope.
    expect(describeDeviation(1_400, band)?.direction).toBe("normal");
  });

  it("rounds the deviation to the nearest five percent", () => {
    const result = describeDeviation(1_600, band);
    expect(result?.direction).toBe("above");
    expect(result?.sentence).toBe("60% above normal for 19:00–20:00");
  });

  it("caps extreme ratios rather than printing false precision", () => {
    expect(describeDeviation(9_000, band)?.sentence).toBe(
      "More than 2× normal for 19:00–20:00",
    );
    expect(describeDeviation(120, band)?.sentence).toBe(
      "Less than half normal for 19:00–20:00",
    );
  });

  it("never contradicts the graphic when the rounded deviation is zero", () => {
    const tight = { ...band, median: 1_000, liveHigh: 1_010 };
    expect(describeDeviation(1_015, tight)?.sentence).toBe(
      "Just above normal for 19:00–20:00",
    );
  });

  it("suppresses the comparison when there is no usable baseline", () => {
    expect(describeDeviation(500, null)).toBeNull();
    expect(
      describeDeviation(500, {
        hour: 3,
        low: 5,
        median: 10,
        high: 20,
        liveLow: 0,
        liveHigh: 40,
        samples: 28,
      }),
    ).toBeNull();
  });

  it("makes no claim about an instant without a within-hour envelope", () => {
    expect(describeDeviation(5_000, { ...band, liveLow: null, liveHigh: null })).toBeNull();
    expect(describeDeviation(5_000, { ...band, liveHigh: null })).toBeNull();
  });
});
