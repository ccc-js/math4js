/**
 * 區間估計測試
 */

import {
  conf_interval,
  conf_interval_proportion,
  bootstrap_ci,
  conf_interval_variance,
} from '../../src/math4js/statistics/interval.js';

import { mean } from '../../src/math4js/statistics/stats.js';

describe('Confidence Interval', () => {
  test('returns valid structure', () => {
    const x = [4, 5, 6, 7, 8];
    const result = conf_interval(x, 0.05);
    expect(result).toHaveProperty('lower');
    expect(result).toHaveProperty('upper');
    expect(result).toHaveProperty('mean');
    expect(result).toHaveProperty('se');
    expect(result.lower).toBeLessThan(result.upper);
    expect(result.confidence).toBeCloseTo(0.95, 2);
  });

  test('contains the sample mean', () => {
    const x = [4, 5, 6, 7, 8];
    const result = conf_interval(x, 0.05);
    expect(result.mean).toBeGreaterThan(result.lower);
    expect(result.mean).toBeLessThan(result.upper);
  });

  test('larger sample gives narrower interval', () => {
    const x_small = Array.from({ length: 10 }, () => 5 + Math.random());
    const x_large = Array.from({ length: 100 }, () => 5 + Math.random());
    const result_small = conf_interval(x_small, 0.05);
    const result_large = conf_interval(x_large, 0.05);
    const width_small = result_small.upper - result_small.lower;
    const width_large = result_large.upper - result_large.lower;
    expect(width_large).toBeLessThan(width_small);
  });
});

describe('Proportion Confidence Interval', () => {
  test('returns valid structure', () => {
    const result = conf_interval_proportion(50, 100, 0.05);
    expect(result).toHaveProperty('lower');
    expect(result).toHaveProperty('upper');
    expect(result).toHaveProperty('proportion');
    expect(result.proportion).toBe(0.5);
  });

  test('interval contains the proportion', () => {
    const result = conf_interval_proportion(30, 60, 0.05);
    expect(result.proportion).toBeGreaterThan(result.lower);
    expect(result.proportion).toBeLessThan(result.upper);
  });
});

describe('Bootstrap CI', () => {
  test('returns valid structure', () => {
    const x = [1, 2, 3, 4, 5];
    const result = bootstrap_ci(x, mean, 500, 0.05);
    expect(result).toHaveProperty('lower');
    expect(result).toHaveProperty('upper');
    expect(result).toHaveProperty('statistic');
    expect(result.lower).toBeLessThan(result.upper);
  });

  test('contains the original statistic', () => {
    const x = [1, 2, 3, 4, 5];
    const result = bootstrap_ci(x, mean, 500, 0.05);
    expect(result.statistic).toBeGreaterThan(result.lower);
    expect(result.statistic).toBeLessThan(result.upper);
  });
});

describe('Variance Confidence Interval', () => {
  test('returns valid structure', () => {
    const x = [4, 5, 6, 7, 8];
    const result = conf_interval_variance(x, 0.05);
    expect(result).toHaveProperty('lower');
    expect(result).toHaveProperty('upper');
    expect(result).toHaveProperty('variance');
    expect(result.lower).not.toBeNaN();
    expect(result.upper).not.toBeNaN();
  });

  test('bounds are positive', () => {
    const x = [4, 5, 6, 7, 8];
    const result = conf_interval_variance(x, 0.05);
    expect(result.lower).toBeGreaterThan(0);
    expect(result.upper).toBeGreaterThan(0);
  });
});
