/**
 * 數列與級數
 *
 * 數列收斂、極限計算
 */

export function sequence(
  f: (n: number) => number,
  n0: number = 1,
  n: number
): number[] {
  const result: number[] = [];
  for (let i = n0; i <= n; i++) {
    result.push(f(i));
  }
  return result;
}

export function series(
  f: (n: number) => number,
  a: number,
  b: number
): number {
  let sum = 0;
  for (let i = a; i <= b; i++) {
    sum += f(i);
  }
  return sum;
}

export function converge(
  f: (x: number) => number,
  x0: number,
  tol: number = 1e-10,
  maxIter: number = 100
): { root: number; iterations: number; converged: boolean } {
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const x1 = f(x);
    if (Math.abs(x1 - x) < tol) {
      return { root: x1, iterations: i + 1, converged: true };
    }
    x = x1;
  }
  return { root: x, iterations: maxIter, converged: false };
}

export function limit(
  f: (x: number) => number,
  a: number,
  direction: 'left' | 'right' | 'both' = 'both',
  tol: number = 1e-10
): number | null {
  const h = 1e-10;

  if (direction === 'left' || direction === 'both') {
    const left = f(a - h);
    if (direction === 'left') return left;
    const right = f(a + h);
    if (Math.abs(left - right) < tol) return (left + right) / 2;
  }

  if (direction === 'right') {
    return f(a + h);
  }

  return null;
}

export function infiniteSeries(
  f: (n: number) => number,
  tol: number = 1e-10,
  maxTerms: number = 10000
): { sum: number; terms: number; converged: boolean } {
  let sum = 0;
  for (let n = 0; n < maxTerms; n++) {
    const term = f(n);
    sum += term;
    if (Math.abs(term) < tol) {
      return { sum, terms: n + 1, converged: true };
    }
  }
  return { sum, terms: maxTerms, converged: false };
}

export function alternatingSeries(
  f: (n: number) => number,
  tol: number = 1e-10,
  maxTerms: number = 10000
): { sum: number; terms: number; converged: boolean } {
  let sum = 0;
  let prevSum = sum + 1;
  for (let n = 0; n < maxTerms; n++) {
    const term = f(n) * (n % 2 === 0 ? 1 : -1);
    sum += term;
    if (Math.abs(sum - prevSum) < tol) {
      return { sum, terms: n + 1, converged: true };
    }
    prevSum = sum;
  }
  return { sum, terms: maxTerms, converged: false };
}