/**
 * 機率分布函數
 *
 * 使用 jStat 庫來實現精確的分布函數
 * 只保留 random.js 的 LCG 作為可 seed 的亂數來源
 */

const jstat = require('jstat');
const { random } = require('./random.js');

const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);

// ============ 常態分布 (Normal) ============

function dnorm(x, mean = 0, sd = 1) {
  return jstat.normal.pdf(x, mean, sd);
}

function pnorm(q, mean = 0, sd = 1, lowerTail = true) {
  const p = jstat.normal.cdf(q, mean, sd);
  return lowerTail ? p : 1 - p;
}

function qnorm(p, mean = 0, sd = 1, lowerTail = true) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.normal.inv(pAdj, mean, sd);
}

function rnorm(n, mean = 0, sd = 1) {
  const result = [];
  for (let i = 0; i < n; i++) {
    let u1, u2;
    do {
      u1 = random();
      u2 = random();
    } while (u1 === 0);
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    result.push(mean + sd * z);
  }
  return result;
}

// ============ t 分布 (Student's t) ============

function dt(x, df) {
  return jstat.studentt.pdf(x, df);
}

function pt(q, df, lowerTail = true) {
  const p = jstat.studentt.cdf(q, df);
  return lowerTail ? p : 1 - p;
}

function qt(p, df, lowerTail = true) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.studentt.inv(pAdj, df);
}

function rt(n, df) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(jstat.studentt.sample(df));
  }
  return result;
}

// ============ 卡方分布 (Chi-square) ============

function dchisq(x, df) {
  return jstat.chisquare.pdf(x, df);
}

function pchisq(q, df, lowerTail = true) {
  const p = jstat.chisquare.cdf(q, df);
  return lowerTail ? p : 1 - p;
}

function qchisq(p, df, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.chisquare.inv(pAdj, df);
}

function rchisq(n, df) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(jstat.chisquare.sample(df));
  }
  return result;
}

// ============ F 分布 ============

function df(x, df1, df2) {
  return jstat.centralF.pdf(x, df1, df2);
}

function pf(q, df1, df2, lowerTail = true) {
  const p = jstat.centralF.cdf(q, df1, df2);
  return lowerTail ? p : 1 - p;
}

function qf(p, df1, df2, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.centralF.inv(pAdj, df1, df2);
}

function rf(n, df1, df2) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(jstat.centralF.sample(df1, df2));
  }
  return result;
}

// ============ 二項分布 (Binomial) ============

function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  if (k === 0 || k === n) return 0;
  return jstat.combination(n, k);
}

function dbinom(k, n, p) {
  return jstat.binomial.pdf(k, n, p);
}

function pbinom(k, n, p, lowerTail = true) {
  const result = jstat.binomial.cdf(k, n, p);
  return lowerTail ? result : 1 - result;
}

function qbinom(p, n, prob, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return n;
  const pAdj = lowerTail ? p : 1 - p;
  for (let k = 0; k <= n; k++) {
    if (jstat.binomial.cdf(k, n, prob) >= pAdj) return k;
  }
  return n;
}

function rbinom(n, size, prob) {
  const result = [];
  for (let i = 0; i < n; i++) {
    let p = prob;
    let q = 1 - prob;
    let s = size + 1;
    let a = 0;
    let x = 0;
    if (p <= 1e-10) return result.push(0);
    if (p >= 1 - 1e-10) return result.push(size);
    if (p < 0.5) {
      a = p;
      p = q;
      q = a;
    }
    const r = p * size;
    while (x < s) {
      a = Math.random();
      s = x;
      a < r ? x++ : x;
    }
    result.push(x);
  }
  return result;
}

// ============ 卜瓦松分布 (Poisson) ============

function dpois(k, lambda) {
  return jstat.poisson.pdf(k, lambda);
}

function ppois(k, lambda, lowerTail = true) {
  const result = jstat.poisson.cdf(k, lambda);
  return lowerTail ? result : 1 - result;
}

function qpois(p, lambda, lowerTail = true) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  let cum = 0;
  let k = 0;
  while (cum < pAdj) {
    cum += dpois(k, lambda);
    if (cum >= pAdj) return k;
    k++;
    if (k > 10000) return k;
  }
  return k;
}

function rpois(n, lambda) {
  const result = [];
  const dist = new jstat.poisson(lambda);
  for (let i = 0; i < n; i++) {
    result.push(dist.sample());
  }
  return result;
}

// ============ 匯出 ============

module.exports = {
  dnorm,
  pnorm,
  qnorm,
  rnorm,
  dt,
  pt,
  qt,
  rt,
  dchisq,
  pchisq,
  qchisq,
  rchisq,
  df,
  pf,
  qf,
  rf,
  dbinom,
  pbinom,
  qbinom,
  rbinom,
  dpois,
  ppois,
  qpois,
  rpois,
};
