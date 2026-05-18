/**
 * ndarray Module
 *
 * NumPy-style multi-dimensional array
 */

export { ndarray, zeros, ones, full, eye, identity, diag, arange, linspace, array, fromFlat, concatenate, vstack, hstack } from './core';
export * from './operations';
export { rand, randn, randint, choice, shuffle } from './random';
export type { Dtype, Slice } from './core';