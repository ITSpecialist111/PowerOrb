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

- Automatically discovers solar, grid, and battery power sensors
- Shows a live solar, grid, battery, and home-load dashboard from that discovery
- Derives self-powered percentage, solar-use percentage, and net flow direction
- Gives a plain-language live recommendation for surplus, import, and battery states
- Reacts when Energy dashboard preferences change
- Supports W, kW, and MW source sensors
- Animated, responsive flow scene with a rolling live trend
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
   **Settings → Dashboards → Resources**.
3. Add the card using the YAML above.

## Configuration

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | `Power Orb` | Card heading |
| `entity` | string | auto-discovered | Direct instantaneous power sensor |
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

For automatic discovery, configure real-time power sensors in
**Settings → Dashboards → Energy**. Cumulative kWh meters are intentionally not
converted into live power because that produces inaccurate values between
meter updates.

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
