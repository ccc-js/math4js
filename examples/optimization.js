/**
 * Optimization 模組範例
 */

import { hillClimbingSimple, simulatedAnnealing, simplexMethod, isFeasiblePoint } from 'math4js/optimization';

console.log('=== 爬山法 ===');
const f = (x) => (x[0] - 2) ** 2 + (x[1] - 3) ** 2;
const result = hillClimbingSimple(f, [0, 0], 0.5, 100);
console.log('最小值點:', result.x);
console.log('目標值:', result.value);

console.log('\n=== 模擬退火 ===');
const result2 = simulatedAnnealing(f, [0, 0], 100, 0.95, 1000);
console.log('最優解:', result2.x);

console.log('\n=== 線性規劃 ===');
const c = [-1, -1];
const A = [[1, 1], [1, 0], [0, 1]];
const b = [4, 2, 2];
const lp = simplexMethod(c, A, b);
console.log('最優解:', lp.x);
console.log('目標值:', lp.objective);

console.log('\n=== 可行點 ===');
console.log('[1,1] 可行:', isFeasiblePoint([1, 1], A, b));
console.log('[3,3] 可行:', isFeasiblePoint([3, 3], A, b));