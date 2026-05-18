/**
 * ndarray 運算測試
 */

import { array } from '../../src/math4js/ndarray';
import { add, subtract, multiply, divide, power, matmul, dot, sum, mean, min, max, prod, argmax, argmin } from '../../src/math4js/ndarray';

describe('Elementwise Operations', () => {
  test('add scalar', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = add(a, 1);
    expect(b.get(0, 0)).toBe(2);
    expect(b.get(1, 1)).toBe(5);
  });

  test('add arrays', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = array([[5, 6], [7, 8]]);
    const c = add(a, b);
    expect(c.get(0, 0)).toBe(6);
    expect(c.get(1, 1)).toBe(12);
  });

  test('subtract', () => {
    const a = array([[5, 6], [7, 8]]);
    const b = array([[1, 2], [3, 4]]);
    const c = subtract(a, b);
    expect(c.get(0, 0)).toBe(4);
    expect(c.get(1, 1)).toBe(4);
  });

  test('multiply', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = multiply(a, 2);
    expect(b.get(0, 0)).toBe(2);
    expect(b.get(1, 1)).toBe(8);
  });

  test('divide', () => {
    const a = array([[2, 4], [6, 8]]);
    const b = divide(a, 2);
    expect(b.get(0, 0)).toBe(1);
    expect(b.get(1, 1)).toBe(4);
  });

  test('power', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = power(a, 2);
    expect(b.get(0, 0)).toBe(1);
    expect(b.get(1, 1)).toBe(16);
  });
});

describe('Matrix Multiplication', () => {
  test('matmul', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = array([[5, 6], [7, 8]]);
    const c = matmul(a, b);
    expect(c.get(0, 0)).toBe(19);
    expect(c.get(0, 1)).toBe(22);
    expect(c.get(1, 0)).toBe(43);
    expect(c.get(1, 1)).toBe(50);
  });

  test('dot 1D', () => {
    const a = array([1, 2, 3]);
    const b = array([4, 5, 6]);
    const c = dot(a, b);
    expect(c).toBe(32);
  });
});

describe('Aggregation', () => {
  test('sum all', () => {
    const a = array([[1, 2], [3, 4]]);
    const s = sum(a);
    expect(s).toBe(10);
  });

  test('mean all', () => {
    const a = array([[1, 2], [3, 4]]);
    const m = mean(a);
    expect(m).toBe(2.5);
  });

  test('min', () => {
    const a = array([[3, 1], [4, 2]]);
    expect(min(a)).toBe(1);
  });

  test('max', () => {
    const a = array([[3, 1], [4, 2]]);
    expect(max(a)).toBe(4);
  });

  test('prod', () => {
    const a = array([[1, 2], [3, 4]]);
    expect(prod(a)).toBe(24);
  });

  test('argmax', () => {
    const a = array([1, 5, 3]);
    expect(argmax(a)).toBe(1);
  });

  test('argmin', () => {
    const a = array([3, 1, 5]);
    expect(argmin(a)).toBe(1);
  });
});

describe('Operators', () => {
  test('+ operator via add', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = add(a, 10);
    expect(b.get(0, 0)).toBe(11);
  });

  test('* operator via multiply', () => {
    const a = array([[1, 2], [3, 4]]);
    const b = multiply(a, 3);
    expect(b.get(1, 0)).toBe(9);
  });
});