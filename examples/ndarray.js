/**
 * ndarray 模組範例
 */

import { ndarray, zeros, ones, full, eye } from 'math4js/ndarray';
import * as ops from 'math4js/ndarray/operations';

console.log('=== 建立陣列 ===');
console.log('zeros([3]):', zeros([3]).toArray());
console.log('ones([2,3]):', ones([2, 3]).toArray());
console.log('full([5], 99):', full([5], 99).toArray());
console.log('eye(3):', eye(3).toArray());

console.log('\n=== 運算 ===');
const x = new ndarray([1, 2, 3]);
const y = new ndarray([4, 5, 6]);
console.log('x + y:', ops.add(x, y).toArray());
console.log('x * y:', ops.multiply(x, y).toArray());
console.log('sum(x):', ops.sum(x));

console.log('\n=== 索引 ===');
const m = new ndarray([[1, 2, 3], [4, 5, 6]]);
console.log('m[0]:', m.get([0]).toArray());
console.log('m[1,2]:', m.get([1, 2]));