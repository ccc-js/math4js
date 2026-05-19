/**
 * 優化測試
 */

import { goldenSection, gradientDescent, newtonMethod } from '../../src/math4js/calculus/optimize.js';

describe('goldenSection', () => {
  test('finds minimum of x^2', () => {
    const f = (x: number) => x * x;
    const result = goldenSection(f, -10, 10);
    expect(result).toBeCloseTo(0, 5);
  });

  test('finds minimum of (x-3)^2', () => {
    const f = (x: number) => (x - 3) * (x - 3);
    const result = goldenSection(f, 0, 10);
    expect(result).toBeCloseTo(3, 3);
  });

  test('finds minimum of x^2 + 2x + 1', () => {
    const f = (x: number) => x * x + 2 * x + 1;
    const result = goldenSection(f, -10, 10);
    expect(result).toBeCloseTo(-1, 3);
  });
});

describe('gradientDescent', () => {
  test('finds minimum of x^2 + y^2', () => {
    const f = (x: number[]) => x[0] * x[0] + x[1] * x[1];
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

  test('finds root of x^3 - 1', () => {
    const f = (x: number) => x * x * x - 1;
    const df = (x: number) => 3 * x * x;
    const ddf = (x: number) => 6 * x;
    const result = newtonMethod(f, df, ddf, 2);
    expect(result.root).toBeCloseTo(1, 5);
  });
});