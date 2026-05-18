/**
 * Test linear algebra vector module.
 */

import {
  norm_vector,
  dot_product,
  cross_product,
} from '../../src/math4js/linear_algebra/vector.js';

describe('Norm Vector', () => {
  test('2D vector', () => {
    const v = [3, 4];
    expect(norm_vector(v)).toBeCloseTo(5, 10);
  });

  test('zero vector', () => {
    const v = [0, 0, 0];
    expect(norm_vector(v)).toBe(0);
  });
});

describe('Dot Product', () => {
  test('orthogonal vectors', () => {
    const v1 = [1, 0];
    const v2 = [0, 1];
    expect(dot_product(v1, v2)).toBe(0);
  });

  test('parallel vectors', () => {
    const v1 = [2, 0];
    const v2 = [3, 0];
    expect(dot_product(v1, v2)).toBe(6);
  });
});

describe('Cross Product', () => {
  test('i x j = k', () => {
    const v1 = [1, 0, 0];
    const v2 = [0, 1, 0];
    const result = cross_product(v1, v2);
    expect(result[0]).toBeCloseTo(0, 10);
    expect(result[1]).toBeCloseTo(0, 10);
    expect(result[2]).toBeCloseTo(1, 10);
  });

  test('j x k = i', () => {
    const v1 = [0, 1, 0];
    const v2 = [0, 0, 1];
    const result = cross_product(v1, v2);
    expect(result[0]).toBeCloseTo(1, 10);
  });
});
