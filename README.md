# Power Orb

Power Orb answers a question no other Home Assistant card answers: **is this
normal?**

Every energy card in the ecosystem shows you what is happening right now. Power
Orb shows you what is happening right now *against your own household's normal
day*. It draws a 24-hour dial where the angle is the time of day, the radius is
power, and three layers sit on the same geometry:

- **The band** — the range your home usually draws at each hour, from the 10th
  to the 90th percentile of the last 28 days.
- **Today's line** — what you actually drew, hour by hour, from midnight.
- **The bead** — your live reading right now, at the current angle.

Where today leaves the band, a tick marks how far. Underneath, one sentence:
*"30% above normal for 19:00–20:00"*, or simply *"Normal for 19:00–20:00"*.

It uses the power sensors already configured in Home Assistant's Energy
dashboard, so it needs no server, access token, or duplicate entity
configuration. The baseline comes from `recorder` statistics, computed
server-side, so it is correct the instant the card paints and identical on
every device.

Power Orb is compatible with Home Assistant 2026.7. The 2026.7 frontend keeps
the custom-card APIs and `energy/get_prefs` WebSocket command used by this card.
The component-size changes in that release do not affect Power Orb.

The original Supervisor add-on has been replaced by a Lovelace custom card. The
old add-on attempted to open Home Assistant's authenticated WebSocket from an
Ingress page without a token and could not receive state updates. Power Orb now
runs inside Home Assistant and uses its authenticated frontend API.

## Features

- Compares live household load with its own 28-day baseline for the same hour
- Angle-as-time-of-day dial; no purpose-built Home Assistant card uses this
  encoding, though a generic charting card such as plotly-graph-card can be
  configured to approximate it
- Square-root radial scale, so the overnight band stays visible beside evening peaks
- Deviation drawn as fixed-width ticks, so a deviation at 03:00 draws as much
  ink as the same deviation at 19:00
- Automatically discovers solar, grid, battery and home power
- Live chips for each source with direction: importing, exporting, charging, supplying
- Reacts when Energy dashboard preferences change
- Supports W, kW and MW source sensors
- Falls back to a cartesian day strip below 300px wide
- Works offline after installation; no CDN resources
- Honors reduced-motion accessibility preferences
- Optional direct power entity for installations without Energy configuration
- Native refresh signal for automation and MCP integrations

## What the baseline needs

The dial always renders. The band and the sentence need `recorder` statistics
for every configured power sensor.

| Situation | What you see |
| --- | --- |
| No statistics for one or more sensors | Dial and live reading only, and a note naming what is missing |
| Fewer than 7 days of history | "Learning your normal — N of 7 days" |
| 7 to 13 days | Band drawn, marked provisional |
| 14 days or more | Full behaviour |
| An hour with fewer than 10 past samples | That hour is left as a gap, never interpolated |
| Baseline median below 50 W | Sentence suppressed; a percentage of nearly nothing is meaningless |
| `recorder` keeping fewer than about 2 days of five-minute statistics | Band drawn, verdict suppressed, with a note asking you to raise `purge_keep_days` |

The comparison is deliberately conservative. The in-band test uses the spread
seen *within* past hours rather than the spread of hourly averages, so ordinary
appliance cycling is far less likely to read as abnormal. It is not immune: the
envelope is built from five-minute means, which still smooth a short burst, so a
kettle or an induction hob can occasionally tip the verdict. Deviations are
rounded to the nearest 5% and capped at "more than 2×" / "less than half",
because a percentile drawn from 28 samples cannot justify finer precision.

The dial shows both ranges: a solid band for the typical hourly range, and a
fainter dashed band behind it for the wider envelope the verdict actually tests
against. A bead outside the solid band but inside the dashed one is genuinely
normal.

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
| `max_power` | number | derived, minimum 1000 W | Floor for the radial scale ceiling |
| `unit` | `W` or `kW` | automatic | Display unit |

The radial scale ceiling is the largest of `max_power`, the baseline's upper
envelope and today's peak, rounded up to 1, 2 or 5 times a power of ten. It
excludes the live reading on purpose, so a single spike cannot rescale the dial
under you; a reading beyond the ceiling clips at the rim.

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

Below 300px of content width the dial is replaced by a cartesian day strip
carrying the same band, the same line and the same ticks, because a dial that
small cannot show a legible band. On a masonry view the card fills its column.

### Known limitations

- In time zones with a half-hour offset such as `Asia/Kolkata`, Home Assistant's
  hourly statistics buckets straddle two local half-hours, so dial positions sit
  30 minutes off the hour spokes. The comparison itself remains valid because
  the baseline and today's series are bucketed identically.
- The baseline is not split by weekday and weekend. At 28 days a weekend bucket
  would hold about 8 samples, too few to support a percentile.


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
