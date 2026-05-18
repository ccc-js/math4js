/**
 * 統計函數：統計計算函數。
 *
 * 描述統計、假設檢定輔助函數。
 * 參考 math4py/statistics/function.py 實作
 */

const { random } = require('./random.js');

function mean(x) {
  return x.reduce((a, b) => a + b, 0) / x.length;
}

function median(x) {
  const s = [...x].sort((a, b) => a - b);
  const n = s.length;
  if (n % 2 === 0) {
    return (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  return s[Math.floor(n / 2)];
}

function variance(x, ddof = 1) {
  const m = mean(x);
  return x.reduce((sum, xi) => sum + (xi - m) ** 2, 0) / (x.length - ddof);
}

function std(x, ddof = 1) {
  return Math.sqrt(variance(x, ddof));
}

function covariance(x, y, ddof = 1) {
  const mx = mean(x);
  const my = mean(y);
  const n = x.length;
  return x.reduce((sum, xi, i) => sum + (xi - mx) * (y[i] - my), 0) / (n - ddof);
}

function correlation(x, y) {
  return covariance(x, y) / (std(x) * std(y));
}

function quantile(x, p) {
  const sorted = [...x].sort((a, b) => a - b);
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo);
}

function iqr(x) {
  return quantile(x, 0.75) - quantile(x, 0.25);
}

function z_score(x, mu, sigma) {
  return (x - mu) / sigma;
}

function standardize(x) {
  const m = mean(x);
  const s = std(x);
  return x.map(xi => (xi - m) / s);
}

function bootstrap_ci(x, statisticFn, nBootstrap = 1000, alpha = 0.05) {
  const stats = [];
  for (let i = 0; i < nBootstrap; i++) {
    const resampled = x.map(() => x[Math.floor(random() * x.length)]);
    stats.push(statisticFn(resampled));
  }
  stats.sort((a, b) => a - b);
  return [stats[Math.floor(alpha / 2 * nBootstrap)], stats[Math.floor((1 - alpha / 2) * nBootstrap)]];
}

function log_likelihood(y, y_pred) {
  return -y.reduce((sum, yi, i) => sum + (yi - y_pred[i]) ** 2, 0) / 2;
}

function aic(n, log_lik, k) {
  return 2 * k - 2 * log_lik;
}

function bic(n, log_lik, k) {
  return k * Math.log(n) - 2 * log_lik;
}

function summary(x) {
  return {
    Min: Math.min(...x),
    Q1: quantile(x, 0.25),
    Median: median(x),
    Mean: mean(x),
    Q3: quantile(x, 0.75),
    Max: Math.max(...x),
    SD: std(x),
    Variance: variance(x),
    N: x.length,
  };
}

function range_stat(x) {
  return Math.max(...x) - Math.min(...x);
}

module.exports = {
  mean,
  median,
  variance,
  std,
  covariance,
  correlation,
  quantile,
  iqr,
  z_score,
  standardize,
  bootstrap_ci,
  log_likelihood,
  aic,
  bic,
  summary,
  range_stat,
};