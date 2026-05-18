/**
 * 機率分布函數
 *
 * 實作常用分布的 d* (密度), p* (累積), q* (分位數), r* (亂數產生) 函數
 * 基於 random.js 的 LCG 亂數產生器
 */

const { random } = require('./random.js');

const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);
const LOG_SQRT_TWO_PI = Math.log(Math.sqrt(2 * Math.PI));

// ============ 數學輔助函數 ============

/**
 * 誤差函數近似值 (Abramowitz and Stegun)
 * @param {number} x
 * @returns {number}
 */
function erf(x) {
  const t = 1 / (1 + 0.5 * Math.abs(x));
  const tau = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.20228922 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? 1 - tau : tau - 1;
}

/**
 * 標準常態分布 CDF
 * @param {number} x
 * @returns {number}
 */
function stdNormCdf(x) {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

/**
 * 標準常態分布逆 CDF (使用近似公式)
 * @param {number} p
 * @returns {number}
 */
function stdNormInv(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.074662475957107e0, 3.199107142857141e0,
    1.627936263047097e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q, r;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

/**
 * Gamma 函數 (Lanczos近似)
 * @param {number} z
 * @returns {number}
 */
function gamma(z) {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(Math.abs(t), z + 0.5) * Math.exp(-t) * x;
}

/**
 * 對數 Gamma 函數
 * @param {number} z
 * @returns {number}
 */
function lgamma(z) {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return LOG_SQRT_TWO_PI + (z + 0.5) * Math.log(t) - t + Math.log(Math.abs(x));
}

/**
 * 不完整 Beta 函數 (連分数近似)
 * @param {number} a
 * @param {number} b
 * @param {number} x
 * @returns {number}
 */
function incompleteBeta(a, b, x) {
  if (x === 0) return 0;
  if (x === 1) return 1;

  const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;

  if (x > (a + 1) / (a + b + 2)) {
    return 1 - incompleteBeta(b, a, 1 - x);
  }

  let f = 1, c = 1, d = 0;
  for (let m = 0; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = m === 0 ? 1 : (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    const dnext = 1 + aa * d;
    if (Math.abs(dnext - d) < 1e-12) break;
    const cnext = 1 + aa / c;
    f *= cnext;
    d = dnext;
    c = cnext;
  }
  return front * f;
}

// 常態分布積分下限函數 (預留)

// ============ 常態分布 (Normal) ============

/**
 * 常態分布機率密度
 * @param {number} x
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
function dnorm(x, mean = 0, sd = 1) {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * SQRT_TWO_PI);
}

/**
 * 常態分布累積分布函數
 * @param {number} q
 * @param {number} mean
 * @param {number} sd
 * @param {boolean} lowerTail
 * @returns {number}
 */
function pnorm(q, mean = 0, sd = 1, lowerTail = true) {
  const z = (q - mean) / sd;
  const p = stdNormCdf(z);
  return lowerTail ? p : 1 - p;
}

/**
 * 常態分布分位數函數 (逆 CDF)
 * @param {number} p
 * @param {number} mean
 * @param {number} sd
 * @param {boolean} lowerTail
 * @returns {number}
 */
function qnorm(p, mean = 0, sd = 1, lowerTail = true) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return mean + sd * stdNormInv(pAdj);
}

/**
 * 常態分布亂數產生 (Box-Muller transform)
 * @param {number} n
 * @param {number} mean
 * @param {number} sd
 * @returns {number[]}
 */
function rnorm(n, mean = 0, sd = 1) {
  const result = [];
  let u1, u2;
  for (let i = 0; i < n; i++) {
    u1 = random();
    u2 = random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    result.push(mean + sd * z);
  }
  return result;
}

// ============ t 分布 (Student's t) ============

/**
 * t 分布機率密度
 * @param {number} x
 * @param {number} df
 * @returns {number}
 */
function dt(x, df) {
  return gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2)) *
    Math.pow(1 + x * x / df, -(df + 1) / 2);
}

