/**
 * Linear Algebra Module
 *
 * Provides vector and matrix operations, vector spaces, and linear algebra theorems.
 */

const { Matrix } = require('./matrix.js');
const { norm_vector, dot_product, cross_product } = require('./vector.js');
const {
  det,
  inverse_2x2,
  matrix_add,
  matrix_multiply,
  matrix_scalar_mul,
  transpose,
  trace,
} = require('./function.js');
const {
  rank_nullity_theorem,
  eigenvalues_theorem,
  svd_theorem,
  determinant_theorem,
  linear_independence_theorem,
} = require('./theorem.js');

module.exports = {
  Matrix,
  norm_vector,
  dot_product,
  cross_product,
  det,
  inverse_2x2,
  matrix_add,
  matrix_multiply,
  matrix_scalar_mul,
  transpose,
  trace,
  rank_nullity_theorem,
  eigenvalues_theorem,
  svd_theorem,
  determinant_theorem,
  linear_independence_theorem,
};
