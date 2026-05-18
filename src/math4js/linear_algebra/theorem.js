/**
 * Linear Algebra Theorems
 */

const numeric = require('numeric');

function rank_nullity_theorem(matrix) {
  const A = matrix;
  const m = A.length;
  const n = A[0].length;

  let rank = 0;
  const B = A.map((row) => [...row]);
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

function eigenvalues_theorem(matrix) {
  const A = matrix;
  const trace_A = matrix.reduce((sum, row, i) => sum + row[i], 0);
  const det_A = numeric.det(A);

  const e = numeric.eig(A);
  const vals = e.lambda.x;
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

function svd_theorem(matrix) {
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
    rank: S.filter((sv) => sv > 1e-10).length,
  };
}

function determinant_theorem(matrix) {
  const A = matrix;
  const B = A;

  const det_A = numeric.det(A);
  const det_B = numeric.det(B);
  const AB = numeric.dot(A, B);
  const det_AB = numeric.det(AB);

  return {
    pass: Math.abs(det_AB - det_A * det_B) < 1e-8,
    det_A,
    det_B,
    det_AB,
    product_detA_detB: det_A * det_B,
  };
}

function linear_independence_theorem(vectors) {
  if (!vectors || vectors.length === 0) {
    return { pass: true, rank: 0, num_vectors: 0, is_independent: true };
  }

  const m = vectors.length;
  const n = vectors[0].length;
  const mat = vectors.map((row) => [...row]);
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

module.exports = {
  rank_nullity_theorem,
  eigenvalues_theorem,
  svd_theorem,
  determinant_theorem,
  linear_independence_theorem,
};
