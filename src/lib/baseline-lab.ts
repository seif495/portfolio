/**
 * A faithful, simplified re-implementation of the backup ransomware
 * detector's scoring rule (src/detection/baseline.py in the private repo):
 *
 *   z = 0.6745 · (x − median) / max(MAD, 3% of |median|)
 *   anomaly if max |z| over features ≥ 3.5 + 20 / n
 *   n = baseline size: the last 100 non-anomalous snapshots (warm-up: 10)
 *   severity: ≥ 4.5 high, ≥ 5.0 critical, else medium
 *
 * Flagged snapshots never enter the baseline (the poisoning defence), and an
 * operator re-baseline restarts it from a given snapshot (Finding 41).
 * Series are synthetic, shaped like the project's evaluation harness:
 * log-normal noise around 2,000 changed files and 80 GiB, size noise at half
 * the changed-files noise. Two of the detector's three features are modelled.
 */

export type Scenario = 'clean' | 'burst' | 'subtle' | 'growth';
export type Noise = 'low' | 'medium' | 'high';

export interface LabState {
  scenario: Scenario;
  noise: Noise;
  seed: number;
  rebaseline: boolean;
}

export interface Day {
  i: number;
  changed: number;
  sizeGiB: number;
  positive: boolean;
  status: 'calibrating' | 'scored';
  anomaly: boolean;
  severity: 'medium' | 'high' | 'critical' | null;
  n: number;
  threshold: number;
  zChanged: number;
  zSize: number;
  median: number;
  scale: number;
}

export interface LabResult {
  scenario: Scenario;
  days: Day[];
  attackStart: number | null;
  rebaselineAt: number | null;
  stats: { scored: number; flagged: number; tp: number; fn: number; fp: number; firstDelay: number | null };
}

export const N_DAYS = 120;
const BASE_CHANGED = 2000;
const BASE_SIZE = 80;
const SIGMA: Record<Noise, number> = { low: 0.03, medium: 0.1, high: 0.25 };
const MIN_SAMPLES = 10;
const WINDOW = 100;
const BASE_THRESHOLD = 3.5;
const HIGH = 4.5;
const CRITICAL = 5.0;
const K = 0.6745;
const FLOOR = 0.03;

export const SCENARIO_START: Record<Scenario, number | null> = {
  clean: null,
  burst: 84,
  subtle: 79,
  growth: 60,
};
export const REBASELINE_AT = 72;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(r(), 1e-12);
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

function mad(xs: number[], med: number) {
  return median(xs.map((x) => Math.abs(x - med)));
}

