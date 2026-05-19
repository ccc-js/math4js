/**
 * 求根演算法測試
 */

import {
  bisection,
  newton,
  secant,
  horner,
  hornerDerivative,
  deflation,
} from '../../src/math4js/algebra/roots.js';

describe('bisection', () => {
  test('finds sqrt(2)', () => {
    const f = (x: number) => x * x - 2;
    const root = bisection(f, 0, 2);
    expect(root).toBeCloseTo(Math.SQRT2, 10);
  });

  test('finds root of x^3 - x - 2', () => {
    const f = (x: number) => x * x * x - x - 2;
    const root = bisection(f, 1, 2, 1e-10);
    expect(root).toBeCloseTo(1.5213797, 5);
  });

  test('throws when no sign change', () => {
    const f = (x: number) => x * x;
    expect(() => bisection(f, -1, 1)).toThrow();
  });
});

describe('newton', () => {
  test('finds sqrt(2)', () => {
    const f = (x: number) => x * x - 2;
    const df = (x: number) => 2 * x;
    const root = newton(f, df, 1.5);
    expect(root).toBeCloseTo(Math.SQRT2, 10);
  });

  test('finds cube root of 27', () => {
    const f = (x: number) => x * x * x - 27;
    const df = (x: number) => 3 * x * x;
    const root = newton(f, df, 4);
    expect(root).toBeCloseTo(3, 10);
  });
});

describe('secant', () => {
  test('finds sqrt(2)', () => {
    const f = (x: number) => x * x - 2;
    const root = secant(f, 1, 2);
    expect(root).toBeCloseTo(Math.SQRT2, 10);
  });
});

describe('horner', () => {
  test('evaluates polynomial with descending coefficients', () => {
    // descending: [an, ..., a1, a0] = x^2 - 5x + 6
    const coeffs = [1, -5, 6];
    expect(horner(coeffs, 2)).toBe(0);
    expect(horner(coeffs, 3)).toBe(0);
  });
});

describe('hornerDerivative', () => {
  test('evaluates derivative of ascending polynomial', () => {
    // ascending: [a0, a1, a2] = a0 + a1*x + a2*x^2
    const coeffs = [1, -5, 6]; // 1 - 5x + 6x^2
    expect(hornerDerivative(coeffs, 2)).toBe(19);
  });
});

describe('deflation', () => {
  test('deflates polynomial by known root', () => {
    const coeffs = [6, -5, 1]; // ascending: 6 - 5x + x^2 = (x-2)(x-3)
    const newCoeffs = deflation(coeffs, 2);
    // Q(x) = x - 3, so Q(3) = 0
    expect(horner(newCoeffs, 3)).toBe(0);
  });
});