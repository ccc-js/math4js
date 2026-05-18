/**
 * 矩陣運算函數
 */

function det(matrix) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function inverse_2x2(matrix) {
  const d = det(matrix);
  if (Math.abs(d) < 1e-10) {
    throw new Error('Singular matrix');
  }
  const a = matrix[0][0];
  const b = matrix[0][1];
  const c = matrix[1][0];
  const dVal = matrix[1][1];
  const invDet = 1 / d;
  return [
    [dVal * invDet, -b * invDet],
    [-c * invDet, a * invDet],
  ];
}

function matrix_multiply(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const result = [];
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

function matrix_add(A, B) {
  const nrows = A.length;
  const ncols = A[0].length;
  const result = [];
  for (let i = 0; i < nrows; i++) {
    const row = [];
    for (let j = 0; j < ncols; j++) {
      row.push(A[i][j] + B[i][j]);
    }
    result.push(row);
  }
  return result;
}

function matrix_scalar_mul(A, scalar) {
  return A.map((row) => row.map((val) => scalar * val));
}

function transpose(A) {
  const nrows = A.length;
  const ncols = A[0].length;
  const result = [];
  for (let j = 0; j < ncols; j++) {
    const row = [];
    for (let i = 0; i < nrows; i++) {
      row.push(A[i][j]);
    }
    result.push(row);
  }
  return result;
}

function trace(A) {
  const n = Math.min(A.length, A[0].length);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += A[i][i];
  }
  return sum;
}

module.exports = {
  det,
  inverse_2x2,
  matrix_multiply,
  matrix_add,
  matrix_scalar_mul,
  transpose,
  trace,
};
