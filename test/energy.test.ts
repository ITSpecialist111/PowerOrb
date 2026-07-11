import { describe, expect, it } from "vitest";
import {
  discoverPowerChannels,
  entityPowerInWatts,
  totalPowerInWatts,
} from "../src/energy";

describe("discoverPowerChannels", () => {
  it("discovers solar and directional grid power sensors", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [
          { type: "solar", stat_rate: "sensor.solar_power" },
          {
            type: "grid",
            power_config: {
              stat_rate_from: "sensor.grid_import",
              stat_rate_to: "sensor.grid_export",
            },
          },
        ],
      }),
    ).toEqual([
      { entityId: "sensor.solar_power", multiplier: 1 },
      { entityId: "sensor.grid_import", multiplier: 1 },
      { entityId: "sensor.grid_export", multiplier: -1 },
    ]);
  });

  it("honors the inverted signed power sensor slot", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [
          {
            type: "grid",
            power_config: {
              stat_rate_inverted: "sensor.grid",
            },
          },
        ],
      }),
    ).toEqual([{ entityId: "sensor.grid", multiplier: -1 }]);
  });

  it("reads a grid rate defined on the energy source", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [{ type: "grid", stat_rate: "sensor.net_grid" }],
      }),
    ).toEqual([{ entityId: "sensor.net_grid", multiplier: 1 }]);
  });

  it("reads a normalized battery rate defined on the energy source", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [{ type: "battery", stat_rate: "sensor.battery_power" }],
      }),
    ).toEqual([{ entityId: "sensor.battery_power", multiplier: 1 }]);
  });

  it("does not double count directional sensors when a net sensor exists", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [
          {
            type: "battery",
            power_config: {
              stat_rate: "sensor.battery",
              stat_rate_from: "sensor.battery_out",
              stat_rate_to: "sensor.battery_in",
            },
          },
        ],
      }),
    ).toEqual([{ entityId: "sensor.battery", multiplier: 1 }]);
  });
});

describe("power calculations", () => {
  it("normalizes supported units to watts", () => {
    expect(
      entityPowerInWatts({
        state: "1.25",
        attributes: { unit_of_measurement: "kW" },
      }),
    ).toBe(1250);
  });

  it("ignores unavailable and unsupported sensor values", () => {
    expect(
      entityPowerInWatts({
        state: "unavailable",
        attributes: { unit_of_measurement: "W" },
      }),
    ).toBeNull();
    expect(
      entityPowerInWatts({
        state: "20",
        attributes: { unit_of_measurement: "kWh" },
      }),
    ).toBeNull();
  });

  it("combines source contributions without displaying negative demand", () => {
    const states = {
      "sensor.solar": {
        state: "2",
        attributes: { unit_of_measurement: "kW" },
      },
      "sensor.grid": {
        state: "-500",
        attributes: { unit_of_measurement: "W" },
      },
    };
    expect(
      totalPowerInWatts(states, [
        { entityId: "sensor.solar", multiplier: 1 },
        { entityId: "sensor.grid", multiplier: 1 },
      ]),
    ).toBe(1500);
  });
});
