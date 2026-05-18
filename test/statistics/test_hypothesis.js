/**
 * 假設檢定測試
 */

const {
  z_test,
  t_test,
  t_test_two,
  t_test_paired,
  chisq_test,
  anova,
} = require('../../src/math4js/statistics/hypothesis.js');

const { setSeed } = require('../../src/math4js/statistics/random.js');
const { rnorm } = require('../../src/math4js/statistics/distributions.js');

describe('Z Test', () => {
  test('returns valid result structure', () => {
    const x = [1, 2, 3, 4, 5];
    const result = z_test(x, 3, 1, 0.05);
    expect(result).toHaveProperty('statistic');
    expect(result).toHaveProperty('p_value');
    expect(result).toHaveProperty('reject');
    expect(result).toHaveProperty('ci');
  });

  test('larger sample size increases power', () => {
    const x_small = Array.from({ length: 10 }, () => 5 + Math.random());
    const x_large = Array.from({ length: 100 }, () => 5 + Math.random());
    const result_small = z_test(x_small, 0, 1);
    const result_large = z_test(x_large, 0, 1);
    expect(result_large.reject || result_large.p_value < result_small.p_value).toBe(true);
  });
});

describe('T Test', () => {
  test('one-sample t test returns valid structure', () => {
    const x = [4, 5, 6, 7, 8];
    const result = t_test(x, 5, 0.05);
    expect(result).toHaveProperty('statistic');
    expect(result).toHaveProperty('df');
    expect(result).toHaveProperty('p_value');
    expect(result).toHaveProperty('reject');
    expect(result).toHaveProperty('ci');
  });

  test('test against true mean', () => {
    setSeed(123);
    const samples = rnorm(50, 5, 2);
    const result = t_test(samples, 5, 0.05);
    expect(result.df).toBe(49);
  });

  test('paired t test works', () => {
    const before = [10, 12, 11, 13, 14];
    const after = [12, 14, 13, 15, 16];
    const result = t_test_paired(before, after, 0.05);
    expect(result).toHaveProperty('statistic');
    expect(result.statistic).toBeLessThan(0);
  });
});

describe('Two-Sample T Test', () => {
  test('returns valid result structure', () => {
    const x1 = [4, 5, 6, 7, 8];
    const x2 = [3, 4, 5, 6, 7];
    const result = t_test_two(x1, x2, 0.05);
    expect(result).toHaveProperty('statistic');
    expect(result).toHaveProperty('df');
    expect(result).toHaveProperty('mean_diff');
  });

  test('similar samples should not reject', () => {
    const x1 = [1, 2, 3, 4, 5];
    const x2 = [1.1, 2.1, 3.1, 4.1, 5.1];
    const result = t_test_two(x1, x2, 0.05);
    expect(result.reject).toBe(false);
  });
});

describe('Chi-square Test', () => {
  test('goodness of fit test', () => {
    const observed = [10, 20, 30];
    const expected = [15, 20, 25];
    const result = chisq_test(observed, expected, 0.05);
    expect(result).toHaveProperty('statistic');
    expect(result).toHaveProperty('df');
    expect(result).toHaveProperty('p_value');
  });

  test('reject when observed differs greatly from expected', () => {
    const observed = [100, 10, 10];
    const expected = [30, 30, 30];
    const result = chisq_test(observed, expected, 0.05);
    expect(result.statistic).toBeGreaterThan(10);
  });
});

describe('ANOVA', () => {
  test('one-way ANOVA returns valid structure', () => {
    const groups = [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 6],
      [3, 4, 5, 6, 7],
    ];
    const result = anova(groups, 0.05);
    expect(result).toHaveProperty('statistic');
    expect(result).toHaveProperty('df_between');
    expect(result).toHaveProperty('df_within');
    expect(result).toHaveProperty('p_value');
    expect(result.df_between).toBe(2);
    expect(result.df_within).toBe(12);
  });

  test('similar groups should not reject', () => {
    const groups = [
      [4, 5, 6, 5, 5],
      [4.1, 5.1, 6.1, 5.1, 5.1],
      [4.2, 5.2, 6.2, 5.2, 5.2],
    ];
    const result = anova(groups, 0.05);
    expect(result.reject).toBe(false);
  });

  test('different groups should reject', () => {
    const groups = [
      [1, 2, 3, 2, 2],
      [10, 11, 12, 11, 11],
      [20, 21, 22, 21, 21],
    ];
    const result = anova(groups, 0.05);
    expect(result.statistic).toBeGreaterThan(50);
  });
});
