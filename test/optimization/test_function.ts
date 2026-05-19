/**
 * 優化函數測試
 */

import { gradientDescent, newtonMethod, conjugateGradient, adam } from '../../src/math4js/optimization/function.js';

describe('gradientDescent', () => {
  test('finds minimum of x^2 + y^2', () => {
    const f = (x: number[]) => x[0] ** 2 + x[1] ** 2;
    const df = (x: number[]) => [2 * x[0], 2 * x[1]];
    const result = gradientDescent(f, df, [5, 5], 0.1);
    expect(result.x[0]).toBeCloseTo(0, 3);
    expect(result.x[1]).toBeCloseTo(0, 3);
  });

  test('finds minimum of (x-2)^2 + (y-3)^2', () => {
    const f = (x: number[]) => (x[0] - 2) ** 2 + (x[1] - 3) ** 2;
    const df = (x: number[]) => [2 * (x[0] - 2), 2 * (x[1] - 3)];
    const result = gradientDescent(f, df, [0, 0], 0.1);
    expect(result.x[0]).toBeCloseTo(2, 3);
    expect(result.x[1]).toBeCloseTo(3, 3);
  });
});

describe('newtonMethod', () => {
  test('finds root of x^2 - 2', () => {
    const f = (x: number) => x * x - 2;
    const df = (x: number) => 2 * x;
    const ddf = () => 2;
    const result = newtonMethod(f, df, ddf, 1);
    expect(result.root).toBeCloseTo(Math.SQRT2, 5);
  });

  test('finds minimum of x^2', () => {
    const f = (x: number) => x * x;
    const df = (x: number) => 2 * x;
    const ddf = () => 2;
    const result = newtonMethod(f, df, ddf, 5);
    expect(result.root).toBeCloseTo(0, 3);
  });
});

describe('conjugateGradient', () => {
  test('runs without error', () => {
    const A = [[4, 1], [1, 3]];
    const b = [1, 2];
    const result = conjugateGradient(A, b, [0, 0]);
    expect(result).toHaveProperty('x');
    expect(result.converged).toBe(true);
  });
});

describe('adam', () => {
  test('runs without error', () => {
    const f = (x: number[]) => (x[0] - 2) ** 2 + (x[1] - 3) ** 2;
    const df = (x: number[]) => [2 * (x[0] - 2), 2 * (x[1] - 3)];
    const result = adam(f, df, [0, 0]);
    expect(result).toHaveProperty('x');
    expect(result.converged).toBe(false);
  });
});