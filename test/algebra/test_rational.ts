/**
 * 有理數測試
 */

import { Rational, parseRational } from '../../src/math4js/algebra/rational.js';

describe('Rational', () => {
  test('creates fraction and auto-simplifies', () => {
    const r = new Rational(2, 4);
    expect(r.num).toBe(1);
    expect(r.den).toBe(2);
  });

  test('handles negative values', () => {
    const r = new Rational(-3, -6);
    expect(r.num).toBe(1);
    expect(r.den).toBe(2);
  });

  test('handles zero numerator', () => {
    const r = new Rational(0, 5);
    expect(r.num).toBe(0);
    expect(r.den).toBe(1);
  });

  test('throws on zero denominator', () => {
    expect(() => new Rational(1, 0)).toThrow('Denominator cannot be zero');
  });

  test('adds fractions correctly', () => {
    const r1 = new Rational(1, 2);
    const r2 = new Rational(1, 3);
    const result = r1.add(r2);
    expect(result.num).toBe(5);
    expect(result.den).toBe(6);
  });

  test('subtracts fractions correctly', () => {
    const r1 = new Rational(1, 2);
    const r2 = new Rational(1, 3);
    const result = r1.sub(r2);
    expect(result.num).toBe(1);
    expect(result.den).toBe(6);
  });

  test('multiplies fractions correctly', () => {
    const r1 = new Rational(2, 3);
    const r2 = new Rational(3, 4);
    const result = r1.mul(r2);
    expect(result.num).toBe(1);
    expect(result.den).toBe(2);
  });

  test('divides fractions correctly', () => {
    const r1 = new Rational(1, 2);
    const r2 = new Rational(2, 1);
    const result = r1.div(r2);
    expect(result.num).toBe(1);
    expect(result.den).toBe(4);
  });

  test('toNumber returns float', () => {
    const r = new Rational(1, 2);
    expect(r.toNumber()).toBe(0.5);
  });

  test('equals checks equality', () => {
    const r1 = new Rational(1, 2);
    const r2 = new Rational(2, 4);
    expect(r1.equals(r2)).toBe(true);
  });

  test('toString formats correctly', () => {
    expect(new Rational(1, 2).toString()).toBe('1/2');
    expect(new Rational(3, 1).toString()).toBe('3');
  });
});

describe('parseRational', () => {
  test('parses integer string', () => {
    const r = parseRational('5');
    expect(r.num).toBe(5);
    expect(r.den).toBe(1);
  });

  test('parses fraction string', () => {
    const r = parseRational('3/4');
    expect(r.num).toBe(3);
    expect(r.den).toBe(4);
  });
});