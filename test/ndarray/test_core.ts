/**
 * ndarray 核心測試
 */

import { zeros, ones, full, eye, diag, arange, linspace, array } from '../../src/math4js/ndarray';

describe('ndarray Creation', () => {
  test('zeros', () => {
    const a = zeros([2, 3]);
    expect(a.shape).toEqual([2, 3]);
    expect(a.size).toBe(6);
    expect(a.ndim).toBe(2);
    expect(a.get(0, 0)).toBe(0);
  });

  test('ones', () => {
    const a = ones([2, 2]);
    expect(a.get(0, 0)).toBe(1);
    expect(a.get(1, 1)).toBe(1);
  });

  test('full', () => {
    const a = full([2, 3], 5);
    expect(a.get(0, 0)).toBe(5);
    expect(a.get(1, 2)).toBe(5);
  });

  test('eye', () => {
    const a = eye(3);
    expect(a.get(0, 0)).toBe(1);
    expect(a.get(1, 1)).toBe(1);
    expect(a.get(0, 1)).toBe(0);
  });

  test('diag', () => {
    const a = diag([1, 2, 3]);
    expect(a.get(0, 0)).toBe(1);
    expect(a.get(1, 1)).toBe(2);
    expect(a.get(2, 2)).toBe(3);
  });

  test('arange', () => {
    const a = arange(5);
    expect(a.size).toBe(5);
    expect(a.get(0)).toBe(0);
    expect(a.get(4)).toBe(4);
  });

  test('linspace', () => {
    const a = linspace(0, 1, 5);
    expect(a.size).toBe(5);
    expect(a.get(0)).toBeCloseTo(0, 5);
    expect(a.get(4)).toBeCloseTo(1, 5);
  });

  test('array from 2D', () => {
    const a = array([[1, 2], [3, 4]]);
    expect(a.shape).toEqual([2, 2]);
    expect(a.get(1, 1)).toBe(4);
  });
});

describe('ndarray Indexing', () => {
  test('get/set', () => {
    const a = zeros([3, 3]);
    a.set(1, 1, 5);
    expect(a.get(1, 1)).toBe(5);
  });

  test('negative index', () => {
    const a = array([[1, 2], [3, 4]]);
    expect(a.get(-1, -1)).toBe(4);
  });
});

describe('ndarray Reshape', () => {
  test('reshape', () => {
    const a = arange(6).reshape([2, 3]);
    expect(a.shape).toEqual([2, 3]);
    expect(a.get(1, 2)).toBe(5);
  });

  test('flatten', () => {
    const a = array([[1, 2], [3, 4]]);
    const f = a.flatten();
    expect(f.size).toBe(4);
    expect(f.get(0)).toBe(1);
  });
});

describe('ndarray Transpose', () => {
  test('T', () => {
    const a = array([[1, 2], [3, 4]]);
    const t = a.T;
    expect(t.shape).toEqual([2, 2]);
    expect(t.get(0, 1)).toBe(3);
  });
});

describe('ndarray Copy/View', () => {
  test('copy', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = a.copy();
    b.set(0, 0, 99);
    expect(a.get(0, 0)).toBe(1);
  });

  test('view shares data', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = a.view();
    b.set(0, 0, 99);
    expect(a.get(0, 0)).toBe(99);
  });
});

describe('ndarray toString', () => {
  test('toArray', () => {
    const a = array([[1, 2], [3, 4]]);
    const arr = a.toArray();
    expect(arr).toEqual([[1, 2], [3, 4]]);
  });
});