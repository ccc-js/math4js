/**
 * Linear Algebra Module
 */

export { Matrix } from './matrix.js';
export type { EigResult, SVDResult, QRResult, LUResult } from './matrix.js';
export { norm_vector, dot_product, cross_product } from './vector.js';
export {
  det,
  inverse_2x2,
  matrix_add,
  matrix_multiply,
  matrix_scalar_mul,
  transpose,
  trace,
} from './function.js';
export {
  rank_nullity_theorem,
  eigenvalues_theorem,
  svd_theorem,
  determinant_theorem,
  linear_independence_theorem,
} from './theorem.js';
