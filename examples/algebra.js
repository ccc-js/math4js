/**
 * Algebra 模組範例
 */

import { Polynomial, horner } from 'math4js/algebra/polynomial';
import { bisection } from 'math4js/algebra/roots';
import { Complex } from 'math4js/algebra/complex';
import { Rational } from 'math4js/algebra/rational';

console.log('=== 多項式 ===');
const p = new Polynomial([1, -5, 6]);
console.log('p(x) = x² - 5x + 6');
console.log('p(0):', p.eval(0), 'p(2):', p.eval(2), 'p(3):', p.eval(3));
console.log('導數:', p.derivative().toString());

console.log('\n=== Horner ===');
console.log('horner([1,-5,6,-1], 2):', horner([1, -5, 6, -1], 2));

console.log('\n=== 求根 ===');
const f = (x) => x ** 2 - 4;
console.log('f(x) = x² - 4, 根為 ±2');
console.log('二分法:', bisection(f, 0, 3));

console.log('\n=== 複數 ===');
const c1 = new Complex(3, 4);
const c2 = new Complex(1, -2);
console.log('c1:', c1.toString());
console.log('c1 + c2:', c1.add(c2).toString());
console.log('c1 * c2:', c1.mul(c2).toString());
console.log('|c1|:', c1.abs());

console.log('\n=== 有理數 ===');
const r1 = new Rational(2, 3);
const r2 = new Rational(3, 4);
console.log('r1:', r1.toString(), 'r2:', r2.toString());
console.log('r1 + r2:', r1.add(r2).toString());
console.log('r1 * r2:', r1.mul(r2).toString());