/**
 * 區間估計 (Interval Estimation)
 *
 * 信賴區間、Bootstrap 區間估計
 */

import { qt, qnorm, qchisq } from './distributions.js';
import { mean, variance, sd } from './stats.js';
import { random } from './random.js';

interface ConfIntervalResult {
  lower: number;
  upper: number;
  mean: number;
  se: number;
  alpha: number;
  confidence: number;
  df?: number;
}

function conf_interval(x: number[], alpha: number = 0.05): ConfIntervalResult {
  const n = x.length;
  const xbar = mean(x);
  const s = sd(x);
  const se = s / Math.sqrt(n);
  const t_crit = qt(1 - alpha / 2, n - 1);

  return {
    lower: xbar - t_crit * se,
    upper: xbar + t_crit * se,
    mean: xbar,
    se,
    alpha,
    confidence: 1 - alpha,
    df: n - 1,
  };
}

interface ConfIntervalProportionResult {
  lower: number;
  upper: number;
  proportion: number;
  se: number;
  alpha: number;
  confidence: number;
}

function conf_interval_proportion(
  x: number,
  n: number,
  alpha: number = 0.05
): ConfIntervalProportionResult {
  const p_hat = x / n;
  const z_crit = qnorm(1 - alpha / 2);
  const se = Math.sqrt((p_hat * (1 - p_hat)) / n);

  return {
    lower: p_hat - z_crit * se,
    upper: p_hat + z_crit * se,
    proportion: p_hat,
    se,
    alpha,
    confidence: 1 - alpha,
  };
}

type StatisticFn = (x: number[]) => number;

interface BootstrapCIResult {
  lower: number;
  upper: number;
  statistic: number;
  alpha: number;
  confidence: number;
  n_bootstrap: number;
}

function bootstrap_ci(
  x: number[],
  statisticFn: StatisticFn,
  nBootstrap: number = 1000,
  alpha: number = 0.05
): BootstrapCIResult {
  const stats: number[] = [];
  for (let i = 0; i < nBootstrap; i++) {
    const resampled = x.map(() => x[Math.floor(random() * x.length)]);
    stats.push(statisticFn(resampled));
  }

  stats.sort((a, b) => a - b);
  const lower_idx = Math.floor((alpha / 2) * nBootstrap);
  const upper_idx = Math.floor((1 - alpha / 2) * nBootstrap);

  return {
    lower: stats[lower_idx],
    upper: stats[upper_idx],
    statistic: statisticFn(x),
    alpha,
    confidence: 1 - alpha,
    n_bootstrap: nBootstrap,
  };
}

interface ConfIntervalVarianceResult {
  lower: number;
  upper: number;
  variance: number;
  alpha: number;
  confidence: number;
  df: number;
}

function conf_interval_variance(x: number[], alpha: number = 0.05): ConfIntervalVarianceResult {
  const n = x.length;
  const s_sq = variance(x);
  const df_n = n - 1;

  const chi_lower = qchisq(1 - alpha / 2, df_n);
  const chi_upper = qchisq(alpha / 2, df_n);

  const lower = (df_n * s_sq) / chi_lower;
  const upper = (df_n * s_sq) / chi_upper;

  return {
    lower: Math.min(lower, upper),
    upper: Math.max(lower, upper),
    variance: s_sq,
    alpha,
    confidence: 1 - alpha,
    df: df_n,
  };
}

export { conf_interval, conf_interval_proportion, bootstrap_ci, conf_interval_variance };
