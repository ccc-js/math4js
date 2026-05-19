/**
 * Linear Algebra 模組範例
 */

import { Matrix } from 'math4js/linear_algebra';
import { norm_vector, dot_product, cross_product, matrix_multiply, transpose, trace } from 'math4js/linear_algebra';

const A = new Matrix([[1, 2, 3], [4, 5, 6]]);
const B = new Matrix([[7, 8], [9, 10], [11, 12]]);

console.log('=== 矩陣操作 ===');
console.log('A:\n', A.toString());
console.log('A × B:\n', matrix_multiply(A.toArray(), B.toArray()));

console.log('\n=== 向量運算 ===');
console.log('v = [1,2,3], w = [4,5,6]');
console.log('點積:', dot_product([1,2,3], [4,5,6]));
console.log('叉積:', cross_product([1,2,3], [4,5,6]));
console.log('norm:', norm_vector([1,2,3]));

console.log('\n=== 矩陣屬性 ===');
const D = new Matrix([[1, 2], [2, 4]]);
console.log('行列式:', D.det());
console.log('秩:', D.rank());
console.log('跡:', trace(D.toArray()));

console.log('\n=== 特徵值 ===');
const E = new Matrix([[1, 2], [2, 5]]);
console.log('特徵值:', E.eig().values);