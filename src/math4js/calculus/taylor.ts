/**
 * 泰勒展開
 *
 * Taylor and Maclaurin series
 */

export function taylor(
  f: (x: number) => number,
  a: number,
  n: number,
  h: number = 1e-8
): (x: number) => number {
  const derivatives: number[] = [];

  function df(f: (x: number) => number, order: number, x: number): number {
    if (order === 0) return f(x);
    const eps = h;
    if (order === 1) return (f(x + eps) - f(x - eps)) / (2 * eps);
    return (df((x0: number) => df(f, order - 1, x0), 1, x));
  }

  for (let i = 0; i <= n; i++) {
    derivatives.push(df(f, i, a));
  }

  return (x: number): number => {
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const term = derivatives[i] / factorial(i) * Math.pow(x - a, i);
      sum += term;
    }
    return sum;
  };
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function maclaurin(
  f: (x: number) => number,
  n: number,
  h: number = 1e-8
): (x: number) => number {
  return taylor(f, 0, n, h);
}

export function seriesSum(
  f: (n: number) => number,
  a: number,
  n: number
): number {
  let sum = 0;
  for (let i = a; i <= n; i++) {
    sum += f(i);
  }
  return sum;
}

export function powerSeriesCoeffs(
  f: (x: number) => number,
  n: number,
  center: number = 0,
  h: number = 1e-8
): number[] {
  const coeffs: number[] = [];

  function nthDerivative(f: (x: number) => number, order: number, x: number): number {
    if (order === 0) return f(x);
    const eps = h;
    return (nthDerivative(f, order - 1, x + eps) - nthDerivative(f, order - 1, x - eps)) / (2 * eps);
  }

  for (let i = 0; i <= n; i++) {
    const deriv = nthDerivative(f, i, center);
    coeffs.push(deriv / factorial(i));
  }

  return coeffs;
}