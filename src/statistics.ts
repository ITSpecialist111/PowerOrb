import type {
  BandPoint,
  Baseline,
  BaselineHour,
  HomeAssistant,
  PowerChannel,
  StatisticsMetadata,
  StatisticsPeriod,
  StatisticsRow,
  TodayHour,
} from "./types";

export const BASELINE_WINDOW_DAYS = 28;
export const LIVE_WINDOW_DAYS = 5;
export const MIN_BUCKET_SAMPLES = 10;
export const MIN_LIVE_SAMPLES = 20;
export const PROVISIONAL_DAYS = 7;
export const FULL_CONFIDENCE_DAYS = 14;

const DAY_MS = 86_400_000;
const POWER_UNITS = new Set(["w", "kw", "mw", "gw"]);

function parts(timestamp: number, timeZone?: string): Record<string, string> {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const result: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(timestamp))) {
    result[part.type] = part.value;
  }
  return result;
}

export function zonedHour(timestamp: number, timeZone?: string): number {
  return Number(parts(timestamp, timeZone).hour) % 24;
}

export function zonedDayKey(timestamp: number, timeZone?: string): string {
  const value = parts(timestamp, timeZone);
  return `${value.year}-${value.month}-${value.day}`;
}

/** Milliseconds since the epoch at the most recent local midnight. */
export function localMidnight(now: number, timeZone?: string): number {
  const value = parts(now, timeZone);
  const guess = Date.UTC(
    Number(value.year),
    Number(value.month) - 1,
    Number(value.day),
  );
  const zoned = parts(guess, timeZone);
  const asZoned = Date.UTC(
    Number(zoned.year),
    Number(zoned.month) - 1,
    Number(zoned.day),
    Number(zoned.hour) % 24,
    Number(zoned.minute),
    Number(zoned.second),
  );
  return guess - (asZoned - guess);
}

/** Local midnight `days` calendar days before the given instant. */
export function localMidnightDaysAgo(
  now: number,
  days: number,
  timeZone?: string,
): number {
  // Step back via midday so a daylight-saving shift cannot land on the previous day.
  return localMidnight(localMidnight(now, timeZone) - days * DAY_MS + DAY_MS / 2, timeZone);
}

/** Fractional hour of the day, 0 to 24, in the given zone. */
export function fractionalHour(timestamp: number, timeZone?: string): number {
  const value = parts(timestamp, timeZone);
  return (
    (Number(value.hour) % 24) +
    Number(value.minute) / 60 +
    Number(value.second) / 3_600
  );
}

export function percentile(sorted: number[], fraction: number): number {
  if (sorted.length === 0) return 0;
  const position = fraction * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const low = sorted[lower] ?? 0;
  const high = sorted[upper] ?? low;
  if (lower === upper) return low;
  return low + (high - low) * (position - lower);
}

/**
 * Reduce one statistics bucket to a single home-load figure.
 *
 * Mirrors the live derivation exactly: sum every signed channel, then clamp
 * once. A bucket missing any channel is discarded rather than partially
 * summed, so the baseline can never be a home load with a term silently
 * absent.
 */
export function bucketLoad(
  channels: PowerChannel[],
  rows: Map<string, StatisticsRow>,
): number | null {
  let total = 0;
  for (const channel of channels) {
    const row = rows.get(channel.entityId);
    if (!row || typeof row.mean !== "number" || !Number.isFinite(row.mean)) {
      return null;
    }
    total += row.mean * channel.multiplier;
  }
  return Math.max(0, total);
}

function indexRows(
  response: Record<string, StatisticsRow[]>,
  channels: PowerChannel[],
): Map<number, Map<string, StatisticsRow>> {
  const buckets = new Map<number, Map<string, StatisticsRow>>();
  for (const channel of channels) {
    for (const row of response[channel.entityId] ?? []) {
      const bucket = buckets.get(row.start) ?? new Map<string, StatisticsRow>();
      bucket.set(channel.entityId, row);
      buckets.set(row.start, bucket);
    }
  }
  return buckets;
}

