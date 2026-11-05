/**
 * Pick-quality results of the FPL v4 points model on the test seasons
 * (2025-26 + 2026-27, 46 gameweeks, 34,977 rows). Copied from
 * docs/ml_evaluation/README.md in youssef20031/ACL_M3 (generated 2026-10-28,
 * git 6d4123a). The report scores a single early-stopped model (seed 0); the
 * app serves a 5-seed average. CIs are 95% bootstrap intervals over gameweeks.
 */

export interface EvalRow {
  id: string;
  label: string;
  value: number;
  ci?: readonly [number, number];
  kind: 'model' | 'baseline' | 'floor' | 'oracle';
}

export interface EvalMetric {
  id: string;
  tab: string;
  title: string;
  unit: string;
  max: number;
  ticks: number[];
  digits: number;
  rows: EvalRow[];
  note: string;
}

export const evalMetrics: EvalMetric[] = [
  {
    id: 'top20',
    tab: 'Top-20 picks',
    title: 'Average points of the 20 players each method rates highest, per gameweek',
    unit: 'pts',
    max: 12,
    ticks: [0, 2, 4, 6, 8, 10, 12],
    digits: 2,
    rows: [
      { id: 'v4', label: 'v4 XGBoost', value: 4.68, ci: [4.36, 5.03], kind: 'model' },
      { id: 'ppg', label: 'Season points / game', value: 4.08, ci: [3.81, 4.38], kind: 'baseline' },
      { id: 'l6', label: 'Last-6 average', value: 3.89, kind: 'baseline' },
      { id: 'l3', label: 'Last-3 average', value: 3.75, kind: 'baseline' },
      { id: 'pos', label: 'Position mean', value: 1.53, kind: 'floor' },
      { id: 'rand', label: 'Random pick', value: 1.39, kind: 'floor' },
      { id: 'oracle', label: 'Hindsight oracle', value: 11.18, kind: 'oracle' },
    ],
    note: '+0.60 points per pick over the best baseline (95% CI 0.34 to 0.86), about 15%. v4 wins 30 of 45 decided gameweeks and closes 34% of the gap between random picks and perfect hindsight.',
  },
  {
    id: 'captain',
    tab: 'Captain',
    title: 'Points scored by the single player each method rates highest, per gameweek',
    unit: 'pts',
    max: 18,
    ticks: [0, 3, 6, 9, 12, 15, 18],
    digits: 2,
    rows: [
      { id: 'v4', label: 'v4 XGBoost', value: 7.35, kind: 'model' },
      { id: 'ppg', label: 'Season points / game', value: 5.5, kind: 'baseline' },
      { id: 'l6', label: 'Last-6 average', value: 4.83, kind: 'baseline' },
      { id: 'l3', label: 'Last-3 average', value: 4.0, kind: 'baseline' },
      { id: 'pos', label: 'Position mean', value: 2.28, kind: 'floor' },
      { id: 'rand', label: 'Random pick', value: 2.28, kind: 'floor' },
      { id: 'oracle', label: 'Hindsight oracle', value: 17.35, kind: 'oracle' },
    ],
    note: 'v4 leads by +1.85 (95% CI 0.83 to 2.96), significant at 5%. One pick per gameweek is still noisy, so the interval is wide.',
  },
  {
    id: 'spearman',
    tab: 'Rank correlation',
    title: 'Mean per-gameweek Spearman correlation between predicted and actual points',
    unit: 'ρ',
    max: 1,
    ticks: [0, 0.2, 0.4, 0.6, 0.8, 1],
    digits: 3,
    rows: [
      { id: 'v4', label: 'v4 XGBoost', value: 0.727, kind: 'model' },
      { id: 'ppg', label: 'Season points / game', value: 0.675, kind: 'baseline' },
      { id: 'l6', label: 'Last-6 average', value: 0.681, kind: 'baseline' },
      { id: 'l3', label: 'Last-3 average', value: 0.703, kind: 'baseline' },
      { id: 'pos', label: 'Position mean', value: 0.079, kind: 'floor' },
      { id: 'rand', label: 'Random pick', value: 0.013, kind: 'floor' },
      { id: 'oracle', label: 'Hindsight oracle', value: 1, kind: 'oracle' },
    ],
    note: 'A small lead over the last-3 average (0.703). Spearman is dominated by separating players who play from those who don’t, which simple form already does. v4’s edge is at the top of the table, where picks are made.',
  },
];