export function simulate(state: LabState): LabResult {
  // Same seed, same underlying draws: switching scenario or noise changes only that.
  const r = rng(state.seed * 7919 + 17);
  const sigma = SIGMA[state.noise];
  const start = SCENARIO_START[state.scenario];
  const rebaselineAt = state.scenario === 'growth' && state.rebaseline ? REBASELINE_AT : null;

  const series = Array.from({ length: N_DAYS }, (_, i) => {
    let changed = BASE_CHANGED * Math.exp(sigma * gauss(r));
    let size = BASE_SIZE * Math.exp((sigma / 2) * gauss(r));
    let positive = false;
    if (state.scenario === 'burst' && i >= 84 && i <= 86) {
      changed *= 10;
      positive = true;
    } else if (state.scenario === 'subtle' && i >= 79 && i <= 85) {
      changed *= 1.3;
      positive = true;
    } else if (state.scenario === 'growth' && i >= 60) {
      changed *= 2;
      size *= 2;
    }
    return { changed, size, positive };
  });

  const days: Day[] = [];
  for (let i = 0; i < N_DAYS; i++) {
    const s = series[i]!;
    const since = rebaselineAt !== null && i >= rebaselineAt ? rebaselineAt : 0;
    const pool: number[] = [];
    for (let j = i - 1; j >= since && pool.length < WINDOW; j--) if (!days[j]!.anomaly) pool.push(j);
    const n = pool.length;
    const base: Day = {
      i,
      changed: s.changed,
      sizeGiB: s.size,
      positive: s.positive,
      status: 'calibrating',
      anomaly: false,
      severity: null,
      n,
      threshold: BASE_THRESHOLD + 20 / Math.max(n, 1),
      zChanged: 0,
      zSize: 0,
      median: NaN,
      scale: NaN,
    };
    if (n < MIN_SAMPLES) {
      days.push(base);
      continue;
    }
    const ch = pool.map((j) => series[j]!.changed);
    const sz = pool.map((j) => series[j]!.size);
    const mc = median(ch);
    const ms = median(sz);
    const scC = Math.max(mad(ch, mc), FLOOR * Math.abs(mc));
    const scS = Math.max(mad(sz, ms), FLOOR * Math.abs(ms));
    const zc = (K * (s.changed - mc)) / scC;
    const zs = (K * (s.size - ms)) / scS;
    const worst = Math.max(Math.abs(zc), Math.abs(zs));
    const threshold = BASE_THRESHOLD + 20 / n;
    const anomaly = worst >= threshold;
    days.push({
      ...base,
      status: 'scored',
      anomaly,
      severity: anomaly ? (worst >= CRITICAL ? 'critical' : worst >= HIGH ? 'high' : 'medium') : null,
      threshold,
      zChanged: zc,
      zSize: zs,
      median: mc,
      scale: scC,
    });
  }

  const scoredDays = days.filter((d) => d.status === 'scored');
  const tp = days.filter((d) => d.positive && d.anomaly).length;
  const fn = days.filter((d) => d.positive && !d.anomaly).length;
  const fp = days.filter((d) => !d.positive && d.anomaly).length;
  const firstHit = days.find((d) => d.positive && d.anomaly);
  return {
    scenario: state.scenario,
    days,
    attackStart: start,
    rebaselineAt,
    stats: {
      scored: scoredDays.length,
      flagged: days.filter((d) => d.anomaly).length,
      tp,
      fn,
      fp,
      firstDelay: firstHit && start !== null ? firstHit.i - start : null,
    },
  };
}

// ---------------------------------------------------------------------------
// Rendering (string SVG, shared by build-time SSR and the browser)
// ---------------------------------------------------------------------------

export interface Geom {
  w: number;
  h: number;
  l: number;
  r: number;
  t: number;
  b: number;
  narrow: boolean;
}

export const WIDE: Geom = { w: 960, h: 300, l: 52, r: 14, t: 14, b: 30, narrow: false };
export const NARROW: Geom = { w: 480, h: 340, l: 44, r: 10, t: 14, b: 34, narrow: true };

const Y_MIN = 700;
const Y_MAX = 40000;
const ly = (v: number) => Math.log10(Math.min(Math.max(v, Y_MIN), Y_MAX));

export const xOf = (g: Geom, i: number) => g.l + (i / (N_DAYS - 1)) * (g.w - g.l - g.r);
export const yOf = (g: Geom, v: number) =>
  g.t + (1 - (ly(v) - ly(Y_MIN)) / (ly(Y_MAX) - ly(Y_MIN))) * (g.h - g.t - g.b);

const f1 = (n: number) => n.toFixed(1);

