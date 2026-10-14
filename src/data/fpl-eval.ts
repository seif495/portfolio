/**
 * Pick-quality results of the FPL v3 points model on the unseen test seasons
 * (2025-26 + 2026-27, 43 gameweeks, 32,973 rows). Copied from
 * docs/ml_evaluation/README.md in youssef20031/ACL_M3 (generated 2026-10-12,
 * git 207fc74). CIs are 95% bootstrap intervals over gameweeks.
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
      { id: 'v3', label: 'v3 XGBoost', value: 4.6, ci: [4.31, 4.92], kind: 'model' },
      { id: 'ppg', label: 'Season points / game', value: 4.13, ci: [3.86, 4.43], kind: 'baseline' },
      { id: 'l6', label: 'Last-6 average', value: 3.94, kind: 'baseline' },
      { id: 'l3', label: 'Last-3 average', value: 3.78, kind: 'baseline' },
      { id: 'pos', label: 'Position mean', value: 1.54, kind: 'floor' },
      { id: 'rand', label: 'Random pick', value: 1.4, kind: 'floor' },
      { id: 'oracle', label: 'Hindsight oracle', value: 11.22, kind: 'oracle' },
    ],
    note: '+0.46 points per pick over the best baseline (95% CI 0.22 to 0.72), about 11%. v3 wins 27 of 41 decided gameweeks and closes 33% of the gap between random picks and perfect hindsight.',
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
      { id: 'v3', label: 'v3 XGBoost', value: 6.28, kind: 'model' },
      { id: 'ppg', label: 'Season points / game', value: 5.58, kind: 'baseline' },
      { id: 'l6', label: 'Last-6 average', value: 4.72, kind: 'baseline' },
      { id: 'l3', label: 'Last-3 average', value: 4.12, kind: 'baseline' },
      { id: 'pos', label: 'Position mean', value: 2.4, kind: 'floor' },
      { id: 'rand', label: 'Random pick', value: 2.35, kind: 'floor' },
      { id: 'oracle', label: 'Hindsight oracle', value: 17.4, kind: 'oracle' },
    ],
    note: 'v3 leads by +0.70, but the 95% CI (−0.81 to 2.33) includes zero: one pick per gameweek is too noisy to call. The report says so, and so does this chart.',
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
      { id: 'v3', label: 'v3 XGBoost', value: 0.708, kind: 'model' },
      { id: 'ppg', label: 'Season points / game', value: 0.676, kind: 'baseline' },
      { id: 'l6', label: 'Last-6 average', value: 0.685, kind: 'baseline' },
      { id: 'l3', label: 'Last-3 average', value: 0.707, kind: 'baseline' },
      { id: 'pos', label: 'Position mean', value: 0.08, kind: 'floor' },
      { id: 'rand', label: 'Random pick', value: 0.014, kind: 'floor' },
      { id: 'oracle', label: 'Hindsight oracle', value: 1, kind: 'oracle' },
    ],
    note: 'A near tie with the last-3 average. Spearman is dominated by separating players who play from those who don’t, which simple form already does. v3’s edge is at the top of the table, where picks are made.',
  },
];
