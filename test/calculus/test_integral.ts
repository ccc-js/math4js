/**
 * 積分測試
 */

import { trapezoid, simpson, romberg, gaussLegendre } from '../../src/math4js/calculus/integral.js';

describe('trapezoid', () => {
  test('integrates x^2 from 0 to 1', () => {
    const f = (x: number) => x * x;
    const result = trapezoid(f, 0, 1, 1000);
    expect(result).toBeCloseTo(1 / 3, 3);
  });

  test('integrates sin from 0 to pi', () => {
    const f = (x: number) => Math.sin(x);
    const result = trapezoid(f, 0, Math.PI, 1000);
    expect(result).toBeCloseTo(2, 3);
  });

  test('integrates constant function', () => {
    const result = trapezoid(() => 5, 0, 10, 100);
    expect(result).toBeCloseTo(50, 3);
  });
});

describe('simpson', () => {
  test('integrates x^2 from 0 to 1', () => {
    const f = (x: number) => x * x;
    const result = simpson(f, 0, 1, 100);
    expect(result).toBeCloseTo(1 / 3, 5);
  });

  test('integrates x^3 from 0 to 2', () => {
    const f = (x: number) => x * x * x;
    const result = simpson(f, 0, 2, 100);
    expect(result).toBeCloseTo(4, 5);
  });
});

describe('romberg', () => {
  test('integrates x^2 from 0 to 1', () => {
    const f = (x: number) => x * x;
    const result = romberg(f, 0, 1, 1e-10);
    expect(result).toBeCloseTo(1 / 3, 8);
  });

  test('integrates e^x from 0 to 1', () => {
    const f = (x: number) => Math.exp(x);
    const result = romberg(f, 0, 1, 1e-10);
    expect(result).toBeCloseTo(Math.E - 1, 8);
  });
});

describe('gaussLegendre', () => {
  test('integrates x^2 from -1 to 1', () => {
    const f = (x: number) => x * x;
    const result = gaussLegendre(f, -1, 1, 3);
    expect(result).toBeCloseTo(2 / 3, 5);
  });

  test('integrates sin from 0 to pi', () => {
    const f = (x: number) => Math.sin(x);
    const result = gaussLegendre(f, 0, Math.PI, 5);
    expect(result).toBeCloseTo(2, 5);
  });
});