async function fetchStatistics(
  hass: HomeAssistant,
  statisticIds: string[],
  startTime: number,
  endTime: number | undefined,
  period: StatisticsPeriod,
): Promise<Record<string, StatisticsRow[]>> {
  const message: Record<string, unknown> = {
    type: "recorder/statistics_during_period",
    start_time: new Date(startTime).toISOString(),
    statistic_ids: statisticIds,
    period,
    types: ["mean"],
    units: { power: "W" },
  };
  if (endTime !== undefined) message.end_time = new Date(endTime).toISOString();
  return hass.callWS<Record<string, StatisticsRow[]>>(message);
}

/**
 * Confirm every channel has a recorded statistic in the power unit class.
 *
 * Deliberately all-or-nothing: a home-load baseline missing one term is not a
 * home-load baseline.
 */
export async function missingStatistics(
  hass: HomeAssistant,
  channels: PowerChannel[],
): Promise<string[]> {
  const ids = [...new Set(channels.map((channel) => channel.entityId))];
  const metadata = await hass.callWS<StatisticsMetadata[]>({
    type: "recorder/get_statistics_metadata",
    statistic_ids: ids,
  });

  const usable = new Set<string>();
  for (const entry of metadata ?? []) {
    const unit = entry.display_unit_of_measurement?.toLowerCase();
    const isPower =
      entry.unit_class === "power" ||
      (unit !== undefined && POWER_UNITS.has(unit));
    if (entry.has_mean !== false && isPower) usable.add(entry.statistic_id);
  }
  return ids.filter((id) => !usable.has(id));
}

export async function fetchBaseline(
  hass: HomeAssistant,
  channels: PowerChannel[],
  now: number,
  timeZone?: string,
): Promise<Baseline> {
  const midnight = localMidnight(now, timeZone);
  const start = localMidnightDaysAgo(now, BASELINE_WINDOW_DAYS, timeZone);
  const liveStart = localMidnightDaysAgo(now, LIVE_WINDOW_DAYS, timeZone);
  const ids = [...new Set(channels.map((channel) => channel.entityId))];

  // end_time is today's local midnight, so today never enters its own baseline.
  // The hourly series drives the drawn band; the five-minute series supplies a
  // genuine joint distribution of home load for judging instantaneous readings,
  // because every five-minute bucket is a real co-occurring combination of all
  // the channels rather than a worst-case bound over them.
  const [hourly, live] = await Promise.all([
    fetchStatistics(hass, ids, start, midnight, "hour"),
    fetchStatistics(hass, ids, liveStart, midnight, "5minute"),
  ]);

  const means: number[][] = Array.from({ length: 24 }, () => []);
  const liveSamples: number[][] = Array.from({ length: 24 }, () => []);
  const days = new Set<string>();

  for (const [bucketStart, rows] of indexRows(hourly, channels)) {
    const load = bucketLoad(channels, rows);
    if (load === null) continue;
    means[zonedHour(bucketStart, timeZone)]?.push(load);
    days.add(zonedDayKey(bucketStart, timeZone));
  }

  for (const [bucketStart, rows] of indexRows(live, channels)) {
    const load = bucketLoad(channels, rows);
    if (load === null) continue;
    liveSamples[zonedHour(bucketStart, timeZone)]?.push(load);
  }

  const hours: (BaselineHour | null)[] = means.map((values, hour) => {
    if (values.length < MIN_BUCKET_SAMPLES) return null;
    const sortedMeans = [...values].sort((a, b) => a - b);
    const withinHour = liveSamples[hour] ?? [];
    const sortedLive =
      withinHour.length >= MIN_LIVE_SAMPLES
        ? [...withinHour].sort((a, b) => a - b)
        : null;
    return {
      hour,
      low: percentile(sortedMeans, 0.1),
      median: percentile(sortedMeans, 0.5),
      high: percentile(sortedMeans, 0.9),
      liveLow: sortedLive ? percentile(sortedLive, 0.1) : null,
      liveHigh: sortedLive ? percentile(sortedLive, 0.9) : null,
      samples: sortedMeans.length,
    };
  });

  const dayCount = days.size;
  let status: Baseline["status"] = "ok";
  if (hours.every((hour) => hour === null) || dayCount < PROVISIONAL_DAYS) {
    status = "learning";
  } else if (dayCount < FULL_CONFIDENCE_DAYS) {
    status = "provisional";
  }

  return { hours, days: dayCount, status };
}

