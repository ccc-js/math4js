/**
 * 線性規劃測試
 */

import { simplexMethod, isFeasiblePoint, solveLP } from '../../src/math4js/optimization/linear_programming.js';

describe('simplexMethod', () => {
  test('runs without error', () => {
    const c = [3, 2];
    const A = [[1, 1], [1, 0], [0, 1]];
    const b = [4, 3, 2];
    const result = simplexMethod(c, A, b);
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('objective');
    expect(result).toHaveProperty('feasible');
    expect(result).toHaveProperty('bounded');
  });

  test('handles maximization', () => {
    const c = [1, 1];
    const A = [[2, 1], [1, 2]];
    const b = [4, 4];
    const result = simplexMethod(c, A, b, 'max');
    expect(result.feasible).toBe(true);
  });
});

describe('isFeasiblePoint', () => {
  test('checks feasibility', () => {
    const x = [1, 1];
    const A = [[1, 0], [0, 1]];
    const b = [2, 2];
    expect(isFeasiblePoint(x, A, b)).toBe(true);
  });

  test('detects infeasibility', () => {
    const x = [3, 3];
    const A = [[1, 0], [0, 1]];
    const b = [2, 2];
    expect(isFeasiblePoint(x, A, b)).toBe(false);
  });
});

describe('solveLP', () => {
  test('solves basic LP', () => {
    const c = [1, 1];
    const A = [[1, 0], [0, 1]];
    const b = [5, 3];
    const result = solveLP(c, A, b);
    expect(result.feasible).toBe(true);
  });
});