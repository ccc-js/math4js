/**
 * 敘述統計函數
 *
 * 參考 math4py/statistics/stats.py 實作
 */

function mean(x: number[]): number {
  return x.reduce((a, b) => a + b, 0) / x.length;
}

function median(x: number[]): number {
  const s = [...x].sort((a, b) => a - b);
  const n = s.length;
  if (n % 2 === 0) {
    return (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  return s[Math.floor(n / 2)];
}

function variance(x: number[], ddof: number = 1): number {
  const m = mean(x);
  return x.reduce((sum, xi) => sum + (xi - m) ** 2, 0) / (x.length - ddof);
}

function sd(x: number[], ddof: number = 1): number {
  return Math.sqrt(variance(x, ddof));
}

function covariance(x: number[], y: number[], ddof: number = 1): number {
  const mx = mean(x);
  const my = mean(y);
  const n = x.length;
  return x.reduce((sum, xi, i) => sum + (xi - mx) * (y[i] - my), 0) / (n - ddof);
}

function correlation(x: number[], y: number[]): number {
  return covariance(x, y) / (sd(x) * sd(y));
}

function quantile(x: number[], p: number): number {
  if (x.length === 0) return NaN;
  const sorted = [...x].sort((a, b) => a - b);
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo);
}

function iqr(x: number[]): number {
  return quantile(x, 0.75) - quantile(x, 0.25);
}

function z_score(x: number, mu: number, sigma: number): number {
  return (x - mu) / sigma;
}

function standardize(x: number[]): number[] {
  const m = mean(x);
  const s = sd(x);
  return x.map((xi) => (xi - m) / s);
}

interface Summary {
  Min: number;
  Q1: number;
  Median: number;
  Mean: number;
  Q3: number;
  Max: number;
  SD: number;
  Var: number;
  N: number;
}

function summary(x: number[]): Summary {
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

function min_val(x: number[]): number {
  return x.length > 0 ? Math.min(...x) : NaN;
}

function max_val(x: number[]): number {
  return x.length > 0 ? Math.max(...x) : NaN;
}

function range_stat(x: number[]): number {
  return max_val(x) - min_val(x);
}

function sum_stat(x: number[]): number {
  return x.reduce((a, b) => a + b, 0);
}

export {
  mean,
  median,
  variance,
  sd,
  covariance,
  correlation,
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
