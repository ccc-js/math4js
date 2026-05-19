/**
 * Algebra Module
 *
 * 有理數、複數、多項式、求根
 */

export { Rational, parseRational } from './rational.js';
export { Complex } from './complex.js';
export { Polynomial, horner } from './polynomial.js';
export {
  bisection,
  newton,
  secant,
  horner as hornerEval,
  hornerDerivative,
  findAllRoots,
  deflation,
} from './roots.js';