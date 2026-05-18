/**
 * 分布函數測試
 */

const {
  dnorm, pnorm, qnorm, rnorm,
  dt, pt, qt, rt,
  dchisq, pchisq, qchisq, rchisq,
  df, pf, rf,
  dbinom, pbinom, rbinom,
  dpois, ppois, rpois,
} = require('../../src/math4js/statistics/distributions.js');

const { setSeed } = require('../../src/math4js/statistics/random.js');

describe('Normal Distribution', () => {
  test('dnorm(0, 0, 1) is around 0.4', () => {
    const v = dnorm(0, 0, 1);
    expect(v).toBeGreaterThan(0.3);
    expect(v).toBeLessThan(0.5);
  });

  test('pnorm(0, 0, 1) is around 0.5', () => {
    const v = pnorm(0, 0, 1);
    expect(v).toBeGreaterThan(0.4);
    expect(v).toBeLessThan(0.6);
  });

  test('qnorm(0.5, 0, 1) is around 0', () => {
    const v = qnorm(0.5, 0, 1);
    expect(Math.abs(v)).toBeLessThan(0.1);
  });

  test('rnorm generates correct count', () => {
    setSeed(123);
    const samples = rnorm(100, 0, 1);
    expect(samples).toHaveLength(100);
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(Math.abs(mean)).toBeLessThan(0.5);
  });

  test('rnorm with seed is deterministic', () => {
    setSeed(123);
    const seq1 = rnorm(10, 0, 1);
    setSeed(123);
    const seq2 = rnorm(10, 0, 1);
    expect(seq1).toEqual(seq2);
  });

  test('rnorm with different seeds produce different results', () => {
    setSeed(1);
    const seq1 = rnorm(10, 0, 1);
    setSeed(2);
    const seq2 = rnorm(10, 0, 1);
    expect(seq1).not.toEqual(seq2);
  });
});

describe('t Distribution', () => {
  test('dt(0, 10) is positive', () => {
    expect(dt(0, 10)).toBeGreaterThan(0);
  });

  test('pt is a valid probability', () => {
    const v = pt(0, 10);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(1);
  });

  test('qt returns a finite value', () => {
    const v = qt(0.5, 10);
    expect(Number.isFinite(v)).toBe(true);
  });

  test('rt generates samples', () => {
    setSeed(123);
    const samples = rt(100, 10);
    expect(samples).toHaveLength(100);
  });
});

describe('Chi-square Distribution', () => {
  test('dchisq(1, 1) > 0', () => {
    expect(dchisq(1, 1)).toBeGreaterThan(0);
  });

  test('pchisq(1, 1) > 0.5', () => {
    expect(pchisq(1, 1)).toBeGreaterThan(0.5);
  });

  test('qchisq(0.5, 1) > 0', () => {
    expect(qchisq(0.5, 1)).toBeGreaterThan(0);
  });

  test('rchisq generates positive samples', () => {
    setSeed(123);
    const samples = rchisq(100, 5);
    expect(samples).toHaveLength(100);
    expect(samples.every(x => x >= 0)).toBe(true);
  });
});

describe('F Distribution', () => {
  test('df(1, 1, 2) > 0', () => {
    expect(df(1, 1, 2)).toBeGreaterThan(0);
  });

  test('pf(1, 1, 2) > 0', () => {
    expect(pf(1, 1, 2)).toBeGreaterThan(0);
  });

  test('rf generates positive samples', () => {
    setSeed(123);
    const samples = rf(100, 5, 10);
    expect(samples).toHaveLength(100);
    expect(samples.every(x => x > 0)).toBe(true);
  });
});

describe('Binomial Distribution', () => {
  test('dbinom(5, 10, 0.5) > 0', () => {
    expect(dbinom(5, 10, 0.5)).toBeGreaterThan(0);
  });

  test('pbinom is a valid probability', () => {
    const v = pbinom(5, 10, 0.5);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(1);
  });

  test('rbinom generates integer samples in range', () => {
    setSeed(123);
    const samples = rbinom(100, 10, 0.5);
    expect(samples).toHaveLength(100);
    expect(samples.every(x => Number.isInteger(x) && x >= 0 && x <= 10)).toBe(true);
  });
});

describe('Poisson Distribution', () => {
  test('dpois(3, 2) > 0', () => {
    expect(dpois(3, 2)).toBeGreaterThan(0);
  });

  test('ppois is a valid probability', () => {
    const v = ppois(3, 2);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(1);
  });

  test('rpois generates non-negative integer samples', () => {
    setSeed(123);
    const samples = rpois(100, 5);
    expect(samples).toHaveLength(100);
    expect(samples.every(x => Number.isInteger(x) && x >= 0)).toBe(true);
  });
});