/**
 * Test linear algebra theorems module.
 */

const {
  rank_nullity_theorem,
  eigenvalues_theorem,
  svd_theorem,
  determinant_theorem,
  linear_independence_theorem,
} = require('../../src/math4js/linear_algebra/theorem.js');

describe('Rank Nullity Theorem', () => {
  test('full rank square', () => {
    const A = [
      [1, 0],
      [0, 1],
    ];
    const result = rank_nullity_theorem(A);
    expect(result.pass).toBe(true);
    expect(result.rank).toBe(2);
  });

  test('rank deficient', () => {
    const A = [
      [1, 2],
      [2, 4],
    ];
    const result = rank_nullity_theorem(A);
    expect(result.rank).toBe(1);
    expect(result.nullity).toBe(1);
  });
});

describe('Eigenvalues Theorem', () => {
  test('diagonal matrix', () => {
    const A = [
      [2, 0],
      [0, 3],
    ];
    const result = eigenvalues_theorem(A);
    expect(result.pass).toBe(true);
  });

  test('identity matrix', () => {
    const A = [
      [1, 0],
      [0, 1],
    ];
    const result = eigenvalues_theorem(A);
    expect(result.trace).toBeCloseTo(2, 5);
    expect(result.det).toBeCloseTo(1, 5);
  });
});

describe('SVD Theorem', () => {
  test('reconstruction', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const result = svd_theorem(A);
    expect(result.pass).toBe(true);
    expect(result.reconstruction_error).toBeLessThan(1e-8);
  });
});

describe('Determinant Theorem', () => {
  test('det(AB) = det(A)det(B)', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const result = determinant_theorem(A);
    expect(result.pass).toBe(true);
  });
});

describe('Linear Independence Theorem', () => {
  test('independent vectors', () => {
    const vectors = [
      [1, 0],
      [0, 1],
    ];
    const result = linear_independence_theorem(vectors);
    expect(result.is_independent).toBe(true);
  });

  test('dependent vectors', () => {
    const vectors = [
      [1, 2],
      [2, 4],
    ];
    const result = linear_independence_theorem(vectors);
    expect(result.is_independent).toBe(false);
  });
});
