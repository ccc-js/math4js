/**
 * 資訊理論測試
 */

import {
  entropy,
  cross_entropy,
  kl_divergence,
  mutual_information,
  conditional_entropy,
  pmi,
} from '../../src/math4js/statistics/info.js';

describe('Entropy', () => {
  test('entropy of uniform distribution', () => {
    const p = [0.25, 0.25, 0.25, 0.25];
    const h = entropy(p, 2);
    expect(h).toBeCloseTo(2, 1);
  });

  test('entropy of binary distribution', () => {
    const p = [0.5, 0.5];
    const h = entropy(p, 2);
    expect(h).toBeCloseTo(1, 2);
  });

  test('entropy of degenerate distribution is 0', () => {
    const p = [1, 0, 0];
    const h = entropy(p, 2);
    expect(h).toBeLessThan(0.01);
  });

  test('handles unnormalized input', () => {
    const p = [1, 2, 3];
    const h1 = entropy(p, 2);
    const h2 = entropy(
      p.map((x) => x * 2),
      2
    );
    expect(Math.abs(h1 - h2)).toBeLessThan(0.001);
  });
});

describe('Cross Entropy', () => {
  test('cross entropy of identical distributions', () => {
    const p = [0.5, 0.5];
    const h = cross_entropy(p, p, 2);
    expect(h).toBeCloseTo(entropy(p, 2), 1);
  });

  test('cross entropy >= entropy', () => {
    const p = [0.5, 0.5];
    const q = [0.7, 0.3];
    const h_ce = cross_entropy(p, q, 2);
    const h_p = entropy(p, 2);
    expect(h_ce).toBeGreaterThan(h_p);
  });
});

describe('KL Divergence', () => {
  test('KL of identical distributions is 0', () => {
    const p = [0.5, 0.5];
    const kl = kl_divergence(p, p, 2);
    expect(kl).toBeLessThan(0.01);
  });

  test('KL divergence is non-negative', () => {
    const p = [0.5, 0.5];
    const q = [0.7, 0.3];
    const kl = kl_divergence(p, q, 2);
    expect(kl).toBeGreaterThan(0);
  });

  test('KL(p||q) >= 0', () => {
    const p = [0.3, 0.7];
    const q = [0.5, 0.5];
    const kl = kl_divergence(p, q, 2);
    expect(kl).toBeGreaterThan(0);
  });
});

describe('Mutual Information', () => {
  test('mutual information of independent variables', () => {
    const x = [0, 0, 1, 1, 0, 0, 1, 1];
    const y = [0, 1, 0, 1, 0, 1, 0, 1];
    const mi = mutual_information(x, y, 2);
    expect(mi).toBeLessThan(0.5);
  });

  test('mutual information is non-negative', () => {
    const x = [1, 2, 3, 1, 2, 3];
    const y = [1, 1, 2, 2, 3, 3];
    const mi = mutual_information(x, y, 2);
    expect(mi).toBeGreaterThan(0);
  });
});

describe('Conditional Entropy', () => {
  test('conditional entropy with perfect correlation', () => {
    const x = [1, 2, 3, 1, 2, 3];
    const y = [1, 2, 3, 1, 2, 3];
    const h_y_given_x = conditional_entropy(x, y, 2);
    expect(h_y_given_x).toBeLessThan(0.1);
  });
});

describe('PMI', () => {
  test('PMI of perfectly correlated pairs', () => {
    const x = [1, 1, 2, 2];
    const y = [1, 1, 2, 2];
    const pmi_val = pmi(x, y, 2);
    expect(pmi_val).toBeGreaterThan(0.5);
  });

  test('PMI of independent pairs is negative', () => {
    const x = [0, 0, 1, 1];
    const y = [0, 1, 0, 1];
    const pmi_val = pmi(x, y, 2);
    expect(pmi_val).toBeLessThan(0.5);
  });
});