/**
 * t 分布累積分布函數
 * @param {number} q
 * @param {number} df
 * @param {boolean} lowerTail
 * @returns {number}
 */
function pt(q, df, lowerTail = true) {
  if (q === 0) return 0.5;
  const x = df / (df + q * q);
  const p = incompleteBeta(df / 2, 0.5, x);
  if (q > 0) {
    return lowerTail ? 1 - 0.5 * p : 0.5 * p;
  } else {
    return lowerTail ? 0.5 * p : 1 - 0.5 * p;
  }
}

/**
 * t 分布分位數函數 (數值逼近)
 * @param {number} p
 * @param {number} df
 * @param {boolean} lowerTail
 * @returns {number}
 */
function qt(p, df, lowerTail = true) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;

  // 牛頓法逼近
  let x = stdNormInv(pAdj);
  for (let i = 0; i < 10; i++) {
    const cdf = pt(x, df, true);
    const pdf = dt(x, df);
    if (pdf < 1e-10) break;
    const dx = (cdf - pAdj) / pdf;
    x -= dx;
    if (Math.abs(dx) < 1e-8) break;
  }
  return x;
}

/**
 * t 分布亂數產生
 * @param {number} n
 * @param {number} df
 * @returns {number[]}
 */
function rt(n, df) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const z = rnorm(1, 0, 1)[0];
    const x = rchisq(1, df)[0];
    result.push(z / Math.sqrt(x / df));
  }
  return result;
}

// ============ 卡方分布 (Chi-square) ============

/**
 * 卡方分布機率密度
 * @param {number} x
 * @param {number} df
 * @returns {number}
 */
function dchisq(x, df) {
  if (x <= 0) return 0;
  return Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - lgamma(df / 2));
}

/**
 * 卡方分布累積分布函數 (使用 incomplete gamma)
 * @param {number} q
 * @param {number} df
 * @param {boolean} lowerTail
 * @returns {number}
 */
function pchisq(q, df, lowerTail = true) {
  if (q <= 0) return 0;
  return lowerTail ? gammainc(df / 2, q / 2) : 1 - gammainc(df / 2, q / 2);
}

/**
 * 對數不完整 Gamma 函數 (用於 pchisq/qchisq)
 * @param {number} a
 * @param {number} x
 * @returns {number}
 */
function logGammaInc(a, x) {
  if (x < a + 1) {
    // 級數展開
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 100; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < 1e-10) break;
    }
    return Math.log(sum) + a * Math.log(x) - x - lgamma(a);
  } else {
    // 連分数
    let b = x + 1 - a;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i < 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-10) break;
    }
    return a * Math.log(x) - x - lgamma(a) + Math.log(h);
  }
}

/**
 * 正規化不完整 Gamma 函數 P(a, x) = gamma_inc(a, x) / gamma(a)
 * @param {number} a
 * @param {number} x
 * @returns {number}
 */
function gammainc(a, x) {
  if (x < 0 || a <= 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) {
    // 級數展開
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 200; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term / sum) < 1e-10) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
  } else {
    // 連分数
    return 1 - logGammaInc(a, x);
  }
}

/**
 * 卡方分布分位數函數
 * @param {number} p
 * @param {number} df
 * @param {boolean} lowerTail
 * @returns {number}
 */
function qchisq(p, df, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;

  // 牛頓法
  let x = df * Math.pow(1 - 2 / (9 * df) + stdNormInv(pAdj) * 2 / (9 * df), 3);
  if (x < 0) x = 0.5;
  for (let i = 0; i < 20; i++) {
    const cdf = pchisq(x, df, true);
    const pdf = dchisq(x, df);
    if (pdf < 1e-10) break;
    const dx = (cdf - pAdj) / pdf;
    x -= dx;
    if (x < 0) x = 1e-10;
    if (Math.abs(dx) < 1e-8) break;
  }
  return x;
}

