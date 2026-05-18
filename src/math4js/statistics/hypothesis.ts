/**
 * 假設檢定 (Hypothesis Testing)
 *
 * 實作 Z 檢定、t 檢定、卡方檢定、變異數分析等假設檢定函數
 */

import { pt, qt, pf, pchisq, qchisq, qnorm } from './distributions.js';
import { mean, variance } from './stats.js';

interface ZTestResult {
  statistic: number;
  p_value: number;
  reject: boolean;
  alpha: number;
  ci: [number, number];
}

function z_test(x: number[], mu0: number, sigma: number, alpha: number = 0.05): ZTestResult {
  const n = x.length;
  const xbar = mean(x);
  const se = sigma / Math.sqrt(n);
  const z = (xbar - mu0) / se;
  const p_value = 2 * (1 - normalCdf(Math.abs(z)));

  return {
    statistic: z,
    p_value,
    reject: p_value < alpha,
    alpha,
    ci: [xbar - qnorm(1 - alpha / 2) * se, xbar + qnorm(1 - alpha / 2) * se],
  };
}

interface TTestResult {
  statistic: number;
  df: number;
  p_value: number;
  reject: boolean;
  alpha: number;
  mean: number;
  se: number;
  t_crit: number;
  ci: [number, number];
}

function t_test(x: number[], mu0: number = 0, alpha: number = 0.05): TTestResult {
  const n = x.length;
  const xbar = mean(x);
  const s = Math.sqrt(variance(x));
  const se = s / Math.sqrt(n);
  const t_stat = (xbar - mu0) / se;
  const df_n = n - 1;

  const t_crit = qt(1 - alpha / 2, df_n);
  const p_value = 2 * (1 - pt(Math.abs(t_stat), df_n));

  return {
    statistic: t_stat,
    df: df_n,
    p_value,
    reject: p_value < alpha,
    alpha,
    mean: xbar,
    se,
    t_crit,
    ci: [xbar - t_crit * se, xbar + t_crit * se],
  };
}

function t_test_two(x1: number[], x2: number[], alpha: number = 0.05): TTestResult {
  const n1 = x1.length;
  const n2 = x2.length;
  const x1bar = mean(x1);
  const x2bar = mean(x2);
  const s1_sq = variance(x1);
  const s2_sq = variance(x2);

  const s_pooled = Math.sqrt(((n1 - 1) * s1_sq + (n2 - 1) * s2_sq) / (n1 + n2 - 2));
  const se = s_pooled * Math.sqrt(1 / n1 + 1 / n2);
  const t_stat = (x1bar - x2bar) / se;
  const df_n = n1 + n2 - 2;

  const p_value = 2 * (1 - pt(Math.abs(t_stat), df_n));
  const t_crit = qt(1 - alpha / 2, df_n);

  return {
    statistic: t_stat,
    df: df_n,
    p_value,
    reject: p_value < alpha,
    alpha,
    mean: x1bar - x2bar,
    se,
    t_crit,
    ci: [x1bar - x2bar - t_crit * se, x1bar - x2bar + t_crit * se],
  };
}

function t_test_paired(x1: number[], x2: number[], alpha: number = 0.05): TTestResult {
  const diff = x1.map((v, i) => v - x2[i]);
  return t_test(diff, 0, alpha);
}

interface ChiSqTestResult {
  statistic: number;
  df: number;
  p_value: number;
  reject: boolean;
  alpha: number;
  chi_crit: number;
}

function chisq_test(observed: number[], expected: number[], alpha: number = 0.05): ChiSqTestResult {
  if (observed.length !== expected.length) {
    throw new Error('observed and expected must have same length');
  }

  let chi_sq = 0;
  for (let i = 0; i < observed.length; i++) {
    if (expected[i] !== 0) {
      chi_sq += (observed[i] - expected[i]) ** 2 / expected[i];
    }
  }

  const df_n = observed.length - 1;
  const p_value = 1 - pchisq(chi_sq, df_n);
  const chi_crit = qchisq(1 - alpha, df_n);

  return {
    statistic: chi_sq,
    df: df_n,
    p_value,
    reject: p_value < alpha,
    alpha,
    chi_crit,
  };
}

interface AnovaResult {
  statistic: number;
  df_between: number;
  df_within: number;
  df_total: number;
  ss_between: number;
  ss_within: number;
  ss_total: number;
  ms_between: number;
  ms_within: number;
  p_value: number;
  reject: boolean;
  alpha: number;
  group_means: number[];
  grand_mean: number;
}

function anova(groups: number[][], alpha: number = 0.05): AnovaResult {
  if (groups.length < 2) {
    throw new Error('Need at least 2 groups');
  }

  const k = groups.length;
  const n = groups.reduce((sum, g) => sum + g.length, 0);

  const grand_mean = groups.reduce((sum, g) => sum + g.reduce((s, x) => s + x, 0), 0) / n;

  let ss_between = 0;
  let ss_total = 0;
  const group_means: number[] = [];

  for (let i = 0; i < groups.length; i++) {
    const g_mean = mean(groups[i]);
    group_means.push(g_mean);
    ss_between += groups[i].length * (g_mean - grand_mean) ** 2;
  }

  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      ss_total += (groups[i][j] - grand_mean) ** 2;
    }
  }

  const ss_within = ss_total - ss_between;
  const df_b = k - 1;
  const df_w = n - k;
  const df_t = n - 1;

  const ms_between = ss_between / df_b;
  const ms_within = ss_within / df_w;
  const f_stat = ms_between / ms_within;

  const p_value = 1 - pf(f_stat, df_b, df_w);

  return {
    statistic: f_stat,
    df_between: df_b,
    df_within: df_w,
    df_total: df_t,
    ss_between,
    ss_within,
    ss_total,
    ms_between,
    ms_within,
    p_value,
    reject: p_value < alpha,
    alpha,
    group_means,
    grand_mean,
  };
}

function normalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

export { z_test, t_test, t_test_two, t_test_paired, chisq_test, anova };
