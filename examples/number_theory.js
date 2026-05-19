/**
 * Number Theory 模組範例
 */

import { gcd, lcm, isPrime, primesUpTo, primeFactors, eulerPhi, modPow, modInv, fibonacci, factorial, combinations, bezoutIdentity, chineseRemainderTheorem, fermatLittleTheorem } from 'math4js/number_theory';

console.log('=== 基本數論函數 ===');
console.log('gcd(48, 18):', gcd(48, 18));
console.log('lcm(4, 6):', lcm(4, 6));
console.log('isPrime(17):', isPrime(17));

console.log('\n=== 質數相關 ===');
console.log('質數 up to 20:', primesUpTo(20));
console.log('18 的質因數:', primeFactors(18));
console.log('Euler φ(12):', eulerPhi(12));

console.log('\n=== 模運算 ===');
console.log('3^17 mod 5:', modPow(3, 17, 5));
console.log('3 的模反元素 (mod 7):', modInv(3, 7));

console.log('\n=== 組合數學 ===');
console.log('fibonacci(10):', fibonacci(10));
console.log('factorial(6):', factorial(6));
console.log('C(10, 3):', combinations(10, 3));

console.log('\n=== 數論定理 ===');
console.log('Bezout Identity:', bezoutIdentity(48, 18));
console.log('Fermat 小定理:', fermatLittleTheorem(7, 3));
console.log('中國剩餘定理:', chineseRemainderTheorem([3, 4, 5], [2, 3, 1]));