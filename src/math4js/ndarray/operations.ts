/**
 * ndarray 運算
 */

import { ndarray } from './core';

function broadcast(a: ndarray, b: ndarray): [ndarray, ndarray] {
  if (a.shape.every((s, i) => s === b.shape[i])) return [a, b];

  const maxDims = Math.max(a.ndim, b.ndim);
  const aShape = [...Array(maxDims - a.ndim).fill(1), ...a.shape];
  const bShape = [...Array(maxDims - b.ndim).fill(1), ...b.shape];

  const outShape: number[] = [];
  for (let i = 0; i < maxDims; i++) {
    outShape.push(Math.max(aShape[i], bShape[i]));
  }

  function expand(arr: ndarray, targetShape: number[]): ndarray {
    const dims = targetShape.length - arr.ndim;
    let result = arr;
    for (let i = 0; i < dims; i++) {
      result = result.expand_dims(0);
    }
    return result;
  }

  return [expand(a, outShape), expand(b, outShape)];
}

function elementwise(a: ndarray, b: ndarray | number, op: (x: number, y: number) => number): ndarray {
  if (typeof b === 'number') {
    const result = a.copy();
    for (let i = 0; i < result.size; i++) {
      result.flat[i] = op(result.flat[i], b);
    }
    return result;
  }

  const [aa, bb] = broadcast(a, b);
  const result = aa.copy();
  for (let i = 0; i < result.size; i++) {
    result.flat[i] = op(aa.flat[i], bb.flat[i]);
  }
  return result;
}

function compare(a: ndarray, b: ndarray | number, op: (x: number, y: number) => boolean): ndarray {
  if (typeof b === 'number') {
    const result = new ndarray(new Float64Array(a.size), a.shape, 'float64');
    for (let i = 0; i < a.size; i++) {
      result.flat[i] = op(a.flat[i], b) ? 1 : 0;
    }
    return result;
  }
  const [aa, bb] = broadcast(a, b);
  const result = new ndarray(new Float64Array(aa.size), aa.shape, 'float64');
  for (let i = 0; i < aa.size; i++) {
    result.flat[i] = op(aa.flat[i], bb.flat[i]) ? 1 : 0;
  }
  return result;
}

export function add(a: ndarray, b: ndarray | number): ndarray {
  return elementwise(a, b, (x, y) => x + y);
}

export function subtract(a: ndarray, b: ndarray | number): ndarray {
  return elementwise(a, b, (x, y) => x - y);
}

export function multiply(a: ndarray, b: ndarray | number): ndarray {
  return elementwise(a, b, (x, y) => x * y);
}

export function divide(a: ndarray, b: ndarray | number): ndarray {
  return elementwise(a, b, (x, y) => x / y);
}

export function power(a: ndarray, b: ndarray | number): ndarray {
  return elementwise(a, b, (x, y) => Math.pow(x, y));
}

export function negative(a: ndarray): ndarray {
  return multiply(a, -1);
}

export function mod(a: ndarray, b: ndarray | number): ndarray {
  return elementwise(a, b, (x, y) => ((x % y) + y) % y);
}

export function matmul(a: ndarray, b: ndarray): ndarray {
  if (a.ndim !== 2 || b.ndim !== 2) throw new Error('matmul requires 2D arrays');
  const [rowsA, colsA] = a.shape;
  const [rowsB, colsB] = b.shape;
  if (colsA !== rowsB) throw new Error(`Shapes ${a.shape} and ${b.shape} not aligned: ${colsA} != ${rowsB}`);
  const result = new ndarray(new Float64Array(rowsA * colsB), [rowsA, colsB], 'float64');
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        const aVal = a.get(i, k);
        const bVal = b.get(k, j);
        sum += (typeof aVal === 'number' ? aVal : aVal.flat[0]) * (typeof bVal === 'number' ? bVal : bVal.flat[0]);
      }
      result.set(i, j, sum);
    }
  }
  return result;
}

export function dot(a: ndarray, b: ndarray): ndarray | number {
  if (a.ndim === 1 && b.ndim === 1) {
    let sum = 0;
    for (let i = 0; i < a.size; i++) sum += a.flat[i] * b.flat[i];
    return sum;
  }
  return matmul(a.reshape([-1, a.shape[a.ndim - 1]]), b.reshape([b.shape[0], -1]));
}

export function gt(a: ndarray, b: ndarray | number): ndarray {
  return compare(a, b, (x, y) => x > y);
}

export function gte(a: ndarray, b: ndarray | number): ndarray {
  return compare(a, b, (x, y) => x >= y);
}

export function lt(a: ndarray, b: ndarray | number): ndarray {
  return compare(a, b, (x, y) => x < y);
}

export function lte(a: ndarray, b: ndarray | number): ndarray {
  return compare(a, b, (x, y) => x <= y);
}

export function eq(a: ndarray, b: ndarray | number): ndarray {
  return compare(a, b, (x, y) => x === y);
}

export function ne(a: ndarray, b: ndarray | number): ndarray {
  return compare(a, b, (x, y) => x !== y);
}

export function where(condition: ndarray, x: ndarray, y: ndarray): ndarray {
  const result = x.copy();
  for (let i = 0; i < condition.size; i++) {
    result.flat[i] = condition.flat[i] ? x.flat[i] : y.flat[i];
  }
  return result;
}

export function abs(a: ndarray): ndarray {
  return elementwise(a, 0, (x) => Math.abs(x));
}

export function sqrt(a: ndarray): ndarray {
  return elementwise(a, 0, (x) => Math.sqrt(x));
}

export function exp(a: ndarray): ndarray {
  return elementwise(a, 0, (x) => Math.exp(x));
}

