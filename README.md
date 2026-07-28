# Power Orb

Power Orb is a real-time energy visualization card for Home Assistant 2026. It
uses the power sensors already configured in Home Assistant's Energy dashboard,
so it needs no server, access token, or duplicate entity configuration.

Power Orb is compatible with Home Assistant 2026.7. The 2026.7 frontend keeps
the custom-card APIs and `energy/get_prefs` WebSocket command used by this card.
The component-size changes in that release do not affect Power Orb.

The original Supervisor add-on has been replaced by a Lovelace custom card. The
old add-on attempted to open Home Assistant's authenticated WebSocket from an
Ingress page without a token and could not receive state updates. Power Orb now
runs inside Home Assistant and uses its authenticated frontend API.

## Features

- Automatically discovers and visualizes solar, grid, battery, and home power
- Directional live flows distinguish grid import/export and battery charge/discharge
- Derives self-powered percentage, solar-use percentage, and net flow direction
- Gives a plain-language live recommendation for surplus, import, and battery states
- Dark mineral-glass interface with a distinct color and reading for every source
- Reacts when Energy dashboard preferences change
- Supports W, kW, and MW source sensors
- Animated, responsive dark-glass orb with a rolling 60-second demand trace
- Works offline after installation; no CDN resources
- Honors reduced-motion accessibility preferences
- Optional direct power entity for installations without Energy configuration
- Native refresh signal for automation and MCP integrations

## Installation

### HACS

1. Open HACS and add `https://github.com/ITSpecialist111/PowerOrb` as a custom
   **Dashboard** repository.
2. Install **Power Orb**.
3. Refresh Home Assistant, then add a manual card to a dashboard:

```yaml
type: custom:power-orb
```

HACS installs the compiled `dist/power-orb.js` artifact. That artifact is kept
in the repository intentionally so both the default branch and tagged releases
are valid HACS Dashboard sources.

### Manual

1. Download `dist/power-orb.js` from this repository, or the `power-orb.js`
   asset from a tagged release, into `/config/www/power-orb/`.
2. Add `/local/power-orb/power-orb.js` as a JavaScript module under
   **Settings ÔåÆ Dashboards ÔåÆ Resources**.
3. Add the card using the YAML above.

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | `Power Orb` | Card heading |
| `entity` | string | auto-discovered | Direct instantaneous power sensor |
| `entities` | mapping | auto-discovered | Explicit solar, grid, and battery power sensors |
| `max_power` | number | dynamic / 5000 W | Power level at maximum glow |
| `unit` | `W` or `kW` | automatic | Display unit |

Example:

```yaml
type: custom:power-orb
name: House load
entity: sensor.home_power
max_power: 10000
unit: kW
```

To visualize power entities that are not configured in the Energy dashboard,
map each entity explicitly to its role. A role accepts one entity ID or a list:

```yaml
type: custom:power-orb
entities:
  solar:
    - sensor.roof_power
    - sensor.garage_power
  grid: sensor.grid_power
  battery: sensor.battery_power
```

A signed sensor is expected: positive values mean grid import or battery supply,
negative values mean grid export or battery charging. When a sensor uses the
opposite polarity, or when the meter is split into two positive-only sensors,
use the long form instead. It mirrors the three power-sensor modes of the Energy
dashboard:

```yaml
type: custom:power-orb
entities:
  solar: sensor.pv_power
  grid:
    from: sensor.grid_consumption
    to: sensor.feed_in
  battery:
    inverted: sensor.battery_power
max_power: 10000
```

| Flow option | Meaning |
| --- | --- |
| `entity` | Signed sensor; positive is import or discharge |
| `inverted` | Signed sensor with the opposite polarity |
| `from` / `to` | Two positive-only sensors; the flow becomes `from - to` |

Each role accepts exactly one of those three forms, and every option takes one
entity ID or a list. `from` and `to` must be used together, and are not
available for `solar`. `entity` and `entities` cannot be used together.
Remember that `max_power`, `unit`, and `name` are top-level options, not
entries under `entities`.

### Size

Power Orb asks for the full 12-column width and 10 rows of a sections
dashboard, and never renders narrower than 6 columns. Override that per card
with the standard `grid_options` block, or drag the resize handle in the
dashboard editor:

```yaml
type: custom:power-orb
grid_options:
  columns: 12
  rows: 10
```

The constellation is fluid, so the flow paths and badges scale with whatever
width the card is given. On a masonry view the card fills its column instead.

For automatic discovery, configure real-time power sensors in
**Settings ÔåÆ Dashboards ÔåÆ Energy**. Cumulative kWh meters are intentionally not
converted into live power because that produces inaccurate values between
meter updates. Power Orb groups every configured live source by role: solar
generation, grid import or export, battery supply or charging, and the resulting
home demand. Flow direction and animation speed reflect each source's current
direction and magnitude. Those same roles drive the self-powered percentage,
solar-use percentage, and the plain-language recommendation shown below the
demand trace.

## HASS MCP OpenClaw

Power Orb and
[HASS_MCP_OpenClaw](https://github.com/ITSpecialist111/HASS_MCP_OpenClaw)
integrate through Home Assistant rather than exchanging credentials directly.
OpenClaw can discover the same Energy sensors, stream their state changes,
create threshold automations, tune `max_power`, and add the card to a Lovelace
dashboard with its existing Energy, event, recorder, and dashboard tools.

After OpenClaw changes Energy preferences, it can ask every visible Power Orb
card to refresh immediately:

```text
fire_event_full("power_orb_refresh", {})
```

Power Orb also reloads Energy preferences periodically, so this signal is an
optimization rather than a requirement. No MCP token is ever sent to the
browser.

## Development

Requires Node.js 22 or newer.

```bash
npm install
npm run check
```

The HACS artifact is generated in `dist/` and must be committed whenever the
source changes. CI rebuilds it and fails if the committed output is stale.

## HACS troubleshooting

If HACS previously reported
`<Plugin ITSpecialist111/PowerOrb> Repository structure for main is not compliant`,
refresh HACS and retry adding the custom **Dashboard** repository after updating
to a commit that contains `dist/power-orb.js`. The old error means HACS inspected
a revision that did not contain the compiled JavaScript file; it is not a Home
Assistant 2026.7 dashboard API error.
