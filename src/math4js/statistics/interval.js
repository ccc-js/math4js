/**
 * 區間估計 (Interval Estimation)
 *
 * 信賴區間、Bootstrap 區間估計
 */

const { mean, variance, std } = require('./function.js');
const { random } = require('./random.js');
const { qt, qnorm, qchisq } = require('./distributions.js');

/**
 * 平均值信賴區間（使用 t 分布）
 * @param {number[]} x - 樣本資料
 * @param {number} alpha - 顯著水準（預設 0.05 即 95% 信賴區間）
 * @returns {object}
 */
function conf_interval(x, alpha = 0.05) {
  const n = x.length;
  const xbar = mean(x);
  const s = std(x);
  const se = s / Math.sqrt(n);
  const t_crit = qt(1 - alpha / 2, n - 1);

  return {
    lower: xbar - t_crit * se,
    upper: xbar + t_crit * se,
    mean: xbar,
    se: se,
    alpha: alpha,
    confidence: 1 - alpha,
    df: n - 1,
  };
}

/**
 * 比例信賴區間（使用 Z 分布）
 * @param {number} x - 成功次數
 * @param {number} n - 總試驗次數
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function conf_interval_proportion(x, n, alpha = 0.05) {
  const p_hat = x / n;
  const z_crit = qnorm(1 - alpha / 2);
  const se = Math.sqrt((p_hat * (1 - p_hat)) / n);

  return {
    lower: p_hat - z_crit * se,
    upper: p_hat + z_crit * se,
    proportion: p_hat,
    se: se,
    alpha: alpha,
    confidence: 1 - alpha,
  };
}

/**
 * Bootstrap 信賴區間
 * @param {number[]} x - 原始資料
 * @param {function} statisticFn - 統計量函數
 * @param {number} nBootstrap - Bootstrap 次數（預設 1000）
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function bootstrap_ci(x, statisticFn, nBootstrap = 1000, alpha = 0.05) {
  const stats = [];
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
    alpha: alpha,
    confidence: 1 - alpha,
    n_bootstrap: nBootstrap,
  };
}

/**
 * 變異數信賴區間
 * @param {number[]} x - 樣本資料
 * @param {number} alpha - 顯著水準
 * @returns {object}
 */
function conf_interval_variance(x, alpha = 0.05) {
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
    alpha: alpha,
    confidence: 1 - alpha,
    df: df_n,
  };
}

module.exports = {
  conf_interval,
  conf_interval_proportion,
  bootstrap_ci,
  conf_interval_variance,
};
