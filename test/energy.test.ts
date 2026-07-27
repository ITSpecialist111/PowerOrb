import { describe, expect, it } from "vitest";
import {
  configuredEnergyFlows,
  discoverEnergyFlows,
  discoverPowerChannels,
  entityPowerInWatts,
  flowPowerInWatts,
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

  describe("discoverEnergyFlows", () => {
    it("groups channels by their role in the energy system", () => {
      expect(
        discoverEnergyFlows({
          energy_sources: [
            { type: "solar", stat_rate: "sensor.roof_power" },
            { type: "solar", stat_rate: "sensor.garage_power" },
            {
              type: "battery",
              power_config: {
                stat_rate_from: "sensor.battery_discharge",
                stat_rate_to: "sensor.battery_charge",
              },
            },
          ],
        }),
      ).toEqual([
        {
          kind: "solar",
          channels: [
            { entityId: "sensor.roof_power", multiplier: 1 },
            { entityId: "sensor.garage_power", multiplier: 1 },
          ],
        },
        {
          kind: "battery",
          channels: [
            { entityId: "sensor.battery_discharge", multiplier: 1 },
            { entityId: "sensor.battery_charge", multiplier: -1 },
          ],
        },
      ]);
    });
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

describe("configuredEnergyFlows", () => {
  it("maps explicit entity IDs to energy roles", () => {
    expect(
      configuredEnergyFlows({
        solar: ["sensor.roof_power", "sensor.garage_power"],
        grid: "sensor.grid_power",
        battery: "sensor.battery_power",
      }),
    ).toEqual([
      {
        kind: "solar",
        channels: [
          { entityId: "sensor.roof_power", multiplier: 1 },
          { entityId: "sensor.garage_power", multiplier: 1 },
        ],
      },
      {
        kind: "grid",
        channels: [{ entityId: "sensor.grid_power", multiplier: 1 }],
      },
      {
        kind: "battery",
        channels: [{ entityId: "sensor.battery_power", multiplier: 1 }],
      },
    ]);
  });

  it("rejects unknown roles and duplicate assignments", () => {
    expect(() =>
      configuredEnergyFlows({ home: "sensor.home_power" }),
    ).toThrow("entities only supports solar, grid, and battery roles");
    expect(() =>
      configuredEnergyFlows({
        solar: "sensor.shared",
        grid: "sensor.shared",
      }),
    ).toThrow("sensor.shared cannot be assigned to more than one role");
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

  it("preserves direction for an individual energy flow", () => {
    expect(
      flowPowerInWatts(
        {
          "sensor.grid_export": {
            state: "0.8",
            attributes: { unit_of_measurement: "kW" },
          },
        },
        {
          kind: "grid",
          channels: [
            { entityId: "sensor.grid_export", multiplier: -1 },
          ],
        },
      ),
    ).toBe(-800);
  });
});
