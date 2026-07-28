import { describe, expect, it } from "vitest";
import {
  BAND_HIGH_UNIT,
  BAND_LOW_UNIT,
  MIN_BAND_WATTS,
  TAIL_BANDS,
  bandPosition,
  bandUnit,
  bandWidth,
} from "../src/statistics";

const overnight = { low: 350, high: 700 };
const carCharging = { low: 950, high: 5_700 };

describe("bandPosition", () => {
  it("puts the bottom of the range at zero and the top at one", () => {
    expect(bandPosition(350, overnight)).toBe(0);
    expect(bandPosition(700, overnight)).toBe(1);
    expect(bandPosition(525, overnight)).toBeCloseTo(0.5);
  });

  it("measures departures in band widths, not watts", () => {
    expect(bandPosition(1_050, overnight)).toBeCloseTo(2);
    expect(bandPosition(0, overnight)).toBeCloseTo(-1);
  });

  it("floors the band width so a tight hour is not infinitely sensitive", () => {
    const tight = { low: 500, high: 510 };
    expect(bandWidth(tight)).toBe(MIN_BAND_WATTS);
    expect(bandPosition(560, tight)).toBeCloseTo(1);
  });
});

describe("bandUnit", () => {
  it("lands every hour's usual range on the same two radii", () => {
    // This is the whole design: normal is a circle, whatever the hour draws.
    for (const bounds of [overnight, carCharging]) {
      expect(bandUnit(bandPosition(bounds.low, bounds))).toBeCloseTo(BAND_LOW_UNIT);
      expect(bandUnit(bandPosition(bounds.high, bounds))).toBeCloseTo(BAND_HIGH_UNIT);
    }
  });

  it("places a quiet 500 W night and a 3 kW car charge at the same radius", () => {
    const night = bandUnit(bandPosition(525, overnight));
    const charging = bandUnit(bandPosition(3_325, carCharging));
    expect(night).toBeCloseTo(charging, 2);
  });

  it("is monotonic across the whole range", () => {
    let previous = -1;
    for (let position = -4; position <= 5; position += 0.1) {
      const unit = bandUnit(position);
      expect(unit).toBeGreaterThanOrEqual(previous);
      previous = unit;
    }
  });

  it("keeps every reading on the plot", () => {
    for (const position of [-500, -3, 0, 0.5, 1, 4, 500]) {
      expect(bandUnit(position)).toBeGreaterThanOrEqual(0);
      expect(bandUnit(position)).toBeLessThanOrEqual(1);
    }
  });

  it("reaches the edges at the configured number of band widths", () => {
    expect(bandUnit(1 + TAIL_BANDS)).toBeCloseTo(1);
    expect(bandUnit(-TAIL_BANDS)).toBeCloseTo(0);
  });

  it("gives a completed hour the same grace on the plot whatever it draws", () => {
    // A tight, high-level hour such as an off-peak car charge must not get a
    // grace zone spanning the entire dial.
    const tightHigh = { low: 2_000, high: 2_100 };
    const slackFor = (bounds: { low: number; high: number }) =>
      bandUnit(bandPosition(bounds.high + bandWidth(bounds) * 0.1, bounds)) -
      BAND_HIGH_UNIT;
    expect(slackFor(overnight)).toBeCloseTo(slackFor(carCharging), 5);
    expect(slackFor(overnight)).toBeCloseTo(slackFor(tightHigh), 5);
  });
});
