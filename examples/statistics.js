/**
 * Statistics 模組範例
 */

import { mean, median, variance, sd, dnorm, pnorm, rnorm, dbinom, setSeed, random, t_test_two, conf_interval } from 'math4js/statistics';

console.log('=== 描述統計 ===');
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('平均值:', mean(data));
console.log('中位數:', median(data));
console.log('標準差:', sd(data));

console.log('\n=== 機率分布 ===');
console.log('dnorm(0):', dnorm(0));
console.log('pnorm(1.96):', pnorm(1.96));
console.log('rnorm(3):', rnorm(3));
console.log('dbinom(5, 10, 0.5):', dbinom(5, 10, 0.5));

console.log('\n=== 隨機數 ===');
setSeed(42);
console.log('random(5):', random(5));

console.log('\n=== 假設檢定 ===');
const s1 = [1, 2, 3, 4, 5];
const s2 = [2, 3, 4, 5, 6];
console.log('t_test_two:', t_test_two(s1, s2));

console.log('\n=== 區間估計 ===');
console.log('95% CI:', conf_interval(data));