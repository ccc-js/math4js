/**
 * Test linear algebra matrix module.
 */

import { Matrix } from '../../src/math4js/linear_algebra/matrix.js';

describe('Matrix Creation', () => {
  test('from list', () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    expect(m.shape).toEqual([2, 2]);
  });

  test('eye identity matrix', () => {
    const m = Matrix.eye(3);
    expect(m.shape).toEqual([3, 3]);
    expect(m.toArray()[0][0]).toBe(1);
    expect(m.toArray()[1][1]).toBe(1);
  });

  test('zeros', () => {
    const m = Matrix.zeros([2, 3]);
    expect(m.shape).toEqual([2, 3]);
    expect(m.toArray()[0][0]).toBe(0);
  });
});

describe('Matrix Operations', () => {
  test('add', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const B = new Matrix([
      [10, 20],
      [30, 40],
    ]);
    const C = A.add(B);
    expect(C.toArray()[0][0]).toBe(11);
  });

  test('sub', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const B = new Matrix([
      [1, 1],
      [1, 1],
    ]);
    const C = A.sub(B);
    expect(C.toArray()[0][0]).toBe(0);
  });

  test('mul (element-wise)', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const B = new Matrix([
      [2, 2],
      [2, 2],
    ]);
    const C = A.mul(B);
    expect(C.toArray()[0][0]).toBe(2);
    expect(C.toArray()[1][1]).toBe(8);
  });

  test('dot (matrix multiply)', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const B = new Matrix([
      [5, 6],
      [7, 8],
    ]);
    const C = A.dot(B);
    expect(C.toArray()[0][0]).toBeCloseTo(19, 5);
  });

  test('transpose', () => {
    const A = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    expect(A.T.shape).toEqual([3, 2]);
    expect(A.T.toArray()[0][0]).toBe(1);
    expect(A.T.toArray()[0][1]).toBe(4);
  });

  test('det', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    expect(A.det()).toBeCloseTo(-2, 5);
  });

  test('inv', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const A_inv = A.inv();
    const I = A.dot(A_inv);
    expect(I.toArray()[0][0]).toBeCloseTo(1, 1);
  });

  test('solve', () => {
    const A = new Matrix([
      [1, 1],
      [1, -1],
    ]);
    const b = new Matrix([[5], [1]]);
    const x = A.solve(b);
    expect(x.toArray()[0][0]).toBeCloseTo(3, 5);
    expect(x.toArray()[1][0]).toBeCloseTo(2, 5);
  });
});

describe('Matrix Decomposition', () => {
  test('qr', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const { Q, R } = A.qr();
    expect(Q.shape).toEqual([2, 2]);
    expect(R.shape).toEqual([2, 2]);
  });

  test('svd', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const { U, S, V } = A.svd();
    expect(U.shape).toEqual([2, 2]);
    expect(S.length).toBe(2);
    expect(V.shape).toEqual([2, 2]);
  });

  test('lu', () => {
    const A = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const { L, U, P } = A.lu();
    expect(L.shape).toEqual([2, 2]);
    expect(U.shape).toEqual([2, 2]);
    expect(P.shape).toEqual([2, 2]);
  });

  test('eigvals', () => {
    const A = new Matrix([
      [2, 0],
      [0, 3],
    ]);
    const vals = A.eigvals();
    expect(vals.length).toBe(2);
  });

  test('eig', () => {
    const A = new Matrix([
      [2, 0],
      [0, 3],
    ]);
    const { values } = A.eig();
    expect(values.length).toBe(2);
  });

  test('rank', () => {
    const A = new Matrix([
      [1, 0],
      [0, 1],
    ]);
    expect(A.rank()).toBe(2);
  });
});
