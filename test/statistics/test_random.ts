/**
 * 亂數模組測試
 */

import {
  setSeed,
  getSeed,
  resetSeed,
  random,
  randInt,
  randomBatch,
  randIntBatch,
} from '../../src/math4js/statistics/random.js';

describe('LCG Random', () => {
  test('setSeed and getSeed', () => {
    setSeed(12345);
    expect(getSeed()).toBe(12345);
    setSeed(0);
    expect(getSeed()).toBe(0);
    setSeed(4294967295);
    expect(getSeed()).toBe(4294967295);
  });

  test('resetSeed', () => {
    setSeed(42);
    random();
    random();
    resetSeed();
    const r1 = random();
    resetSeed();
    const r2 = random();
    expect(r1).toBe(r2);
  });

  test('random returns value in [0, 1)', () => {
    setSeed(1);
    for (let i = 0; i < 100; i++) {
      const r = random();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    }
  });

  test('random is deterministic with same seed', () => {
    setSeed(12345);
    const seq1 = randomBatch(10);
    setSeed(12345);
    const seq2 = randomBatch(10);
    expect(seq1).toEqual(seq2);
  });

  test('random produces different sequences with different seeds', () => {
    setSeed(1);
    const seq1 = randomBatch(10);
    setSeed(2);
    const seq2 = randomBatch(10);
    expect(seq1).not.toEqual(seq2);
  });

  test('randInt returns integer in range [min, max]', () => {
    setSeed(12345);
    for (let i = 0; i < 100; i++) {
      const r = randInt(5, 10);
      expect(r).toBeGreaterThanOrEqual(5);
      expect(r).toBeLessThanOrEqual(10);
      expect(Number.isInteger(r)).toBe(true);
    }
  });

  test('randInt is inclusive of both ends', () => {
    setSeed(1);
    const results = new Set();
    for (let i = 0; i < 1000; i++) {
      results.add(randInt(0, 1));
    }
    expect(results.has(0)).toBe(true);
    expect(results.has(1)).toBe(true);
  });

  test('randomBatch returns correct length', () => {
    setSeed(1);
    expect(randomBatch(0)).toEqual([]);
    expect(randomBatch(1)).toHaveLength(1);
    expect(randomBatch(100)).toHaveLength(100);
  });

  test('randIntBatch returns correct length', () => {
    setSeed(1);
    expect(randIntBatch(0, 0, 10)).toEqual([]);
    expect(randIntBatch(5, 0, 10)).toHaveLength(5);
  });
});