export async function fetchToday(
  hass: HomeAssistant,
  channels: PowerChannel[],
  now: number,
  timeZone?: string,
): Promise<TodayHour[]> {
  const midnight = localMidnight(now, timeZone);
  const ids = [...new Set(channels.map((channel) => channel.entityId))];
  const response = await fetchStatistics(hass, ids, midnight, undefined, "hour");
  const buckets = indexRows(response, channels);

  // The hour in progress holds a partial mean, so it cannot be compared with a
  // distribution built from whole hours.
  const currentHourStart = Math.floor(now / 3_600_000) * 3_600_000;

  // On a daylight-saving fall-back day one local hour occurs twice; keeping the
  // later reading leaves the series monotonic in angle.
  const byHour = new Map<number, TodayHour>();
  for (const [bucketStart, rows] of [...buckets.entries()].sort(
    (a, b) => a[0] - b[0],
  )) {
    if (bucketStart >= currentHourStart) continue;
    const load = bucketLoad(channels, rows);
    if (load === null) continue;
    const hour = zonedHour(bucketStart, timeZone);
    byHour.set(hour, { hour, watts: load });
  }
  return [...byHour.values()].sort((a, b) => a.hour - b.hour);
}

export interface Deviation {
  ratio: number;
  direction: "above" | "below" | "normal";
  sentence: string;
}

