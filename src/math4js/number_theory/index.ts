/**
 * Number Theory Module
 *
 * 數論基礎函數與定理驗證
 */

export {
  gcd,
  lcm,
  isPrime,
  primesUpTo,
  primeFactors,
  eulerPhi,
  modPow,
  modInv,
  fibonacci,
  factorial,
  combinations,
  isCoprime,
} from './function.js';

export {
  bezoutIdentity,
  fundamentalTheoremOfArithmetic,
  eulerPhiMultiplicative,
  fermatLittleTheorem,
  eulerTheorem,
  chineseRemainderTheorem,
  gcdLcmRelation,
  fibonacciGcdProperty,
} from './theorem.js';