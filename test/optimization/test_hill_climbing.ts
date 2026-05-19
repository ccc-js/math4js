/**
 * 爬山演算法測試
 */

import { hillClimbingSimple, randomRestartHillClimbing, simulatedAnnealing } from '../../src/math4js/optimization/hill_climbing.js';

describe('hillClimbingSimple', () => {
  test('finds minimum', () => {
    const f = (x: number[]) => (x[0] - 2) ** 2 + (x[1] - 3) ** 2;
    const result = hillClimbingSimple(f, [0, 0], 0.5, 100);
    expect(result.value).toBeLessThan(0.1);
  });

  test('handles 1D', () => {
    const f = (x: number[]) => (x[0] - 5) ** 2;
    const result = hillClimbingSimple(f, [0], 0.5, 100);
    expect(result.value).toBeLessThan(1);
  });
});

describe('randomRestartHillClimbing', () => {
  test('finds global minimum', () => {
    const f = (x: number[]) => Math.sin(x[0]) * Math.cos(x[1]) + 0.1 * (x[0] ** 2 + x[1] ** 2);
    const bounds = [[-5, 5], [-5, 5]];
    const result = randomRestartHillClimbing(f, bounds, 5, 50);
    expect(result.value).toBeLessThan(2);
  });
});

describe('simulatedAnnealing', () => {
  test('finds minimum', () => {
    const f = (x: number[]) => (x[0] - 2) ** 2 + (x[1] - 3) ** 2;
    const result = simulatedAnnealing(f, [0, 0], 10, 0.95, 0.01, 100);
    expect(result.value).toBeLessThan(1);
  });
});