export function renderChart(res: LabResult, g: Geom = WIDE): string {
  const { days } = res;
  const X = (i: number) => xOf(g, i);
  const Y = (v: number) => yOf(g, v);
  const CHART = g;
  const out: string[] = [];

  // Grid
  for (const v of [1000, 2000, 5000, 10000, 20000]) {
    const y = f1(Y(v));
    out.push(
      `<line class="lab-grid" x1="${CHART.l}" x2="${CHART.w - CHART.r}" y1="${y}" y2="${y}"/>`,
      `<text class="lab-axis" x="${CHART.l - 8}" y="${y}" text-anchor="end" dominant-baseline="central">${v >= 1000 ? v / 1000 + 'k' : v}</text>`,
    );
  }
  for (const d of g.narrow ? [1, 60, 120] : [1, 30, 60, 90, 120]) {
    out.push(
      `<text class="lab-axis" x="${f1(X(d - 1))}" y="${CHART.h - 8}" text-anchor="${d === 1 ? 'start' : d === 120 ? 'end' : 'middle'}">day ${d}</text>`,
    );
  }

  // Warm-up shading (calibrating runs)
  let runStart: number | null = null;
  const half = (CHART.w - CHART.l - CHART.r) / (N_DAYS - 1) / 2;
  days.forEach((d, idx) => {
    const cal = d.status === 'calibrating';
    if (cal && runStart === null) runStart = idx;
    if ((!cal || idx === days.length - 1) && runStart !== null) {
      const end = cal ? idx : idx - 1;
      const x1 = X(runStart) - half;
      const x2 = X(end) + half;
      out.push(
        `<rect class="lab-warm" x="${f1(x1)}" y="${CHART.t}" width="${f1(x2 - x1)}" height="${CHART.h - CHART.t - CHART.b}"/>`,
        `<text class="lab-note" x="${f1(x1 + 6)}" y="${CHART.t + 12}">warm-up</text>`,
      );
      runStart = null;
    }
  });

  // Threshold band and median, in changed-files units, per scored day.
  const segs: Day[][] = [];
  let cur: Day[] = [];
  for (const d of days) {
    if (d.status === 'scored') cur.push(d);
    else if (cur.length) {
      segs.push(cur);
      cur = [];
    }
  }
  if (cur.length) segs.push(cur);
  for (const seg of segs) {
    const up = seg.map((d) => `${f1(X(d.i))},${f1(Y(d.median + (d.threshold * d.scale) / K))}`);
    const lo = seg
      .map((d) => `${f1(X(d.i))},${f1(Y(Math.max(d.median - (d.threshold * d.scale) / K, 1)))}`)
      .reverse();
    out.push(`<polygon class="lab-band" points="${[...up, ...lo].join(' ')}"/>`);
    out.push(
      `<polyline class="lab-median" points="${seg.map((d) => `${f1(X(d.i))},${f1(Y(d.median))}`).join(' ')}"/>`,
    );
  }

  // Event markers
  const marker = (i: number, label: string, cls: string) => {
    const x = f1(X(i) - half);
    out.push(
      `<line class="lab-marker ${cls}" x1="${x}" x2="${x}" y1="${CHART.t}" y2="${CHART.h - CHART.b}"/>`,
      `<text class="lab-note ${cls}" x="${f1(Number(x) + 6)}" y="${CHART.h - CHART.b - 8}">${label}</text>`,
    );
  };
  if (res.attackStart !== null) {
    const growth = res.scenario === 'growth';
    marker(res.attackStart, growth ? 'data doubles (benign)' : 'attack starts', growth ? 'is-benign' : 'is-attack');
  }
  if (res.rebaselineAt !== null) marker(res.rebaselineAt, 'operator re-baseline', 'is-op');

  // Points
  for (const d of days) {
    const cx = f1(X(d.i));
    const cy = f1(Y(d.changed));
    let cls = 'pt';
    let rad = g.narrow ? 2.4 : 2.6;
    if (d.status === 'calibrating') cls += ' pt--cal';
    if (d.anomaly) {
      cls += ` pt--flag pt--${d.severity}`;
      rad = g.narrow ? 4 : 4.6;
    } else if (d.positive) {
      cls += ' pt--miss';
      rad = g.narrow ? 4 : 4.6;
    }
    out.push(`<circle class="${cls}" cx="${cx}" cy="${cy}" r="${rad}" data-day="${d.i}"/>`);
  }

  return out.join('');
}

export const fmtNum = (n: number) => Math.round(n).toLocaleString('en-US');
