/**
 * 數論函數測試
 */

import {
  gcd,
  lcm,
  isPrime,
  primesUpTo,
  primeFactors,
  eulerPhi,
  modPow,
  modInv,
  fibonacci,
  factorial,
  combinations,
  isCoprime,
} from '../../src/math4js/number_theory/function.js';

describe('gcd', () => {
  test('computes gcd of positive numbers', () => {
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(100, 25)).toBe(25);
    expect(gcd(17, 13)).toBe(1);
  });

  test('handles negative numbers', () => {
    expect(gcd(-48, 18)).toBe(6);
    expect(gcd(48, -18)).toBe(6);
  });

  test('handles zero', () => {
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
    expect(gcd(0, 0)).toBe(0);
  });
});

describe('lcm', () => {
  test('computes lcm', () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(5, 7)).toBe(35);
    expect(lcm(12, 18)).toBe(36);
  });
});

describe('isPrime', () => {
  test('identifies primes', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(17)).toBe(true);
    expect(isPrime(97)).toBe(true);
  });

  test('identifies non-primes', () => {
    expect(isPrime(1)).toBe(false);
    expect(isPrime(0)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(15)).toBe(false);
    expect(isPrime(100)).toBe(false);
  });
});

describe('primesUpTo', () => {
  test('generates primes up to n', () => {
    expect(primesUpTo(10)).toEqual([2, 3, 5, 7]);
    expect(primesUpTo(2)).toEqual([2]);
    expect(primesUpTo(1)).toEqual([]);
  });
});

describe('primeFactors', () => {
  test('factors positive numbers', () => {
    expect(primeFactors(12)).toEqual([2, 2, 3]);
    expect(primeFactors(100)).toEqual([2, 2, 5, 5]);
    expect(primeFactors(7)).toEqual([7]);
    expect(primeFactors(1)).toEqual([]);
  });
});

describe('eulerPhi', () => {
  test('computes phi function', () => {
    expect(eulerPhi(1)).toBe(1);
    expect(eulerPhi(2)).toBe(1);
    expect(eulerPhi(3)).toBe(2);
    expect(eulerPhi(12)).toBe(4);
    expect(eulerPhi(10)).toBe(4);
  });
});

describe('modPow', () => {
  test('computes modular exponentiation', () => {
    expect(modPow(2, 10, 1000)).toBe(24);
    expect(modPow(3, 4, 10)).toBe(1);
    expect(modPow(5, 0, 7)).toBe(1);
    expect(modPow(2, 100, 1)).toBe(0);
  });
});

describe('modInv', () => {
  test('computes modular inverse', () => {
    expect(modInv(3, 11)).toBe(4);
    expect(modInv(2, 5)).toBe(3);
    expect(modInv(5, 12)).toBe(5);
  });

  test('throws for non-coprime', () => {
    expect(() => modInv(2, 4)).toThrow();
  });
});

describe('fibonacci', () => {
  test('computes fibonacci numbers', () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(2)).toBe(1);
    expect(fibonacci(10)).toBe(55);
    expect(fibonacci(20)).toBe(6765);
  });
});

describe('factorial', () => {
  test('computes factorial', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(10)).toBe(3628800);
  });
});

describe('combinations', () => {
  test('computes binomial coefficients', () => {
    expect(combinations(5, 2)).toBe(10);
    expect(combinations(10, 3)).toBe(120);
    expect(combinations(6, 0)).toBe(1);
    expect(combinations(6, 6)).toBe(1);
  });
});

describe('isCoprime', () => {
  test('checks coprimality', () => {
    expect(isCoprime(8, 15)).toBe(true);
    expect(isCoprime(12, 18)).toBe(false);
    expect(isCoprime(7, 13)).toBe(true);
    expect(isCoprime(5, 10)).toBe(false);
  });
});