/**
 * 優化基礎函數
 *
 * 梯度下降、牛頓法、共軛梯度、線搜索、拉格朗日乘數
 */


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
    if (gradNorm < tol) return { x, iterations: i, converged: true };
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
    if (Math.abs(dfx) < 1e-14) return { root: x, iterations: i, converged: false };
    const x1 = x - fx / dfx;
    if (Math.abs(x1 - x) < tol) return { root: x1, iterations: i + 1, converged: true };
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
    if (Math.abs(pAp) < 1e-14) return { x, iterations: i, converged: false };
    const alpha = rsold / pAp;
    x = x.map((xj, j) => xj + alpha * p[j]);
    r = r.map((ri, j) => ri - alpha * Ap[j]);
    const rsnew = r.reduce((sum, ri) => sum + ri * ri, 0);
    if (Math.sqrt(rsnew) < tol) return { x, iterations: i + 1, converged: true };
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
    if (gradNorm < tol) return { x, iterations: i, converged: true };
    v = v.map((vi, j) => momentum * vi + lr * grad[j]);
    x = x.map((xi, j) => xi - v[j]);
  }
  return { x, iterations: maxIter, converged: false };
}

export function adam(
  f: (x: number[]) => number,
  df: (x: number[]) => number[],
  x0: number[],
  alpha: number = 0.001,
  beta1: number = 0.9,
  beta2: number = 0.999,
  epsilon: number = 1e-8,
  maxIter: number = 1000
): { x: number[]; iterations: number; converged: boolean } {
  let x = [...x0];
  let m = x.map(() => 0);
  let v = x.map(() => 0);
  for (let t = 1; t <= maxIter; t++) {
    const grad = df(x);
    const gradNorm = Math.sqrt(grad.reduce((sum, g) => sum + g * g, 0));
    if (gradNorm < 1e-10) return { x, iterations: t, converged: true };
    m = m.map((mi, i) => beta1 * mi + (1 - beta1) * grad[i]);
    v = v.map((vi, i) => beta2 * vi + (1 - beta2) * grad[i] * grad[i]);
    const mHat = m.map(mi => mi / (1 - Math.pow(beta1, t)));
    const vHat = v.map(vi => vi / (1 - Math.pow(beta2, t)));
    x = x.map((xi, i) => xi - alpha * mHat[i] / (Math.sqrt(vHat[i]) + epsilon));
  }
  return { x, iterations: maxIter, converged: false };
}

export function backtrackingLineSearch(
  f: (x: number[]) => number,
  df: (x: number[]) => number[],
  x: number[],
  pk: number[],
  alpha0: number = 1,
  rho: number = 0.5,
  c: number = 1e-4
): number {
  let alpha = alpha0;
  const fx = f(x);
  const gradFx = df(x);
  const slope = gradFx.reduce((sum, g, i) => sum + g * pk[i], 0);
  while (f(x.map((xi, i) => xi + alpha * pk[i])) > fx + c * alpha * slope) {
    alpha *= rho;
    if (alpha < 1e-15) break;
  }
  return alpha;
}

export function isConvexFunction(
  f: (x: number[]) => number,
  _gradF: (x: number[]) => number[],
  samplePoints: number[][],
  epsilon: number = 1e-6
): boolean {
  for (const x of samplePoints) {
    for (const y of samplePoints) {
      let t = 0.1;
      while (t < 1) {
        const mix = x.map((xi, i) => t * xi + (1 - t) * y[i]);
        const left = f(mix);
        const right = t * f(x) + (1 - t) * f(y);
        if (left > right + epsilon) return false;
        t += 0.1;
      }
    }
  }
  return true;
}