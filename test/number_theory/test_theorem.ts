/**
 * 數論定理測試
 */

import {
  bezoutIdentity,
  fundamentalTheoremOfArithmetic,
  eulerPhiMultiplicative,
  fermatLittleTheorem,
  eulerTheorem,
  chineseRemainderTheorem,
  gcdLcmRelation,
  fibonacciGcdProperty,
} from '../../src/math4js/number_theory/theorem.js';

describe('bezoutIdentity', () => {
  test('finds bezout coefficients', () => {
    const result = bezoutIdentity(48, 18);
    expect(result).not.toBeNull();
    expect(result!.d).toBe(6);
    expect(48 * result!.x + 18 * result!.y).toBe(6);
  });

  test('handles coprime numbers', () => {
    const result = bezoutIdentity(17, 13);
    expect(result).not.toBeNull();
    expect(result!.d).toBe(1);
  });
});

describe('fundamentalTheoremOfArithmetic', () => {
  test('verifies unique prime factorization', () => {
    expect(fundamentalTheoremOfArithmetic(12)).toBe(true);
    expect(fundamentalTheoremOfArithmetic(100)).toBe(true);
    expect(fundamentalTheoremOfArithmetic(7)).toBe(true);
    expect(fundamentalTheoremOfArithmetic(1)).toBe(false);
  });
});

describe('eulerPhiMultiplicative', () => {
  test('verifies multiplicative property', () => {
    expect(eulerPhiMultiplicative(3, 4)).toBe(true);
    expect(eulerPhiMultiplicative(5, 7)).toBe(true);
    expect(eulerPhiMultiplicative(4, 6)).toBe(false);
  });
});

describe('fermatLittleTheorem', () => {
  test('verifies fermat theorem', () => {
    expect(fermatLittleTheorem(7, 3)).toBe(true);
    expect(fermatLittleTheorem(11, 5)).toBe(true);
    expect(fermatLittleTheorem(4, 2)).toBe(false);
  });
});

describe('eulerTheorem', () => {
  test('verifies euler theorem', () => {
    expect(eulerTheorem(10, 3)).toBe(true);
    expect(eulerTheorem(12, 5)).toBe(true);
  });
});

describe('chineseRemainderTheorem', () => {
  test('solves simultaneous congruences', () => {
    const result = chineseRemainderTheorem([3, 4, 5], [2, 3, 1]);
    expect(result).toBe(11);
  });

  test('returns null for non-coprime moduli', () => {
    const result = chineseRemainderTheorem([2, 4], [1, 3]);
    expect(result).toBeNull();
  });
});

describe('gcdLcmRelation', () => {
  test('verifies gcd*lcm = |ab|', () => {
    expect(gcdLcmRelation(4, 6)).toBe(true);
    expect(gcdLcmRelation(12, 18)).toBe(true);
    expect(gcdLcmRelation(7, 13)).toBe(true);
  });
});

describe('fibonacciGcdProperty', () => {
  test('verifies gcd(F(m), F(n)) = F(gcd(m,n))', () => {
    expect(fibonacciGcdProperty(6, 9)).toBe(true);
    expect(fibonacciGcdProperty(8, 12)).toBe(true);
    expect(fibonacciGcdProperty(5, 10)).toBe(true);
  });
});