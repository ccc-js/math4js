/**
 * Linear Algebra Theorems
 */

import numeric from 'numeric';

interface RankNullityResult {
  pass: boolean;
  rank: number;
  nullity: number;
  n: number;
  sum: number;
}

function rank_nullity_theorem(matrix: number[][]): RankNullityResult {
  const A = matrix;
  const m = A.length;
  const n = A[0].length;

  let rank = 0;
  const B = A.map((row: number[]) => [...row]);
  for (let i = 0; i < Math.min(m, n); i++) {
    let maxRow = i;
    for (let j = i + 1; j < m; j++) {
      if (Math.abs(B[j][i]) > Math.abs(B[maxRow][i])) maxRow = j;
    }
    if (Math.abs(B[maxRow][i]) < 1e-10) continue;
    [B[i], B[maxRow]] = [B[maxRow], B[i]];
    for (let j = i + 1; j < m; j++) {
      if (Math.abs(B[j][i]) < 1e-10) continue;
      const factor = B[j][i] / B[i][i];
      for (let k = i; k < n; k++) {
        B[j][k] -= factor * B[i][k];
      }
    }
    rank++;
  }

  const nullity = n - rank;

  return {
    pass: rank + nullity === n,
    rank,
    nullity,
    n,
    sum: rank + nullity,
  };
}

interface EigenvaluesResult {
  pass: boolean;
  trace: number;
  sum_eigenvalues: number;
  det: number;
  prod_eigenvalues: number;
  trace_holds: boolean;
  det_holds: boolean;
}

function eigenvalues_theorem(matrix: number[][]): EigenvaluesResult {
  const trace_A = matrix.reduce((sum, row, i) => sum + row[i], 0);
  const det_A = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  const disc = trace_A * trace_A - 4 * det_A;
  const sqrt_disc = disc > 0 ? Math.sqrt(disc) : 0;
  const vals: number[] = [(trace_A + sqrt_disc) / 2, (trace_A - sqrt_disc) / 2];
  const sum_eigenvals = vals.reduce((s, v) => s + v, 0);
  const prod_eigenvals = vals.reduce((p, v) => p * v, 1);

  const trace_holds = Math.abs(trace_A - sum_eigenvals) < 1e-8;
  const det_holds = Math.abs(det_A - prod_eigenvals) < 1e-8;

  return {
    pass: trace_holds && det_holds,
    trace: trace_A,
    sum_eigenvalues: sum_eigenvals,
    det: det_A,
    prod_eigenvalues: prod_eigenvals,
    trace_holds,
    det_holds,
  };
}

interface SVDResult {
  pass: boolean;
  reconstruction_error: number;
  singular_values: number[];
  rank: number;
}

function svd_theorem(matrix: number[][]): SVDResult {
  const A = matrix;
  const m = A.length;
  const n = A[0].length;

  const s = numeric.svd(A);
  const U = s.U;
  const S = s.S;
  const V = s.V;

  const S_matrix = numeric.rep([m, n], 0);
  for (let i = 0; i < Math.min(m, n); i++) {
    S_matrix[i][i] = S[i];
  }

  const A_reconstructed = numeric.dot(U, numeric.dot(S_matrix, numeric.transpose(V)));
  let max_error = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const err = Math.abs(A[i][j] - A_reconstructed[i][j]);
      if (err > max_error) max_error = err;
    }
  }

  return {
    pass: max_error < 1e-8,
    reconstruction_error: max_error,
    singular_values: S,
    rank: S.filter((sv: number) => !isNaN(sv) && sv > 1e-10).length,
  };
}

interface DeterminantResult {
  pass: boolean;
  det_A: number;
  det_B: number;
  det_AB: number;
  product_detA_detB: number;
}

function determinant_theorem(matrix: number[][]): DeterminantResult {
  const A = matrix;
  const B = A;

  const det_A = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  const det_B = det_A;
  const AB = numeric.dot(A, B);
  const det_AB = AB[0][0] * AB[1][1] - AB[0][1] * AB[1][0];

  return {
    pass: Math.abs(det_AB - det_A * det_B) < 1e-8,
    det_A,
    det_B,
    det_AB,
    product_detA_detB: det_A * det_B,
  };
}

interface LinearIndependenceResult {
  pass: boolean;
  rank: number;
  num_vectors: number;
  is_independent: boolean;
}

function linear_independence_theorem(vectors: number[][]): LinearIndependenceResult {
  if (!vectors || vectors.length === 0) {
    return { pass: true, rank: 0, num_vectors: 0, is_independent: true };
  }

  const m = vectors.length;
  const n = vectors[0].length;
  const mat = vectors.map((row: number[]) => [...row]);
  let rank = 0;

  for (let i = 0; i < Math.min(m, n); i++) {
    let maxRow = i;
    for (let j = i + 1; j < m; j++) {
      if (Math.abs(mat[j][i]) > Math.abs(mat[maxRow][i])) maxRow = j;
    }
    if (Math.abs(mat[maxRow][i]) < 1e-10) continue;
    [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
    for (let j = i + 1; j < m; j++) {
      if (Math.abs(mat[j][i]) < 1e-10) continue;
      const factor = mat[j][i] / mat[i][i];
      for (let k = i; k < n; k++) {
        mat[j][k] -= factor * mat[i][k];
      }
    }
    rank++;
  }

  const num_vectors = vectors.length;

  return {
    pass: true,
    rank,
    num_vectors,
    is_independent: rank === num_vectors,
  };
}

export {
  rank_nullity_theorem,
  eigenvalues_theorem,
  svd_theorem,
  determinant_theorem,
  linear_independence_theorem,
};