/**
 * 卡方分布亂數產生 (Gamma 分布特例)
 * @param {number} n
 * @param {number} df
 * @returns {number[]}
 */
function rchisq(n, df) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const k = Math.floor(df);
    const f1 = df - k;
    let sum = 0;
    for (let j = 0; j < k; j++) {
      sum += -2 * Math.log(random());
    }
    if (f1 > 0) {
      const u1 = random();
      const u2 = random();
      sum += -2 * Math.log(u1) * f1 * Math.pow(u2, 1 / f1);
    }
    result.push(sum);
  }
  return result;
}

// ============ F 分布 ============

/**
 * F 分布機率密度
 * @param {number} x
 * @param {number} df1
 * @param {number} df2
 * @returns {number}
 */
function df(x, df1, df2) {
  if (x <= 0) return 0;
  const a = df1 * x;
  const b = df1 * x + df2;
  return Math.sqrt(Math.pow(a, df1) * Math.pow(b, -(df1 + df2)) /
    (x * gamma(df1 / 2) * gamma(df2 / 2) / (gamma((df1 + df2) / 2)))) / x;
}

/**
 * 簡化的 F 分布機率密度
 * @param {number} x
 * @param {number} df1
 * @param {number} df2
 * @returns {number}
 */
function df_(x, df1, df2) {
  if (x <= 0) return 0;
  return Math.exp((df1 / 2 - 1) * Math.log(x) + (df1 / 2) * Math.log(df1) + (df2 / 2) * Math.log(df2) -
    ((df1 + df2) / 2) * Math.log(df1 * x + df2) - lgamma(df1 / 2) - lgamma(df2 / 2) + lgamma((df1 + df2) / 2));
}

/**
 * F 分布累積分布函數
 * @param {number} q
 * @param {number} df1
 * @param {number} df2
 * @param {boolean} lowerTail
 * @returns {number}
 */
function pf(q, df1, df2, lowerTail = true) {
  if (q <= 0) return 0;
  const x = df1 * q / (df1 * q + df2);
  const p = incompleteBeta(df1 / 2, df2 / 2, x);
  return lowerTail ? p : 1 - p;
}

/**
 * F 分布分位數函數
 * @param {number} p
 * @param {number} df1
 * @param {number} df2
 * @param {boolean} lowerTail
 * @returns {number}
 */
function qf(p, df1, df2, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;

  // 牛頓法
  let x = df2 / (df1 - 1);
  if (x <= 0) x = 1;
  for (let i = 0; i < 20; i++) {
    const cdf = pf(x, df1, df2, true);
    const pdf = df_(x, df1, df2);
    if (pdf < 1e-10) break;
    const dx = (cdf - pAdj) / pdf;
    x -= dx;
    if (x < 0) x = 1e-10;
    if (Math.abs(dx) < 1e-8) break;
  }
  return x;
}

/**
 * F 分布亂數產生
 * @param {number} n
 * @param {number} df1
 * @param {number} df2
 * @returns {number[]}
 */
function rf(n, df1, df2) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const x1 = rchisq(1, df1)[0];
    const x2 = rchisq(1, df2)[0];
    result.push((x1 / df1) / (x2 / df2));
  }
  return result;
}

// ============ 二項分布 (Binomial) ============

/**
 * log(gamma(z)) 近似
 * @param {number} z
 * @returns {number}
 */
function logGammaStirling(z) {
  if (z <= 0) return Infinity;
  if (z < 1) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGammaStirling(1 - z);
  }
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return LOG_SQRT_TWO_PI + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/**
 * 組合數 log
 * @param {number} n
 * @param {number} k
 * @returns {number}
 */
function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  if (k === 0 || k === n) return 0;
  return logGammaStirling(n + 1) - logGammaStirling(k + 1) - logGammaStirling(n - k + 1);
}

