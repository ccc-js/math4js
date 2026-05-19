/**
 * 單變數積分
 *
 * 數值積分方法
 */

export function trapezoid(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 1000
): number {
  const h = (b - a) / n;
  let sum = 0.5 * (f(a) + f(b));
  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }
  return sum * h;
}

export function simpson(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 100
): number {
  if (n % 2 !== 0) n++;
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(x);
  }
  return (h / 3) * sum;
}

export function romberg(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-10,
  maxIter: number = 10
): number {
  const R: number[][] = [];

  R[0] = [trapezoid(f, a, b, 1)];

  for (let i = 1; i < maxIter; i++) {
    const n = Math.pow(2, i);
    R[i] = [trapezoid(f, a, b, n)];
    for (let j = 1; i >= j; j++) {
      const k = Math.pow(4, j);
      R[i][j] = (k * R[i][j - 1] - R[i - 1][j - 1]) / (k - 1);
    }
    if (i > 0 && Math.abs(R[i][i] - R[i - 1][i - 1]) < tol) {
      return R[i][i];
    }
  }
  return R[maxIter - 1][maxIter - 1];
}

export function adaptive(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-10
): number {
  function recursive(a: number, b: number, fa: number, fb: number, tol: number): number {
    const c = (a + b) / 2;
    const fc = f(c);
    const left = (b - a) / 6 * (fa + 4 * fc + fb);

    const d = (a + c) / 2;
    const fd = f(d);
    const e = (c + b) / 2;
    const fe = f(e);
    const right = (c - a) / 6 * (fa + 4 * fd + fc) + (b - c) / 6 * (fc + 4 * fe + fb);

    if (Math.abs(left - right) < tol || b - a < 1e-14) {
      return right;
    }
    return recursive(a, c, fa, fc, tol / 2) + recursive(c, b, fc, fb, tol / 2);
  }

  return recursive(a, b, f(a), f(b), tol);
}

export function monteCarlo(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 10000
): number {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = a + Math.random() * (b - a);
    sum += f(x);
  }
  return sum * (b - a) / n;
}

export function gaussLegendre(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 5
): number {
  const nodes: number[] = [];
  const weights: number[] = [];

  switch (n) {
    case 1:
      nodes.push(0);
      weights.push(2);
      break;
    case 2:
      nodes.push(-0.577350269189626, 0.577350269189626);
      weights.push(1, 1);
      break;
    case 3:
      nodes.push(0, -0.774596669240483, 0.774596669240483);
      weights.push(0.888888888888889, 0.555555555555556, 0.555555555555556);
      break;
    case 4:
      nodes.push(-0.861136311594043, -0.339981043584856, 0.339981043584856, 0.861136311594043);
      weights.push(0.347854845137454, 0.652145154862546, 0.652145154862546, 0.347854845137454);
      break;
    case 5:
      nodes.push(0, -0.538469310105683, 0.538469310105683, -0.906179845938664, 0.906179845938664);
      weights.push(0.568888888888889, 0.478628670499366, 0.478628670499366, 0.236927758151136, 0.236927758151136);
      break;
  }

  const map = (t: number): number => ((b + a) / 2) + ((b - a) / 2) * t;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += weights[i] * f(map(nodes[i]));
  }
  return sum * (b - a) / 2;
}