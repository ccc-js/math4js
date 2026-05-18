/**
 * 假設檢定 (Hypothesis Testing)
 *
 * 實作 Z 檢定、t 檢定、卡方檢定、變異數分析等假設檢定函數
 */

const { pt, qt, pf, pchisq, qchisq, qnorm } = require('./distributions.js');
const { mean, variance } = require('./function.js');

/**
 * Z 檢定：檢驗樣本均值是否與假設均值有顯著差異
 * @param {number[]} x - 樣本資料
 * @param {number} mu0 - 假設的母體均值
 * @param {number} sigma - 母體標準差（已知）
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function z_test(x, mu0, sigma, alpha = 0.05) {
  const n = x.length;
  const xbar = mean(x);
  const se = sigma / Math.sqrt(n);
  const z = (xbar - mu0) / se;
  const p_value = 2 * (1 - normalCdf(Math.abs(z)));

  return {
    statistic: z,
    p_value: p_value,
    reject: p_value < alpha,
    alpha: alpha,
    ci: [xbar - qnorm(1 - alpha / 2) * se, xbar + qnorm(1 - alpha / 2) * se],
  };
}

/**
 * 單樣本 t 檢定
 * @param {number[]} x - 樣本資料
 * @param {number} mu0 - 假設的母體均值
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function t_test(x, mu0 = 0, alpha = 0.05) {
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
    p_value: p_value,
    reject: p_value < alpha,
    alpha: alpha,
    mean: xbar,
    se: se,
    t_crit: t_crit,
    ci: [xbar - t_crit * se, xbar + t_crit * se],
  };
}

/**
 * 雙樣本 t 檢定（假設變異數相等）
 * @param {number[]} x1 - 樣本 1
 * @param {number[]} x2 - 樣本 2
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function t_test_two(x1, x2, alpha = 0.05) {
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
    p_value: p_value,
    reject: p_value < alpha,
    alpha: alpha,
    mean_diff: x1bar - x2bar,
    se: se,
    t_crit: t_crit,
    ci: [x1bar - x2bar - t_crit * se, x1bar - x2bar + t_crit * se],
  };
}

/**
 * 配對 t 檢定
 * @param {number[]} x1 - 配對樣本 1
 * @param {number[]} x2 - 配對樣本 2
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function t_test_paired(x1, x2, alpha = 0.05) {
  const diff = x1.map((v, i) => v - x2[i]);
  return t_test(diff, 0, alpha);
}

/**
 * 卡方檢定（適合度檢定）
 * @param {number[]} observed - 觀測值
 * @param {number[]} expected - 期望值
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function chisq_test(observed, expected, alpha = 0.05) {
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
    p_value: p_value,
    reject: p_value < alpha,
    alpha: alpha,
    chi_crit: chi_crit,
  };
}

/**
 * 單因子變異數分析 (One-way ANOVA)
 * @param {number[][]} groups - 各組的資料
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function anova(groups, alpha = 0.05) {
  if (groups.length < 2) {
    throw new Error('Need at least 2 groups');
  }

  const k = groups.length;
  const n = groups.reduce((sum, g) => sum + g.length, 0);

  const grand_mean = groups.reduce((sum, g) => sum + g.reduce((s, x) => s + x, 0), 0) / n;

  let ss_between = 0;
  let ss_total = 0;
  const group_means = [];

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
    ss_between: ss_between,
    ss_within: ss_within,
    ss_total: ss_total,
    ms_between: ms_between,
    ms_within: ms_within,
    p_value: p_value,
    reject: p_value < alpha,
    alpha: alpha,
    group_means: group_means,
    grand_mean: grand_mean,
  };
}

/**
 * 標準常態分布 CDF
 */
function normalCdf(x) {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741;
  const a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

module.exports = {
  z_test,
  t_test,
  t_test_two,
  t_test_paired,
  chisq_test,
  anova,
};
