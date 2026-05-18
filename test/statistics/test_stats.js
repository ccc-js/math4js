/**
 * 敘述統計測試
 */

const {
  mean,
  median,
  variance,
  sd,
  covariance,
  correlation,
  quantile,
  iqr,
  summary,
  range_stat,
} = require('../../src/math4js/statistics/stats.js');

describe('Descriptive Statistics', () => {
  test('mean of [1, 2, 3, 4, 5] = 3', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });

  test('mean of [2, 4, 6] = 4', () => {
    expect(mean([2, 4, 6])).toBe(4);
  });

  test('median of [1, 2, 3, 4, 5] = 3', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3);
  });

  test('median of [1, 2, 3, 4] = 2.5', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  test('variance of [2, 4, 6] = 4', () => {
    expect(variance([2, 4, 6])).toBe(4);
  });

  test('sd of [2, 4, 6] = 2', () => {
    expect(sd([2, 4, 6])).toBe(2);
  });

  test('variance with ddof=0 (population)', () => {
    expect(variance([2, 4, 6], 0)).toBeCloseTo(8 / 3, 5);
  });

  test('covariance of [1, 2, 3] and [2, 4, 6] > 0', () => {
    expect(covariance([1, 2, 3], [2, 4, 6])).toBeGreaterThan(0);
  });

  test('correlation of [1, 2, 3] and [2, 4, 6] = 1', () => {
    expect(correlation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 5);
  });

  test('correlation of [1, 2, 3] and [6, 3, 0] = -1', () => {
    expect(correlation([1, 2, 3], [6, 3, 0])).toBeCloseTo(-1, 5);
  });

  test('quantile 0.5 of [1, 2, 3, 4, 5] = 3', () => {
    expect(quantile([1, 2, 3, 4, 5], 0.5)).toBe(3);
  });

  test('quantile 0.25 of [1, 2, 3, 4, 5] = 2', () => {
    expect(quantile([1, 2, 3, 4, 5], 0.25)).toBe(2);
  });

  test('iqr of [1, 2, 3, 4, 5] = 2', () => {
    expect(iqr([1, 2, 3, 4, 5])).toBe(2);
  });

  test('summary contains all fields', () => {
    const s = summary([1, 2, 3, 4, 5]);
    expect(s).toHaveProperty('Min');
    expect(s).toHaveProperty('Q1');
    expect(s).toHaveProperty('Median');
    expect(s).toHaveProperty('Mean');
    expect(s).toHaveProperty('Q3');
    expect(s).toHaveProperty('Max');
    expect(s).toHaveProperty('SD');
    expect(s).toHaveProperty('Var');
    expect(s).toHaveProperty('N');
    expect(s.N).toBe(5);
  });

  test('range_stat of [1, 2, 3, 4, 5] = 4', () => {
    expect(range_stat([1, 2, 3, 4, 5])).toBe(4);
  });

  test('mean handles edge cases', () => {
    expect(mean([42])).toBe(42);
  });

  test('quantile interpolation', () => {
    expect(quantile([1, 2, 3, 4], 0.25)).toBe(1.75);
  });
});
