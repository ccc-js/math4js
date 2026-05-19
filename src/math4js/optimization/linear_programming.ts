/**
 * 線性規劃
 *
 * 單形法、單形表求解線性規劃問題
 */

interface LPResult {
  x: number[];
  objective: number;
  feasible: boolean;
  bounded: boolean;
}

export function simplexMethod(
  c: number[],
  A: number[][],
  b: number[],
  sense: 'min' | 'max' = 'max'
): LPResult {
  if (sense === 'min') c = c.map(x => -x);

  const m = b.length;
  const n = c.length;
  const tableau: number[][] = [];

  for (let i = 0; i < m; i++) {
    const row = [...A[i], ...b.slice(i, i + 1), 1];
    tableau.push(row);
  }

  const objRow = [...c, 0, 0];
  tableau.push(objRow);

  const basis: number[] = [];
  for (let i = 0; i < m; i++) {
    let pivotCol = -1;
    for (let j = 0; j < n; j++) {
      if (Math.abs(tableau[i][j] - 1) < 1e-10) {
        let isBasic = true;
        for (let k = 0; k < m; k++) {
          if (k !== i && Math.abs(tableau[k][j]) > 1e-10) {
            isBasic = false;
            break;
          }
        }
        if (isBasic) {
          pivotCol = j;
          break;
        }
      }
    }
    if (pivotCol >= 0) basis.push(pivotCol);
    else basis.push(n + i);
  }

  let iterations = 0;
  const maxIterations = 1000;

  while (iterations < maxIterations) {
    let pivotCol = -1;
    for (let j = 0; j < n; j++) {
      if (tableau[m][j] < -1e-10) {
        pivotCol = j;
        break;
      }
    }

    if (pivotCol === -1) {
      const x = new Array(n).fill(0);
      for (let i = 0; i < m; i++) {
        if (basis[i] < n) x[basis[i]] = tableau[i][n + m];
      }
      const objective = sense === 'max' ? -tableau[m][n + m] : tableau[m][n + m];
      return { x, objective, feasible: true, bounded: true };
    }

    let pivotRow = -1;
    let minRatio = Infinity;
    for (let i = 0; i < m; i++) {
      if (tableau[i][pivotCol] > 1e-10) {
        const ratio = tableau[i][n + m] / tableau[i][pivotCol];
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }

    if (pivotRow === -1) {
      return { x: [], objective: -Infinity, feasible: true, bounded: false };
    }

    const pivot = tableau[pivotRow][pivotCol];
    for (let j = 0; j < n + m + 1; j++) {
      tableau[pivotRow][j] /= pivot;
    }

    for (let i = 0; i <= m; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j < n + m + 1; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }

    basis[pivotRow] = pivotCol;
    iterations++;
  }

  return { x: [], objective: 0, feasible: false, bounded: false };
}

export function solveLP(
  c: number[],
  A: number[][],
  b: number[]
): LPResult {
  return simplexMethod(c, A, b);
}

export function isFeasiblePoint(
  x: number[],
  A: number[][],
  b: number[],
  epsilon: number = 1e-10
): boolean {
  for (let i = 0; i < A.length; i++) {
    let sum = 0;
    for (let j = 0; j < x.length; j++) {
      sum += A[i][j] * x[j];
    }
    if (sum > b[i] + epsilon) return false;
  }
  return true;
}

export function dualityGap(
  c: number[],
  A: number[][],
  b: number[],
  x: number[],
  y: number[]
): number {
  const primalObj = c.reduce((sum, ci, i) => sum + ci * x[i], 0);
  const dualObj = b.reduce((sum, bi, i) => sum + bi * y[i], 0);
  return Math.abs(primalObj - dualObj);
}

export function interiorPointMethod(
  c: number[],
  A: number[][],
  b: number[],
  x0: number[],
  alpha: number = 0.1,
  tol: number = 1e-8,
  maxIter: number = 100
): LPResult {
  let x = [...x0];
  for (let iter = 0; iter < maxIter; iter++) {
    const diagX = x.map(xi => Math.max(xi, 1e-10));
    const D = diagX.map(xi => Math.sqrt(xi));

    const rhs = D.map((di, i) => c[i] - (A[i].reduce((s, v, k) => s + v * x[k], 0) - b[i]) / di);

    const gradF = c.map((ci, i) => ci * x[i]);
    const mu = gradF.reduce((s, v) => s + v, 0) / x.length;
    if (mu < tol) {
      return { x, objective: c.reduce((s, ci, i) => s + ci * x[i], 0), feasible: true, bounded: true };
    }

    const d = rhs.map((ri, i) => ri / diagX[i]);
    const step = Math.min(...d.map(di => di < 0 ? -alpha / di : Infinity));
    x = x.map((xi, i) => Math.max(xi + step * d[i], 1e-10));
  }
  return { x, objective: c.reduce((s, ci, i) => s + ci * x[i], 0), feasible: true, bounded: true };
}