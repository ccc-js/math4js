/**
 * 多項式測試
 */

import { Polynomial, horner } from '../../src/math4js/algebra/polynomial.js';

describe('Polynomial', () => {
  test('creates polynomial from coefficients', () => {
    const p = new Polynomial([1, -5, 6]);
    expect(p.coeffs()).toEqual([1, -5, 6]);
  });

  test('computes degree', () => {
    const p = new Polynomial([1, -5, 6]);
    expect(p.degree()).toBe(2);
    expect(new Polynomial([5]).degree()).toBe(0);
  });

  test('evaluates polynomial', () => {
    // ascending: coeffs [a0, a1, a2] = a0 + a1*x + a2*x^2
    // x^2 - 5x + 6 = 6 + (-5)*x + 1*x^2 -> coeffs [6, -5, 1]
    const p = new Polynomial([6, -5, 1]);
    expect(p.eval(1)).toBe(2);
    expect(p.eval(2)).toBe(0);
    expect(p.eval(3)).toBe(0);
  });

  test('adds polynomials', () => {
    const p1 = new Polynomial([1, 2]);
    const p2 = new Polynomial([1, -2, 1]);
    const result = p1.add(p2);
    expect(result.coeffs()).toEqual([2, 0, 1]);
  });

  test('subtracts polynomials', () => {
    const p1 = new Polynomial([3, 4]);
    const p2 = new Polynomial([1, 2]);
    const result = p1.sub(p2);
    expect(result.coeffs()).toEqual([2, 2]);
  });

  test('multiplies polynomials', () => {
    const p1 = new Polynomial([1, 1]);
    const p2 = new Polynomial([1, 1]);
    const result = p1.mul(p2);
    expect(result.coeffs()).toEqual([1, 2, 1]);
  });

  test('multiplies by scalar', () => {
    const p = new Polynomial([1, 2]);
    const result = p.scalarMul(3);
    expect(result.coeffs()).toEqual([3, 6]);
  });

  test('computes derivative', () => {
    const p = new Polynomial([1, 3, 3, 1]);
    const dp = p.derivative();
    expect(dp.coeffs()).toEqual([3, 6, 3]);
  });

  test('computes integral', () => {
    // ∫(2 + 0*x) dx = 2x + C -> coeffs [0, 2] (trailing zeros trimmed)
    const p = new Polynomial([2, 0]);
    const ip = p.integral(0);
    expect(ip.coeffs()[0]).toBe(0);
    expect(ip.coeffs()[1]).toBe(2);
  });

  test('composes polynomials', () => {
    const p1 = new Polynomial([2, 0, 1]);
    const p2 = new Polynomial([0, 1]);
    const result = p1.compose(p2);
    expect(result.eval(2)).toBe(p1.eval(p2.eval(2)));
  });

  test('divides polynomials', () => {
    const p1 = new Polynomial([1, 0, -1]);
    const p2 = new Polynomial([1, 1]);
    const { quotient, remainder } = p1.divide(p2);
    expect(quotient.coeffs()).toEqual([1, -1]);
    expect(remainder.coeffs()).toEqual([0]);
  });

  test('mod of polynomials', () => {
    const p1 = new Polynomial([1, 0, -1]);
    const p2 = new Polynomial([1, 1]);
    const result = p1.mod(p2);
    expect(result.coeffs()).toEqual([0]);
  });

  test('computes gcd', () => {
    const p1 = new Polynomial([1, -1]);
    const p2 = new Polynomial([1, 1]);
    const result = p1.gcd(p2);
    expect(result.degree()).toBe(0);
  });

  test('trims leading zeros', () => {
    const p = new Polynomial([1, 2, 0, 0]);
    expect(p.degree()).toBe(1);
  });

  test('toString formats correctly', () => {
    const p = new Polynomial([0, 1, 2]);
    expect(p.toString()).toContain('x^2');
  });
});

describe('horner', () => {
  test('evaluates using Horner method', () => {
    const coeffs = [1, -5, 6]; // ascending: 1 - 5x + 6x^2 = 6x^2 - 5x + 1
    expect(horner(coeffs, 2)).toBe(15);
    expect(horner(coeffs, 1)).toBe(2);
  });
});