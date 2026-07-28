import { describe, expect, it } from "vitest";
import {
  configuredEnergyFlows,
  discoverEnergyFlows,
  discoverPowerChannels,
  entityPowerInWatts,
  flowPowerInWatts,
  powerInsights,
  powerSnapshotInWatts,
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
      { entityId: "sensor.solar_power", multiplier: 1, role: "solar" },
      { entityId: "sensor.grid_import", multiplier: 1, role: "grid_import" },
      { entityId: "sensor.grid_export", multiplier: -1, role: "grid_export" },
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
            { entityId: "sensor.roof_power", multiplier: 1, role: "solar" },
            { entityId: "sensor.garage_power", multiplier: 1, role: "solar" },
          ],
        },
        {
          kind: "battery",
          channels: [
            {
              entityId: "sensor.battery_discharge",
              multiplier: 1,
              role: "battery_discharge",
            },
            {
              entityId: "sensor.battery_charge",
              multiplier: -1,
              role: "battery_charge",
            },
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
    ).toEqual([{ entityId: "sensor.grid", multiplier: -1, role: "grid" }]);
  });

  it("reads a grid rate defined on the energy source", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [{ type: "grid", stat_rate: "sensor.net_grid" }],
      }),
    ).toEqual([{ entityId: "sensor.net_grid", multiplier: 1, role: "grid" }]);
  });

  it("reads a normalized battery rate defined on the energy source", () => {
    expect(
      discoverPowerChannels({
        energy_sources: [{ type: "battery", stat_rate: "sensor.battery_power" }],
      }),
    ).toEqual([
      { entityId: "sensor.battery_power", multiplier: 1, role: "battery" },
    ]);
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
    ).toEqual([{ entityId: "sensor.battery", multiplier: 1, role: "battery" }]);
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
          { entityId: "sensor.roof_power", multiplier: 1, role: "solar" },
          { entityId: "sensor.garage_power", multiplier: 1, role: "solar" },
        ],
      },
      {
        kind: "grid",
        channels: [
          { entityId: "sensor.grid_power", multiplier: 1, role: "grid" },
        ],
      },
      {
        kind: "battery",
        channels: [
          { entityId: "sensor.battery_power", multiplier: 1, role: "battery" },
        ],
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

  it("maps a directional from/to pair to signed channels", () => {
    expect(
      configuredEnergyFlows({
        grid: {
          from: "sensor.grid_consumption",
          to: "sensor.feed_in",
        },
      }),
    ).toEqual([
      {
        kind: "grid",
        channels: [
          {
            entityId: "sensor.grid_consumption",
            multiplier: 1,
            role: "grid_import",
          },
          { entityId: "sensor.feed_in", multiplier: -1, role: "grid_export" },
        ],
      },
    ]);
  });

  it("inverts a signed sensor with the wrong polarity", () => {
    expect(
      configuredEnergyFlows({ grid: { inverted: "sensor.grid_ct" } }),
    ).toEqual([
      {
        kind: "grid",
        channels: [
          { entityId: "sensor.grid_ct", multiplier: -1, role: "grid" },
        ],
      },
    ]);
  });

  it("rejects conflicting, incomplete, and unsupported flow options", () => {
    expect(() =>
      configuredEnergyFlows({
        grid: { entity: "sensor.a", inverted: "sensor.b" },
      }),
    ).toThrow("grid must use only one of entity, inverted, or from and to");
    expect(() =>
      configuredEnergyFlows({ grid: { from: "sensor.a" } }),
    ).toThrow("grid requires both from and to");
    expect(() =>
      configuredEnergyFlows({ solar: { from: "sensor.a", to: "sensor.b" } }),
    ).toThrow("solar does not support from and to; use a single entity");
    expect(() =>
      configuredEnergyFlows({ grid: { max_power: 10_000 } }),
    ).toThrow("grid does not support max_power");
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
        { entityId: "sensor.solar", multiplier: 1, role: "solar" },
        { entityId: "sensor.grid", multiplier: 1, role: "grid" },
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
            {
              entityId: "sensor.grid_export",
              multiplier: -1,
              role: "grid_export",
            },
          ],
        },
      ),
    ).toBe(-800);
  });

  it("builds a dashboard snapshot from semantic energy channels", () => {
    const states = {
      "sensor.solar": {
        state: "4.5",
        attributes: { unit_of_measurement: "kW" },
      },
      "sensor.grid_import": {
        state: "800",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.grid_export": {
        state: "1.2",
        attributes: { unit_of_measurement: "kW" },
      },
      "sensor.battery_charge": {
        state: "500",
        attributes: { unit_of_measurement: "W" },
      },
    };

    expect(
      powerSnapshotInWatts(states, [
        { entityId: "sensor.solar", multiplier: 1, role: "solar" },
        { entityId: "sensor.grid_import", multiplier: 1, role: "grid_import" },
        { entityId: "sensor.grid_export", multiplier: -1, role: "grid_export" },
        {
          entityId: "sensor.battery_charge",
          multiplier: -1,
          role: "battery_charge",
        },
      ]),
    ).toEqual({
      solar: 4500,
      gridImport: 800,
      gridExport: 1200,
      batteryCharge: 500,
      batteryDischarge: 0,
      homeLoad: 3600,
      activeChannels: 4,
    });
  });

  it("derives automatic self-power and solar-use insights", () => {
    expect(
      powerInsights({
        solar: 4500,
        gridImport: 800,
        gridExport: 1200,
        batteryCharge: 500,
        batteryDischarge: 0,
        homeLoad: 3600,
        activeChannels: 4,
      }),
    ).toEqual({
      selfPoweredPercent: 78,
      solarUsedPercent: 73,
      netGridWatts: -400,
      netBatteryWatts: -500,
      recommendation: "Solar surplus now: run flexible loads or charge storage.",
    });
  });
});
