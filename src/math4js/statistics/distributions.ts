/**
 * 機率分布函數
 *
 * 使用 jStat 庫來實現精確的分布函數
 */

import jstat from 'jstat';
import { random } from './random.js';

const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);

// ============ 常態分布 (Normal) ============

function dnorm(x: number, mean: number = 0, sd: number = 1): number {
  return jstat.normal.pdf(x, mean, sd);
}

function pnorm(q: number, mean: number = 0, sd: number = 1, lowerTail: boolean = true): number {
  const p = jstat.normal.cdf(q, mean, sd);
  return lowerTail ? p : 1 - p;
}

function qnorm(p: number, mean: number = 0, sd: number = 1, lowerTail: boolean = true): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.normal.inv(pAdj, mean, sd);
}

function rnorm(n: number, mean: number = 0, sd: number = 1): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    let u1: number;
    let u2: number;
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

function dt(x: number, df: number): number {
  return jstat.studentt.pdf(x, df);
}

function pt(q: number, df: number, lowerTail: boolean = true): number {
  const p = jstat.studentt.cdf(q, df);
  return lowerTail ? p : 1 - p;
}

function qt(p: number, df: number, lowerTail: boolean = true): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.studentt.inv(pAdj, df);
}

function rt(n: number, df: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(jstat.studentt.sample(df));
  }
  return result;
}

// ============ 卡方分布 (Chi-square) ============

function dchisq(x: number, df: number): number {
  return jstat.chisquare.pdf(x, df);
}

function pchisq(q: number, df: number, lowerTail: boolean = true): number {
  const p = jstat.chisquare.cdf(q, df);
  return lowerTail ? p : 1 - p;
}

function qchisq(p: number, df: number, lowerTail: boolean = true): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.chisquare.inv(pAdj, df);
}

function rchisq(n: number, df: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(jstat.chisquare.sample(df));
  }
  return result;
}

// ============ F 分布 ============

function df(x: number, df1: number, df2: number): number {
  return jstat.centralF.pdf(x, df1, df2);
}

function pf(q: number, df1: number, df2: number, lowerTail: boolean = true): number {
  const p = jstat.centralF.cdf(q, df1, df2);
  return lowerTail ? p : 1 - p;
}

function qf(p: number, df1: number, df2: number, lowerTail: boolean = true): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  const pAdj = lowerTail ? p : 1 - p;
  return jstat.centralF.inv(pAdj, df1, df2);
}

function rf(n: number, df1: number, df2: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(jstat.centralF.sample(df1, df2));
  }
  return result;
}

// ============ 二項分布 (Binomial) ============

function logChoose(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  if (k === 0 || k === n) return 0;
  return jstat.combination(n, k);
}

function dbinom(k: number, n: number, p: number): number {
  return jstat.binomial.pdf(k, n, p);
}

function pbinom(k: number, n: number, p: number, lowerTail: boolean = true): number {
  const result = jstat.binomial.cdf(k, n, p);
  return lowerTail ? result : 1 - result;
}

function qbinom(p: number, n: number, prob: number, lowerTail: boolean = true): number {
  if (p <= 0) return 0;
  if (p >= 1) return n;
  const pAdj = lowerTail ? p : 1 - p;
  for (let k = 0; k <= n; k++) {
    if (jstat.binomial.cdf(k, n, prob) >= pAdj) return k;
  }
  return n;
}

function rbinom(n: number, size: number, prob: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    let p = prob;
    const q = 1 - prob;
    let s = size + 1;
    let a = 0;
    let x = 0;
    if (p <= 1e-10) {
      result.push(0);
      continue;
    }
    if (p >= 1 - 1e-10) {
      result.push(size);
      continue;
    }
    if (p < 0.5) {
      a = p;
      p = q;
    }
    const r = p * size;
    while (x < s) {
      a = Math.random();
      s = x;
      if (a < r) x++;
    }
    result.push(x);
  }
  return result;
}

// ============ 卜瓦松分布 (Poisson) ============

function dpois(k: number, lambda: number): number {
  return jstat.poisson.pdf(k, lambda);
}

function ppois(k: number, lambda: number, lowerTail: boolean = true): number {
  const result = jstat.poisson.cdf(k, lambda);
  return lowerTail ? result : 1 - result;
}

function qpois(p: number, lambda: number, lowerTail: boolean = true): number {
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

function rpois(n: number, lambda: number): number[] {
  const result: number[] = [];
  const dist = new jstat.poisson(lambda);
  for (let i = 0; i < n; i++) {
    result.push(dist.sample());
  }
  return result;
}

// ============ 匯出 ============

export {
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
