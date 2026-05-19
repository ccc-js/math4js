/**
 * 複數測試
 */

import { Complex } from '../../src/math4js/algebra/complex.js';

describe('Complex', () => {
  test('creates complex number', () => {
    const c = new Complex(3, 4);
    expect(c.re).toBe(3);
    expect(c.im).toBe(4);
  });

  test('creates zero', () => {
    const c = new Complex();
    expect(c.re).toBe(0);
    expect(c.im).toBe(0);
  });

  test('adds complex numbers', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const result = c1.add(c2);
    expect(result.re).toBe(4);
    expect(result.im).toBe(6);
  });

  test('subtracts complex numbers', () => {
    const c1 = new Complex(5, 6);
    const c2 = new Complex(2, 3);
    const result = c1.sub(c2);
    expect(result.re).toBe(3);
    expect(result.im).toBe(3);
  });

  test('multiplies complex numbers', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const result = c1.mul(c2);
    expect(result.re).toBe(-5);
    expect(result.im).toBe(10);
  });

  test('divides complex numbers', () => {
    const c1 = new Complex(1, 1);
    const c2 = new Complex(1, 1);
    const result = c1.div(c2);
    expect(result.re).toBe(1);
    expect(result.im).toBe(0);
  });

  test('computes conjugate', () => {
    const c = new Complex(3, 4);
    const result = c.conj();
    expect(result.re).toBe(3);
    expect(result.im).toBe(-4);
  });

  test('computes abs (modulus)', () => {
    const c = new Complex(3, 4);
    expect(c.abs()).toBe(5);
  });

  test('computes arg (argument/phase)', () => {
    const c = new Complex(1, 1);
    expect(c.arg()).toBeCloseTo(Math.PI / 4);
  });

  test('computes sqrt', () => {
    const c = new Complex(-1, 0);
    const result = c.sqrt();
    expect(result.re).toBeCloseTo(0);
    expect(result.im).toBeCloseTo(1);
  });

  test('computes exp', () => {
    const c = new Complex(0, Math.PI);
    const result = c.exp();
    expect(result.re).toBeCloseTo(-1, 5);
    expect(result.im).toBeCloseTo(0, 5);
  });

  test('computes log', () => {
    const c = new Complex(1, 0);
    const result = c.log();
    expect(result.re).toBeCloseTo(0);
    expect(result.im).toBeCloseTo(0);
  });

  test('computes pow', () => {
    const c = new Complex(1, 0);
    const result = c.pow(3);
    expect(result.re).toBeCloseTo(1);
    expect(result.im).toBeCloseTo(0);
  });

  test('computes sin', () => {
    const c = new Complex(0, 0);
    const result = c.sin();
    expect(result.re).toBeCloseTo(0);
  });

  test('computes cos', () => {
    const c = new Complex(0, 0);
    const result = c.cos();
    expect(result.re).toBeCloseTo(1);
  });

  test('equals checks equality', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(1, 2);
    expect(c1.equals(c2)).toBe(true);
  });

  test('toString formats correctly', () => {
    expect(new Complex(3, 4).toString()).toBe('3 + 4i');
    expect(new Complex(3, -4).toString()).toBe('3 - 4i');
    expect(new Complex(0, 1).toString()).toBe('i');
    expect(new Complex(3, 0).toString()).toBe('3');
  });

  test('fromPolar creates complex', () => {
    const c = Complex.fromPolar(1, Math.PI / 2);
    expect(c.re).toBeCloseTo(0);
    expect(c.im).toBeCloseTo(1);
  });

  test('i returns imaginary unit', () => {
    const c = Complex.i();
    expect(c.re).toBe(0);
    expect(c.im).toBe(1);
  });
});