export function log(a: ndarray): ndarray {
  return elementwise(a, 0, (x) => Math.log(x));
}

export function sin(a: ndarray): ndarray {
  return elementwise(a, 0, (x) => Math.sin(x));
}

export function cos(a: ndarray): ndarray {
  return elementwise(a, 0, (x) => Math.cos(x));
}

export function sum(a: ndarray, axis?: number): ndarray | number {
  if (axis === undefined) {
    return a.flat.reduce((s, v) => s + v, 0);
  }
  if (axis < 0 || axis >= a.ndim) throw new Error(`Axis ${axis} out of bounds`);
  const shape = [...a.shape];
  shape.splice(axis, 1);
  const result = new ndarray(new Float64Array(shape.reduce((x, y) => x * y, 1)), shape, 'float64');
  const stride = a.shape.slice(axis + 1).reduce((x, y) => x * y, 1);
  const blocks = a.shape.slice(0, axis).reduce((x, y) => x * y, 1);
  for (let block = 0; block < blocks; block++) {
    for (let k = 0; k < stride; k++) {
      let s = 0;
      for (let i = 0; i < a.shape[axis]; i++) {
        s += a.flat[block * a.shape[axis] * stride + i * stride + k];
      }
      result.flat[block * stride + k] = s;
    }
  }
  return result;
}

export function mean(a: ndarray, axis?: number): ndarray | number {
  const s = sum(a, axis);
  if (typeof s === 'number') return s / a.size;
  const dim = axis !== undefined ? a.shape[axis] : a.size;
  return divide(s as ndarray, dim);
}

export function std(a: ndarray, axis?: number): ndarray | number {
  const m = mean(a, axis);
  if (typeof m === 'number') {
    const v = a.flat.reduce((s, x) => s + (x - m) ** 2, 0) / a.size;
    return Math.sqrt(v);
  }
  const diff = subtract(a, m);
  const v = mean(multiply(diff, diff), axis);
  return sqrt(v as ndarray);
}

export function var_(a: ndarray, axis?: number): ndarray | number {
  const st = std(a, axis);
  if (typeof st === 'number') return st ** 2;
  return multiply(st, st);
}

export function min(a: ndarray, axis?: number): ndarray | number {
  if (axis === undefined) {
    let m = Infinity;
    for (const v of a.flat) if (v < m) m = v;
    return m;
  }
  const shape = [...a.shape];
  shape.splice(axis, 1);
  const result = new ndarray(new Float64Array(shape.reduce((x, y) => x * y, 1)), shape, 'float64');
  const stride = a.shape.slice(axis + 1).reduce((x, y) => x * y, 1);
  const blocks = a.shape.slice(0, axis).reduce((x, y) => x * y, 1);
  for (let block = 0; block < blocks; block++) {
    for (let k = 0; k < stride; k++) {
      let m = Infinity;
      for (let i = 0; i < a.shape[axis]; i++) {
        const v = a.flat[block * a.shape[axis] * stride + i * stride + k];
        if (v < m) m = v;
      }
      result.flat[block * stride + k] = m;
    }
  }
  return result;
}

export function max(a: ndarray, axis?: number): ndarray | number {
  if (axis === undefined) {
    let m = -Infinity;
    for (const v of a.flat) if (v > m) m = v;
    return m;
  }
  const shape = [...a.shape];
  shape.splice(axis, 1);
  const result = new ndarray(new Float64Array(shape.reduce((x, y) => x * y, 1)), shape, 'float64');
  const stride = a.shape.slice(axis + 1).reduce((x, y) => x * y, 1);
  const blocks = a.shape.slice(0, axis).reduce((x, y) => x * y, 1);
  for (let block = 0; block < blocks; block++) {
    for (let k = 0; k < stride; k++) {
      let m = -Infinity;
      for (let i = 0; i < a.shape[axis]; i++) {
        const v = a.flat[block * a.shape[axis] * stride + i * stride + k];
        if (v > m) m = v;
      }
      result.flat[block * stride + k] = m;
    }
  }
  return result;
}

export function prod(a: ndarray, axis?: number): ndarray | number {
  if (axis === undefined) {
    return a.flat.reduce((s, v) => s * v, 1);
  }
  const shape = [...a.shape];
  shape.splice(axis, 1);
  const result = new ndarray(new Float64Array(shape.reduce((x, y) => x * y, 1)), shape, 'float64');
  const stride = a.shape.slice(axis + 1).reduce((x, y) => x * y, 1);
  const blocks = a.shape.slice(0, axis).reduce((x, y) => x * y, 1);
  for (let block = 0; block < blocks; block++) {
    for (let k = 0; k < stride; k++) {
      let p = 1;
      for (let i = 0; i < a.shape[axis]; i++) {
        p *= a.flat[block * a.shape[axis] * stride + i * stride + k];
      }
      result.flat[block * stride + k] = p;
    }
  }
  return result;
}

export function argmax(a: ndarray): number {
  let idx = 0;
  let m = a.flat[0];
  for (let i = 1; i < a.size; i++) {
    if (a.flat[i] > m) {
      m = a.flat[i];
      idx = i;
    }
  }
  return idx;
}

export function argmin(a: ndarray): number {
  let idx = 0;
  let m = a.flat[0];
  for (let i = 1; i < a.size; i++) {
    if (a.flat[i] < m) {
      m = a.flat[i];
      idx = i;
    }
  }
  return idx;
}

export function all(a: ndarray): boolean {
  for (const v of a.flat) if (!v) return false;
  return true;
}

export function any(a: ndarray): boolean {
  for (const v of a.flat) if (v) return true;
  return false;
}