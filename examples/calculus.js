/**
 * Calculus 模組範例
 */

import { derivative, secondDerivative, gradient } from 'math4js/calculus/derivative';
import { trapezoid, simpson } from 'math4js/calculus/integral';
import { hessian } from 'math4js/calculus/multivariable';
import { goldenSection } from 'math4js/calculus/optimize';

console.log('=== 單變數微分 ===');
const f = (x) => x ** 3 + 2 * x ** 2 - 5 * x + 1;
const df = derivative(f);
console.log('f(x) = x³ + 2x² - 5x + 1');
console.log("f'(2):", df(2));
console.log("f''(2):", secondDerivative(f)(2));

console.log('\n=== 多變數微分 ===');
const f2 = (x) => x[0] ** 2 + x[1] ** 2;
console.log('f(x,y) = x² + y²');
console.log('∇f(1,2):', gradient(f2)([1, 2]));
console.log('Hessian(1,2):', hessian(f2, [1, 2]));

console.log('\n=== 數值積分 ===');
const f_int = (x) => x ** 2;
console.log('∫₀¹ x² dx = 1/3 ≈ 0.3333');
console.log('梯形法:', trapezoid(f_int, 0, 1, 100));
console.log('Simpson:', simpson(f_int, 0, 1, 100));

console.log('\n=== 一維優化 ===');
const f_opt = (x) => x ** 2 - 4 * x + 1;
console.log('f(x) = x² - 4x + 1');
console.log('黃金分割:', goldenSection(f_opt, 0, 4));