function hourLabel(hour: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hour)}:00\u2013${pad((hour + 1) % 24)}:00`;
}

/** Margin above the envelope before a reading counts as a departure. */
export const DEVIATION_MARGIN = 1.1;

/**
 * The range to draw for an hour.
 *
 * This is the spread of hourly means, because the line drawn on it is a series
 * of hourly means. Judging that line against the five-minute envelope would be
 * a unit mismatch: an hourly mean is the average of twelve five-minute means,
 * so its spread is smaller by up to the square root of twelve, and an envelope
 * built from five-minute data is roughly four times too wide to ever be
 * crossed.
 */
export function bandBounds(band: BaselineHour): { low: number; high: number } {
  return { low: band.low, high: band.high };
}

/**
 * Bounds for judging a completed hour, matching the drawn ring.
 *
 * The grace is measured in band widths rather than watts, so it is the same
 * distance on the plot for every hour. A multiplicative margin would give a
 * tight, high-level hour such as an off-peak car charge a grace zone spanning
 * the entire dial.
 */
export function hourlyBounds(band: BaselineHour): { low: number; high: number } {
  const bounds = bandBounds(band);
  const slack = bandWidth(bounds) * BAND_MARGIN;
  return { low: bounds.low - slack, high: bounds.high + slack };
}

/**
 * Bounds for judging one instant, or null when there is no five-minute
 * envelope and therefore no defensible claim about an instant.
 */
export function deviationBounds(
  band: BaselineHour,
): { low: number; high: number } | null {
  if (band.liveLow === null || band.liveHigh === null) return null;
  return {
    low: band.liveLow / DEVIATION_MARGIN,
    high: band.liveHigh * DEVIATION_MARGIN,
  };
}

/**
 * Compare the live figure with the band for the hour it falls in.
 *
 * The reported figure is measured against the boundary that was actually
 * crossed rather than the median. Quoting a multiple of the median would
 * overstate: crossing a p90 of 1.6 kW at 1.74 kW is a 9% departure, not the
 * 3.5x the median implies.
 */
export function describeDeviation(
  watts: number,
  band: BaselineHour | null,
): Deviation | null {
  if (!band) return null;
  if (band.median < 50) return null;
  const bounds = deviationBounds(band);
  if (!bounds) return null;

  const label = hourLabel(band.hour);
  if (watts >= bounds.low && watts <= bounds.high) {
    return { ratio: 1, direction: "normal", sentence: `Normal for ${label}` };
  }

  const above = watts > bounds.high;
  const direction = above ? "above" : "below";
  const boundary = Math.max(above ? band.liveHigh! : band.liveLow!, 1);
  const ratio = watts / boundary;

  if (above && ratio >= 2) {
    return {
      ratio,
      direction,
      sentence: `More than 2\u00d7 the usual range for ${label}`,
    };
  }
  if (!above && ratio <= 0.5) {
    return {
      ratio,
      direction,
      sentence: `Less than half the usual range for ${label}`,
    };
  }

  // The margin guarantees at least a ten percent departure, so there is no
  // rounding case that could report zero and contradict the drawn tick.
  const percent = Math.round(Math.abs(ratio - 1) * 20) * 5;
  return {
    ratio,
    direction,
    sentence: `${percent}% ${direction} the usual range for ${label}`,
  };
}

/** Where the usual range sits in the plot, as a fraction of the drawable span. */
export const BAND_LOW_UNIT = 0.36;
export const BAND_HIGH_UNIT = 0.64;
/** How many band widths beyond the range reach the edge of the plot. */
export const TAIL_BANDS = 6;
/** Floor on a band width, so a very tight hour is not infinitely sensitive. */
export const MIN_BAND_WATTS = 60;
/** Grace outside the range before a completed hour counts as a departure. */
export const BAND_MARGIN = 0.1;

export function bandWidth(bounds: { low: number; high: number }): number {
  return Math.max(bounds.high - bounds.low, MIN_BAND_WATTS);
}

/**
 * Where a reading sits relative to an hour's usual range.
 *
 * 0 is the bottom of the range and 1 the top, so values outside are measured
 * in band widths rather than watts.
 */
export function bandPosition(
  watts: number,
  bounds: { low: number; high: number },
): number {
  return (watts - bounds.low) / bandWidth(bounds);
}

/**
 * Map a band position onto the plot, 0 at the inner edge and 1 at the outer.
 *
 * Every hour's usual range lands on the same two values, which is the whole
 * point: normal becomes a circle, and a household whose load runs from 400 W
 * overnight to 6 kW while the car charges can still be read at a glance.
 * Outside the range the scale compresses, so an extreme hour stays on the
 * plot instead of pinning the scale for everything else.
 */
export function bandUnit(position: number): number {
  const span = BAND_HIGH_UNIT - BAND_LOW_UNIT;
  if (position >= 0 && position <= 1) {
    return BAND_LOW_UNIT + span * position;
  }
  const knee = Math.asinh(TAIL_BANDS);
  if (position > 1) {
    const tail = Math.min(1, Math.asinh(position - 1) / knee);
    return BAND_HIGH_UNIT + (1 - BAND_HIGH_UNIT) * tail;
  }
  const tail = Math.min(1, Math.asinh(-position) / knee);
  return BAND_LOW_UNIT - BAND_LOW_UNIT * tail;
}

/** Round a scale ceiling up to the next step on a fine ladder. */
const CEILING_STEPS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

export function niceCeiling(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1_000;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalised = value / magnitude;
  const step = CEILING_STEPS.find((candidate) => normalised <= candidate + 1e-9) ?? 10;
  return step * magnitude;
}

/**
 * Group the baseline into runs of consecutive hours.
 *
 * `wrap` joins a complete or midnight-spanning run into one closed ring by
 * continuing past hour 24. A cartesian strip has no such adjacency and must be
 * built with `wrap` off, otherwise the continued hours land beyond the
 * right-hand edge.
 */
export function bandRuns(
  hours: (BaselineHour | null)[],
  wrap: boolean,
): BandPoint[][] {
  const runs: BandPoint[][] = [];
  let run: BandPoint[] = [];
  for (const hour of hours) {
    if (!hour) {
      if (run.length > 0) runs.push(run);
      run = [];
      continue;
    }
    run.push({ hour: hour.hour, ...bandBounds(hour) });
  }
  if (run.length > 0) runs.push(run);

  if (!wrap) return runs;

  const first = runs[0];
  const last = runs[runs.length - 1];
  if (!first || !last || !hours[0] || !hours[23]) return runs;

  if (runs.length === 1) {
    const head = first[0];
    if (head) first.push({ ...head, hour: 24 });
    return runs;
  }
  runs.pop();
  runs.shift();
  runs.push([...last, ...first.map((entry) => ({ ...entry, hour: entry.hour + 24 }))]);
  return runs;
}
