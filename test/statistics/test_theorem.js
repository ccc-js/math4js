/**
 * 統計定理測試
 */

const { setSeed } = require('../../src/math4js/statistics/random.js');
const { rnorm } = require('../../src/math4js/statistics/distributions.js');
const {
  central_limit_theorem,
  law_of_large_numbers,
  chebyshev_inequality,
  chebyshev_verify,
  markov_inequality,
  markov_verify,
  bernoulli_verify,
  bayes_theorem,
  information_entropy,
  information_entropy_verify,
} = require('../../src/math4js/statistics/theorem.js');

describe('Central Limit Theorem', () => {
  test('sample means approach normal distribution', () => {
    setSeed(42);
    const result = central_limit_theorem((n) => rnorm(n, 0, 1), 0, 1, 30, 500);
    expect(result.pass).toBe(true);
    expect(result.observed_mean).toBeCloseTo(0, 1);
  });
});

describe('Law of Large Numbers', () => {
  test('sample mean converges to true mean', () => {
    setSeed(42);
    const result = law_of_large_numbers((n) => rnorm(n, 5, 2), 5, 1000);
    expect(result.pass).toBe(true);
    expect(result.sample_mean).toBeCloseTo(5, 1);
  });
});

describe('Chebyshev Inequality', () => {
  test('bound is 1/k^2', () => {
    const result = chebyshev_inequality(1, 2);
    expect(result.pass).toBe(true);
    expect(result.bound).toBe(0.25);
  });

  test('verify with normal samples', () => {
    setSeed(123);
    const samples = rnorm(1000, 0, 1);
    const result = chebyshev_verify(samples, 2);
    expect(result.pass).toBe(true);
    expect(result.observed_prob).toBeLessThanOrEqual(result.bound);
  });
});

describe('Markov Inequality', () => {
  test('markov_inequality with positive samples', () => {
    const samples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = markov_inequality(samples);
    expect(result.pass).toBe(true);
  });

  test('markov_verify with uniform samples', () => {
    setSeed(123);
    const samples = Array.from({ length: 1000 }, () => Math.random() * 10);
    const result = markov_verify(samples);
    expect(result.pass).toBe(true);
  });
});

describe('Bernoulli Trials', () => {
  test('binomial mean and variance', () => {
    setSeed(42);
    const result = bernoulli_verify(10, 0.5, 500);
    expect(result.pass).toBe(true);
    expect(result.observed_mean).toBeCloseTo(5, 0);
    expect(result.observed_var).toBeCloseTo(2.5, 0);
  });
});

describe('Bayes Theorem', () => {
  test('posterior calculation', () => {
    const result = bayes_theorem(0.3, 0.7, 0.5);
    expect(result.pass).toBe(true);
    expect(result.posterior).toBeCloseTo(0.42, 2);
  });
});

describe('Information Entropy', () => {
  test('binary entropy', () => {
    const result = information_entropy([0.5, 0.5], 2);
    expect(result.pass).toBe(true);
    expect(result.entropy).toBeCloseTo(1, 2);
  });

  test('maximum entropy for uniform distribution', () => {
    const result = information_entropy_verify([1, 1, 1, 1], 2);
    expect(result.pass).toBe(true);
    expect(result.entropy).toBeCloseTo(2, 1);
  });

  test('minimum entropy for degenerate distribution', () => {
    const result = information_entropy_verify([1, 0, 0], 2);
    expect(result.pass).toBe(true);
    expect(result.entropy).toBeLessThan(0.1);
  });
});
