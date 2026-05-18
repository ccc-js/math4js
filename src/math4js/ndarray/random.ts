/**
 * ndarray 亂數產生
 */

import { ndarray, array } from './core';

function random(): number {
  return Math.random();
}

function rand(...shape: number[]): ndarray {
  const size = shape.reduce((a, b) => a * b, 1);
  const data: number[] = [];
  for (let i = 0; i < size; i++) data.push(random());
  return array(data).reshape(shape);
}

function randn(...shape: number[]): ndarray {
  const size = shape.reduce((a, b) => a * b, 1);
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    const u1 = random();
    const u2 = random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push(z);
  }
  return array(data).reshape(shape);
}

function randint(low: number, high: number, ...shape: number[]): ndarray {
  const size = shape.reduce((a, b) => a * b, 1);
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    data.push(Math.floor(random() * (high - low) + low));
  }
  return array(data).reshape(shape);
}

function choice(a: ndarray, size?: number, replace: boolean = true): ndarray | number {
  const n = a.size;
  if (size === undefined) return a.flat[Math.floor(random() * n)];
  if (!replace) {
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const data = indices.slice(0, size).map(i => a.flat[i]);
    return array(data).reshape([size]);
  }
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    data.push(a.flat[Math.floor(random() * n)]);
  }
  return array(data).reshape([size]);
}

function shuffle(a: ndarray): ndarray {
  const result = a.copy();
  const flat = result.flat;
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  return result;
}

export { rand, randn, randint, choice, shuffle };