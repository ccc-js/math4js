/**
 * Matrix 類別，包裝 numeric.js 提供一致 API
 */

const numeric = require('numeric');

class Matrix {
  constructor(data) {
    if (data instanceof Matrix) {
      this._data = data._data.map((row) => [...row]);
    } else if (Array.isArray(data)) {
      if (data.length === 0) {
        this._data = [];
      } else if (typeof data[0] === 'number') {
        this._data = data.map((v) => [v]);
      } else {
        this._data = data.map((row) => [...row]);
      }
    } else {
      throw new Error('Matrix: invalid data');
    }
  }

  get shape() {
    return [this._data.length, this._data[0].length];
  }

  get T() {
    return new Matrix(numeric.transpose(this._data));
  }

  add(other) {
    if (other instanceof Matrix) {
      return new Matrix(numeric.add(this._data, other._data));
    }
    return new Matrix(numeric.add(this._data, other));
  }

  sub(other) {
    if (other instanceof Matrix) {
      return new Matrix(numeric.sub(this._data, other._data));
    }
    return new Matrix(numeric.sub(this._data, other));
  }

  mul(other) {
    if (other instanceof Matrix) {
      return new Matrix(numeric.mul(this._data, other._data));
    }
    return new Matrix(numeric.mul(this._data, other));
  }

  matmul(other) {
    return this.dot(other);
  }

  dot(other) {
    if (other instanceof Matrix) {
      return new Matrix(numeric.dot(this._data, other._data));
    }
    return new Matrix(numeric.dot(this._data, other));
  }

  inv() {
    return new Matrix(numeric.inv(this._data));
  }

  det() {
    return numeric.det(this._data);
  }

  eigvals() {
    const e = numeric.eig(this._data);
    return e.lambda.x;
  }

  eig() {
    const e = numeric.eig(this._data);
    return {
      values: e.lambda.x,
      vectors: new Matrix(e.E.x),
    };
  }

  svd() {
    const s = numeric.svd(this._data);
    return {
      U: new Matrix(s.U),
      S: s.S,
      V: new Matrix(s.V),
    };
  }

  qr() {
    const A = this._data;
    const m = A.length;
    const n = A[0].length;
    const Q = numeric.identity(m);
    const R = A.map((row) => [...row]);
    for (let j = 0; j < Math.min(n, m - 1); j++) {
      let norm = 0;
      for (let i = j; i < m; i++) {
        norm += R[i][j] * R[i][j];
      }
      norm = Math.sqrt(norm);
      if (norm < 1e-10) continue;
      const sign = R[j][j] >= 0 ? 1 : -1;
      const u = [];
      for (let i = j; i < m; i++) {
        u.push(R[i][j] + sign * (i === j ? norm : 0));
      }
      const uNorm = Math.sqrt(u.reduce((s, v) => s + v * v, 0));
      if (uNorm < 1e-10) continue;
      const uNormArr = u.map((v) => v / uNorm);
      for (let k = 0; k < m; k++) {
        let dot = 0;
        for (let i = j; i < m; i++) {
          dot += uNormArr[i - j] * R[i][k];
        }
        for (let i = j; i < m; i++) {
          R[i][k] -= 2 * dot * uNormArr[i - j];
        }
        let dotQ = 0;
        for (let i = j; i < m; i++) {
          dotQ += uNormArr[i - j] * Q[i][k];
        }
        for (let i = j; i < m; i++) {
          Q[i][k] -= 2 * dotQ * uNormArr[i - j];
        }
      }
    }
    return { Q: new Matrix(Q), R: new Matrix(R) };
  }

  lu() {
    const A = this._data;
    const n = A.length;
    const L = numeric.identity(n);
    const U = A.map((row) => [...row]);
    const P = numeric.identity(n);
    for (let j = 0; j < n - 1; j++) {
      let maxRow = j;
      for (let i = j + 1; i < n; i++) {
        if (Math.abs(U[i][j]) > Math.abs(U[maxRow][j])) maxRow = i;
      }
      if (Math.abs(U[maxRow][j]) < 1e-10) continue;
      [U[j], U[maxRow]] = [U[maxRow], U[j]];
      [P[j], P[maxRow]] = [P[maxRow], P[j]];
      [L[j], L[maxRow]] = [L[maxRow], L[j]];
      for (let i = j + 1; i < n; i++) {
        L[i][j] = U[i][j] / U[j][j];
        for (let k = j; k < n; k++) {
          U[i][k] -= L[i][j] * U[j][k];
        }
      }
    }
    return { L: new Matrix(L), U: new Matrix(U), P: new Matrix(P) };
  }

  solve(b) {
    let bData = b;
    if (b instanceof Matrix) {
      bData = b._data;
    } else if (Array.isArray(b) && b.length > 0) {
      if (typeof b[0] === 'number') {
        bData = b.map((v) => [v]);
      }
    }
    const x = numeric.solve(this._data, bData);
    return new Matrix(x);
  }

  rank() {
    const m = this._data.length;
    const n = this._data[0].length;
    const B = this._data.map((row) => [...row]);
    let rank = 0;
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
        for (let k = i; k < n; k++) B[j][k] -= factor * B[i][k];
      }
      rank++;
    }
    return rank;
  }

  norm(ord = 2) {
    if (ord === 2 || ord === 'fro') {
      const s = numeric.svd(this._data);
      return s.S[0];
    }
    if (ord === 1 || ord === Infinity) {
      return numeric.norminf(this._data);
    }
    return numeric.norminf(this._data);
  }

  toArray() {
    return this._data.map((row) => [...row]);
  }

  static eye(n) {
    return new Matrix(numeric.identity(n));
  }

  static zeros(shape) {
    return new Matrix(numeric.rep(shape, 0));
  }

  static ones(shape) {
    return new Matrix(numeric.rep(shape, 1));
  }

  static random(shape, low = -1, high = 1) {
    const [rows, cols] = shape;
    const data = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(low + Math.random() * (high - low));
      }
      data.push(row);
    }
    return new Matrix(data);
  }

  static diag(values) {
    const n = values.length;
    const data = numeric.rep([n, n], 0);
    for (let i = 0; i < n; i++) {
      data[i][i] = values[i];
    }
    return new Matrix(data);
  }

  static fromArray(arr) {
    return new Matrix(arr);
  }

  toString() {
    return numeric.prettyPrint(this._data);
  }

  [Symbol.iterator]() {
    return this._data[Symbol.iterator]();
  }
}

module.exports = { Matrix };
