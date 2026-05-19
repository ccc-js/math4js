/**
 * 數論定理驗證
 *
 * 貝祖等式、算術基本定理、費馬小定理、歐拉定理、中國剩餘定理
 */

import { gcd, lcm, isPrime, eulerPhi, modPow, modInv } from './function.js';

export function bezoutIdentity(a: number, b: number): { x: number; y: number; d: number } | null {
  if (a === 0 && b === 0) return null;
  let oldR = a, r = b;
  let oldS = 1, s = 0;
  let oldT = 0, t = 1;

  while (r !== 0) {
    const q = Math.floor(oldR / r);
    const tempR = oldR - q * r;
    oldR = r;
    r = tempR;

    const tempS = oldS - q * s;
    oldS = s;
    s = tempS;

    const tempT = oldT - q * t;
    oldT = t;
    t = tempT;
  }

  return { x: oldS, y: oldT, d: oldR };
}

export function fundamentalTheoremOfArithmetic(n: number): boolean {
  if (n < 2) return false;
  const factors: number[] = [];
  let temp = n;
  let d = 2;
  while (d * d <= temp) {
    while (temp % d === 0) {
      factors.push(d);
      temp /= d;
    }
    d++;
  }
  if (temp > 1) factors.push(temp);

  const product = factors.reduce((p, f) => p * f, 1);
  return product === n;
}

export function eulerPhiMultiplicative(m: number, n: number): boolean {
  if (gcd(m, n) !== 1) return false;
  return eulerPhi(m * n) === eulerPhi(m) * eulerPhi(n);
}

export function fermatLittleTheorem(p: number, a: number): boolean {
  if (!isPrime(p)) return false;
  if (gcd(a, p) !== 1) return false;
  const result = modPow(a, p - 1, p);
  return result === 1;
}

export function eulerTheorem(n: number, a: number): boolean {
  if (gcd(a, n) !== 1) return false;
  const result = modPow(a, eulerPhi(n), n);
  return result === 1;
}

export function chineseRemainderTheorem(m: number[], a: number[]): number | null {
  if (m.length !== a.length) return null;
  if (m.length === 0) return 0;

  for (let i = 0; i < m.length; i++) {
    for (let j = i + 1; j < m.length; j++) {
      if (gcd(m[i], m[j]) !== 1) return null;
    }
  }

  let M = 1;
  for (const mi of m) M *= mi;

  let result = 0;
  for (let i = 0; i < m.length; i++) {
    const Mi = M / m[i];
    const Ni = modInv(Mi, m[i]);
    result += a[i] * Mi * Ni;
  }

  return ((result % M) + M) % M;
}

export function gcdLcmRelation(a: number, b: number): boolean {
  const g = gcd(a, b);
  const l = lcm(a, b);
  return g * l === Math.abs(a * b);
}

export function fibonacciGcdProperty(m: number, n: number): boolean {
  if (m < 0 || n < 0) return false;
  const fib = (k: number): number => {
    if (k === 0) return 0;
    if (k === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= k; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  };
  const fibM = fib(m);
  const fibN = fib(n);
  const fibGcd = fib(gcd(m, n));
  return Math.abs(gcd(fibM, fibN)) === fibGcd;
}