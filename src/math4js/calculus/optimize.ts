/**
 * 數值優化
 *
 * Golden section, gradient descent, Newton, conjugate gradient
 */

export function goldenSection(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-10,
  maxIter: number = 100
): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  let x1 = b - (b - a) / phi;
  let x2 = a + (b - a) / phi;
  let f1 = f(x1);
  let f2 = f(x2);

  for (let i = 0; i < maxIter; i++) {
    if (b - a < tol) return (a + b) / 2;

    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = b - (b - a) / phi;
      f1 = f(x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = a + (b - a) / phi;
      f2 = f(x2);
    }
  }
  return (a + b) / 2;
}

export function gradientDescent(
  f: (x: number[]) => number,
  df: (x: number[]) => number[],
  x0: number[],
  lr: number = 0.1,
  tol: number = 1e-10,
  maxIter: number = 1000
): { x: number[]; iterations: number; converged: boolean } {
  let x = [...x0];

  for (let i = 0; i < maxIter; i++) {
    const grad = df(x);
    const gradNorm = Math.sqrt(grad.reduce((sum, g) => sum + g * g, 0));

    if (gradNorm < tol) {
      return { x, iterations: i, converged: true };
    }

    x = x.map((xi, j) => xi - lr * grad[j]);
  }

  return { x, iterations: maxIter, converged: false };
}

export function newtonMethod(
  f: (x: number) => number,
  df: (x: number) => number,
  ddf: (x: number) => number,
  x0: number,
  tol: number = 1e-10,
  maxIter: number = 50
): { root: number; iterations: number; converged: boolean } {
  let x = x0;

  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    const dfx = df(x);

    if (Math.abs(dfx) < 1e-14) {
      return { root: x, iterations: i, converged: false };
    }

    const x1 = x - fx / dfx;
    if (Math.abs(x1 - x) < tol) {
      return { root: x1, iterations: i + 1, converged: true };
    }
    x = x1;
  }

  return { root: x, iterations: maxIter, converged: false };
}

export function conjugateGradient(
  A: number[][],
  b: number[],
  x0: number[],
  tol: number = 1e-10,
  maxIter: number = 1000
): { x: number[]; iterations: number; converged: boolean } {
  let x = [...x0];
  let r = b.map((bi, i) => bi - A[i].reduce((sum, aj, j) => sum + aj * x[j], 0));
  let p = [...r];
  let rsold = r.reduce((sum, ri) => sum + ri * ri, 0);

  for (let i = 0; i < maxIter; i++) {
    const Ap = p.map((pj, j) => A[j].reduce((sum, akj, k) => sum + akj * p[k], 0));
    const pAp = p.reduce((sum, pj, j) => sum + pj * Ap[j], 0);

    if (Math.abs(pAp) < 1e-14) {
      return { x, iterations: i, converged: false };
    }

    const alpha = rsold / pAp;
    x = x.map((xj, j) => xj + alpha * p[j]);
    r = r.map((ri, j) => ri - alpha * Ap[j]);

    const rsnew = r.reduce((sum, ri) => sum + ri * ri, 0);
    if (Math.sqrt(rsnew) < tol) {
      return { x, iterations: i + 1, converged: true };
    }

    const beta = rsnew / rsold;
    p = p.map((pj, j) => r[j] + beta * p[j]);
    rsold = rsnew;
  }

  return { x, iterations: maxIter, converged: false };
}

export function momentumGradientDescent(
  f: (x: number[]) => number,
  df: (x: number[]) => number[],
  x0: number[],
  lr: number = 0.1,
  momentum: number = 0.9,
  tol: number = 1e-10,
  maxIter: number = 1000
): { x: number[]; iterations: number; converged: boolean } {
  let x = [...x0];
  let v = x.map(() => 0);

  for (let i = 0; i < maxIter; i++) {
    const grad = df(x);
    const gradNorm = Math.sqrt(grad.reduce((sum, g) => sum + g * g, 0));

    if (gradNorm < tol) {
      return { x, iterations: i, converged: true };
    }

    v = v.map((vi, j) => momentum * vi + lr * grad[j]);
    x = x.map((xi, j) => xi - v[j]);
  }

  return { x, iterations: maxIter, converged: false };
}