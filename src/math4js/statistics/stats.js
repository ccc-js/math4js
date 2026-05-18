/**
 * 敘述統計函數
 *
 * 參考 math4py/statistics/stats.py 實作
 */

/**
 * 計算平均值
 * @param {number[]} x
 * @returns {number}
 */
function mean(x) {
  return x.reduce((a, b) => a + b, 0) / x.length;
}

/**
 * 計算中位數
 * @param {number[]} x
 * @returns {number}
 */
function median(x) {
  const s = [...x].sort((a, b) => a - b);
  const n = s.length;
  if (n % 2 === 0) {
    return (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  return s[Math.floor(n / 2)];
}

/**
 * 計算變異數
 * @param {number[]} x
 * @param {number} ddof - 自由度調整 (預設 1 為樣本變異數)
 * @returns {number}
 */
function variance(x, ddof = 1) {
  const m = mean(x);
  return x.reduce((sum, xi) => sum + (xi - m) ** 2, 0) / (x.length - ddof);
}

/**
 * 計算標準差
 * @param {number[]} x
 * @param {number} ddof - 自由度調整
 * @returns {number}
 */
function sd(x, ddof = 1) {
  return Math.sqrt(variance(x, ddof));
}

/**
 * 計算共變異數
 * @param {number[]} x
 * @param {number[]} y
 * @param {number} ddof - 自由度調整
 * @returns {number}
 */
function covariance(x, y, ddof = 1) {
  const mx = mean(x);
  const my = mean(y);
  const n = x.length;
  return x.reduce((sum, xi, i) => sum + (xi - mx) * (y[i] - my), 0) / (n - ddof);
}

/**
 * 計算 Pearson 相關係數
 * @param {number[]} x
 * @param {number[]} y
 * @returns {number}
 */
function correlation(x, y) {
  return covariance(x, y) / (sd(x) * sd(y));
}

/**
 * 計算分位數
 * @param {number[]} x
 * @param {number} p - 機率 (0 <= p <= 1)
 * @returns {number}
 */
function quantile(x, p) {
  if (x.length === 0) return NaN;
  const sorted = [...x].sort((a, b) => a - b);
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo);
}

/**
 * 計算四分位距 (IQR)
 * @param {number[]} x
 * @returns {number}
 */
function iqr(x) {
  return quantile(x, 0.75) - quantile(x, 0.25);
}

/**
 * 計算 Z 分數
 * @param {number} x
 * @param {number} mu
 * @param {number} sigma
 * @returns {number}
 */
function z_score(x, mu, sigma) {
  return (x - mu) / sigma;
}

/**
 * 標準化 (Z-score)
 * @param {number[]} x
 * @returns {number[]}
 */
function standardize(x) {
  const m = mean(x);
  const s = sd(x);
  return x.map((xi) => (xi - m) / s);
}

/**
 * 完整統計摘要
 * @param {number[]} x
 * @returns {object}
 */
function summary(x) {
  return {
    Min: Math.min(...x),
    Q1: quantile(x, 0.25),
    Median: median(x),
    Mean: mean(x),
    Q3: quantile(x, 0.75),
    Max: Math.max(...x),
    SD: sd(x),
    Var: variance(x),
    N: x.length,
  };
}

/**
 * 最小值
 * @param {number[]} x
 * @returns {number}
 */
function min_val(x) {
  return x.length > 0 ? Math.min(...x) : NaN;
}

/**
 * 最大值
 * @param {number[]} x
 * @returns {number}
 */
function max_val(x) {
  return x.length > 0 ? Math.max(...x) : NaN;
}

/**
 * 全距
 * @param {number[]} x
 * @returns {number}
 */
function range_stat(x) {
  return max_val(x) - min_val(x);
}

/**
 * 總和
 * @param {number[]} x
 * @returns {number}
 */
function sum_stat(x) {
  return x.reduce((a, b) => a + b, 0);
}

module.exports = {
  mean,
  median,
  variance,
  var: variance,
  sd,
  covariance,
  cov: covariance,
  correlation,
  cor: correlation,
  quantile,
  iqr,
  z_score,
  standardize,
  summary,
  min_val,
  max_val,
  range_stat,
  sum_stat,
};