/**
 * 二項分布機率質量函數
 * @param {number} k
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
function dbinom(k, n, p) {
  if (k < 0 || k > n || p < 0 || p > 1) return 0;
  return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}

/**
 * 二項分布累積分布函數
 * @param {number} k
 * @param {number} n
 * @param {number} p
 * @param {boolean} lowerTail
 * @returns {number}
 */
function pbinom(k, n, p, lowerTail = true) {
  let sum = 0;
  const kInt = Math.floor(k);
  if (lowerTail) {
    for (let i = 0; i <= kInt; i++) {
      sum += dbinom(i, n, p);
    }
  } else {
    for (let i = kInt + 1; i <= n; i++) {
      sum += dbinom(i, n, p);
    }
  }
  return sum;
}

/**
 * 二項分布分位數函數
 * @param {number} p
 * @param {number} n
 * @param {number} prob
 * @param {boolean} lowerTail
 * @returns {number}
 */
function qbinom(p, n, prob, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return n;
  const pAdj = lowerTail ? p : 1 - p;
  for (let k = 0; k <= n; k++) {
    let cum = 0;
    for (let i = 0; i <= k; i++) {
      cum += dbinom(i, n, prob);
    }
    if (cum >= pAdj) return k;
  }
  return n;
}

/**
 * 二項分布亂數產生 (反演法)
 * @param {number} n
 * @param {number} size
 * @param {number} prob
 * @returns {number[]}
 */
function rbinom(n, size, prob) {
  const result = [];
  for (let i = 0; i < n; i++) {
    let success = 0;
    for (let j = 0; j < size; j++) {
      if (random() < prob) success++;
    }
    result.push(success);
  }
  return result;
}

// ============ 卜瓦松分布 (Poisson) ============

/**
 * 卜瓦松分布機率質量函數
 * @param {number} k
 * @param {number} lambda
 * @returns {number}
 */
function dpois(k, lambda) {
  if (k < 0 || lambda < 0) return 0;
  return Math.exp(k * Math.log(lambda) - lambda - lgamma(k + 1));
}

/**
 * 卜瓦松分布累積分布函數
 * @param {number} k
 * @param {number} lambda
 * @param {boolean} lowerTail
 * @returns {number}
 */
function ppois(k, lambda, lowerTail = true) {
  let sum = 0;
  const kInt = Math.floor(k);
  if (lowerTail) {
    for (let i = 0; i <= kInt; i++) {
      sum += dpois(i, lambda);
    }
  } else {
    for (let i = kInt + 1; i < Infinity; i++) {
      sum += dpois(i, lambda);
      if (sum > 1 - 1e-10) break;
    }
  }
  return sum;
}

/**
 * 卜瓦松分布分位數函數
 * @param {number} p
 * @param {number} lambda
 * @param {boolean} lowerTail
 * @returns {number}
 */
function qpois(p, lambda, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  let cum = 0;
  let k = 0;
  while (cum < pAdj && k < 10000) {
    cum += dpois(k, lambda);
    if (cum >= pAdj) return k;
    k++;
  }
  return k;
}

/**
 * 卜瓦松分布亂數產生 (反演法)
 * @param {number} n
 * @param {number} lambda
 * @returns {number[]}
 */
function rpois(n, lambda) {
  const result = [];
  for (let i = 0; i < n; i++) {
    let k = 0;
    let sum = 0;
    const expLambda = Math.exp(-lambda);
    while (sum < expLambda) {
      k++;
      sum += random();
    }
    result.push(k - 1);
  }
  return result;
}

// ============ 匯出 ============

module.exports = {
  dnorm, pnorm, qnorm, rnorm,
  dt, pt, qt, rt,
  dchisq, pchisq, qchisq, rchisq,
  df, pf, qf, rf,
  dbinom, pbinom, qbinom, rbinom,
  dpois, ppois, qpois, rpois,
  erf, stdNormCdf, stdNormInv, gamma, lgamma, incompleteBeta, gammainc, logChoose,
};