/**
 * 求根演算法
 *
 * 二分法、牛頓法、割線法、Horner 快速求值
 */

export function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-10,
  maxIter: number = 100
): number {
  if (f(a) * f(b) > 0) throw new Error('Function must have opposite signs at endpoints');
  let lo = a;
  let hi = b;
  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2;
    const fMid = f(mid);
    if (Math.abs(fMid) < tol || (hi - lo) / 2 < tol) {
      return mid;
    }
    if (fMid * f(lo) > 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

export function newton(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  tol: number = 1e-10,
  maxIter: number = 50
): number {
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    const dfx = df(x);
    if (Math.abs(dfx) < 1e-14) throw new Error('Derivative too small');
    const x1 = x - fx / dfx;
    if (Math.abs(x1 - x) < tol) return x1;
    x = x1;
  }
  return x;
}

export function secant(
  f: (x: number) => number,
  x0: number,
  x1: number,
  tol: number = 1e-10,
  maxIter: number = 50
): number {
  let xPrev = x0;
  let xCurr = x1;
  for (let i = 0; i < maxIter; i++) {
    const fxPrev = f(xPrev);
    const fxCurr = f(xCurr);
    if (Math.abs(fxCurr - fxPrev) < 1e-14) throw new Error('Function values too close');
    const xNext = xCurr - fxCurr * (xCurr - xPrev) / (fxCurr - fxPrev);
    if (Math.abs(xNext - xCurr) < tol) return xNext;
    xPrev = xCurr;
    xCurr = xNext;
  }
  return xCurr;
}

export function horner(coeffs: number[], x: number): number {
  // coeffs is descending order: [an, an-1, ..., a1, a0]
  let result = coeffs[0];
  for (let i = 1; i < coeffs.length; i++) {
    result = result * x + coeffs[i];
  }
  return result;
}

export function hornerDerivative(coeffs: number[], x: number): number {
  let result = 0;
  let power = 1;
  for (let i = 1; i < coeffs.length; i++) {
    result += i * coeffs[i] * power;
    power *= x;
  }
  return result;
}

export function findAllRoots(
  f: (x: number) => number,
  coeffs: number[],
  tol: number = 1e-10,
  maxIter: number = 50
): number[] {
  const roots: number[] = [];
  const eps = 1e-6;
  const domain: [number, number][] = [[-100, -eps], [-eps, eps], [eps, 100]];

  for (const [a, b] of domain) {
    try {
      const root = bisection(f, a, b, tol, maxIter);
      if (isFinite(root)) roots.push(root);
    } catch {
      // skip intervals without sign change
    }
  }
  return roots;
}

export function deflation(coeffs: number[], root: number): number[] {
  const n = coeffs.length - 1;
  const reversed = [...coeffs].reverse();
  const result: number[] = [];
  result[0] = reversed[0];
  for (let i = 1; i < n; i++) {
    result[i] = reversed[i] + root * result[i - 1];
  }
  return result;
}