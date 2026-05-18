/**
 * Test linear algebra function module.
 */

import {
  det,
  inverse_2x2,
  matrix_multiply,
  matrix_add,
  matrix_scalar_mul,
  transpose,
  trace,
} from '../../src/math4js/linear_algebra/function.js';

describe('det', () => {
  test('2x2 matrix', () => {
    const m = [
      [1, 2],
      [3, 4],
    ];
    expect(det(m)).toBeCloseTo(-2, 5);
  });
});

describe('inverse_2x2', () => {
  test('inverse exists', () => {
    const m = [
      [4, 7],
      [2, 6],
    ];
    const inv = inverse_2x2(m);
    const result = matrix_multiply(m, inv);
    expect(result[0][0]).toBeCloseTo(1, 5);
    expect(result[0][1]).toBeCloseTo(0, 5);
  });

  test('singular matrix throws', () => {
    const m = [
      [1, 2],
      [2, 4],
    ];
    expect(() => inverse_2x2(m)).toThrow();
  });
});

describe('matrix_multiply', () => {
  test('2x2 multiply', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const B = [
      [5, 6],
      [7, 8],
    ];
    const C = matrix_multiply(A, B);
    expect(C[0][0]).toBeCloseTo(19, 5);
  });
});

describe('matrix_add', () => {
  test('add matrices', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const B = [
      [1, 1],
      [1, 1],
    ];
    const C = matrix_add(A, B);
    expect(C[0][0]).toBe(2);
  });
});

describe('matrix_scalar_mul', () => {
  test('scalar multiply', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const C = matrix_scalar_mul(A, 3);
    expect(C[0][0]).toBe(3);
    expect(C[1][1]).toBe(12);
  });
});

describe('transpose', () => {
  test('2x3 transpose', () => {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const AT = transpose(A);
    expect(AT[0][1]).toBe(4);
    expect(AT[2][0]).toBe(3);
  });
});

describe('trace', () => {
  test('trace of 2x2', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    expect(trace(A)).toBe(5);
  });
});
