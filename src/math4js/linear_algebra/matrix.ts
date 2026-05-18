/**
 * Matrix 類別，包裝 numeric.js 提供一致 API
 */

import numeric from 'numeric';

interface EigResult {
  values: number[];
  vectors: Matrix;
}

interface SVDResult {
  U: Matrix;
  S: number[];
  V: Matrix;
}

interface QRResult {
  Q: Matrix;
  R: Matrix;
}

interface LUResult {
  L: Matrix;
  U: Matrix;
  P: Matrix;
}

class Matrix {
  private _data: number[][];

  constructor(data: Matrix | number[][] | number[]) {
    if (data instanceof Matrix) {
      this._data = data._data.map((row: number[]) => [...row]);
    } else if (Array.isArray(data)) {
      if (data.length === 0) {
        this._data = [];
      } else if (typeof data[0] === 'number') {
        this._data = (data as number[]).map((v: number) => [v]);
      } else {
        this._data = (data as number[][]).map((row: number[]) => [...row]);
      }
    } else {
      throw new Error('Matrix: invalid data');
    }
  }

  get shape(): [number, number] {
    return [this._data.length, this._data[0].length];
  }

  get T(): Matrix {
    return new Matrix(numeric.transpose(this._data));
  }

  add(other: Matrix | number | number[][]): Matrix {
    if (other instanceof Matrix) {
      return new Matrix(numeric.add(this._data, other._data));
    }
    return new Matrix(numeric.add(this._data, other));
  }

  sub(other: Matrix | number | number[][]): Matrix {
    if (other instanceof Matrix) {
      return new Matrix(numeric.sub(this._data, other._data));
    }
    return new Matrix(numeric.sub(this._data, other));
  }

  mul(other: Matrix | number | number[][]): Matrix {
    if (other instanceof Matrix) {
      return new Matrix(numeric.mul(this._data, other._data));
    }
    return new Matrix(numeric.mul(this._data, other));
  }

  matmul(other: Matrix | number[][]): Matrix {
    return this.dot(other);
  }

  dot(other: Matrix | number[][]): Matrix {
    if (other instanceof Matrix) {
      return new Matrix(numeric.dot(this._data, other._data));
    }
    return new Matrix(numeric.dot(this._data, other));
  }

  inv(): Matrix {
    return new Matrix(numeric.inv(this._data));
  }

  det(): number {
    return numeric.det(this._data);
  }

  eigvals(): number[] {
    const e = numeric.eig(this._data);
    return e.lambda.x;
  }

  eig(): EigResult {
    const e = numeric.eig(this._data);
    return {
      values: e.lambda.x,
      vectors: new Matrix(e.E.x),
    };
  }

  svd(): SVDResult {
    const s = numeric.svd(this._data);
    return {
      U: new Matrix(s.U),
      S: s.S,
      V: new Matrix(s.V),
    };
  }

  qr(): QRResult {
    const A = this._data;
    const m = A.length;
    const n = A[0].length;
    const Q = numeric.identity(m);
    const R = A.map((row: number[]) => [...row]);

    for (let j = 0; j < Math.min(n, m - 1); j++) {
      let norm = 0;
      for (let i = j; i < m; i++) {
        norm += R[i][j] * R[i][j];
      }
      norm = Math.sqrt(norm);
      if (norm < 1e-10) continue;

      const sign = R[j][j] >= 0 ? 1 : -1;
      const u: number[] = [];
      for (let i = j; i < m; i++) {
        u.push(R[i][j] + sign * (i === j ? norm : 0));
      }
      const uNorm = Math.sqrt(u.reduce((s, v) => s + v * v, 0));
      if (uNorm < 1e-10) continue;

      const uNormArr = u.map((v) => v / uNorm);

      for (let k = 0; k < n; k++) {
        let dot = 0;
        for (let i = j; i < m; i++) {
          dot += uNormArr[i - j] * R[i][k];
        }
        for (let i = j; i < m; i++) {
          R[i][k] -= 2 * dot * uNormArr[i - j];
        }
      }

      for (let k = 0; k < m; k++) {
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

  lu(): LUResult {
    const A = this._data;
    const n = A.length;
    const L = numeric.identity(n);
    const U = A.map((row: number[]) => [...row]);
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

  solve(b: Matrix | number[] | number[][]): Matrix {
    let bData: number[][];
    if (b instanceof Matrix) {
      bData = b._data;
    } else if (Array.isArray(b) && b.length > 0) {
      if (typeof b[0] === 'number') {
        bData = (b as number[]).map((v: number) => [v]);
      } else {
        bData = b as number[][];
      }
    } else {
      throw new Error('solve: invalid b');
    }
    const x = numeric.solve(this._data, bData);
    return new Matrix(x);
  }

  rank(): number {
    const m = this._data.length;
    const n = this._data[0].length;
    const B = this._data.map((row: number[]) => [...row]);
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

  norm(ord: number | string = 2): number {
    if (ord === 2 || ord === 'fro') {
      const s = numeric.svd(this._data);
      return s.S[0];
    }
    return numeric.norminf(this._data);
  }

  toArray(): number[][] {
    return this._data.map((row: number[]) => [...row]);
  }

  static eye(n: number): Matrix {
    return new Matrix(numeric.identity(n));
  }

  static zeros(shape: [number, number]): Matrix {
    return new Matrix(numeric.rep(shape, 0));
  }

  static ones(shape: [number, number]): Matrix {
    return new Matrix(numeric.rep(shape, 1));
  }

  static random(shape: [number, number], low: number = -1, high: number = 1): Matrix {
    const [rows, cols] = shape;
    const data: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(low + Math.random() * (high - low));
      }
      data.push(row);
    }
    return new Matrix(data);
  }

  static diag(values: number[]): Matrix {
    const n = values.length;
    const data = numeric.rep([n, n], 0);
    for (let i = 0; i < n; i++) {
      data[i][i] = values[i];
    }
    return new Matrix(data);
  }

  static fromArray(arr: number[][]): Matrix {
    return new Matrix(arr);
  }

  toString(): string {
    return numeric.prettyPrint(this._data);
  }

  [Symbol.iterator](): Iterator<number[]> {
    return this._data[Symbol.iterator]();
  }
}

export { Matrix, type EigResult, type SVDResult, type QRResult, type LUResult };
