/**
 * 可設定種子的線性同餘亂數產生器 (LCG)
 *
 * LCG 公式: X_{n+1} = (a * X_n + c) mod m
 * 參數採用常用設定: a=1664525, c=1013904223, m=2^32
 */

let _seed: number = 1;
let _initialSeed: number = 1;

function setSeed(seed: number): void {
  _seed = seed >>> 0;
  _initialSeed = _seed;
}

function getSeed(): number {
  return _initialSeed;
}

function resetSeed(): void {
  _seed = _initialSeed;
}

function random(): number {
  _seed = (1664525 * _seed + 1013904223) >>> 0;
  return _seed / 4294967296;
}

function randInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function mix(a: number, b: number): number {
  return ((a ^ b) * 1664525 + 1013904223) >>> 0;
}

function stringToSeeds(str: string): number[] {
  const seeds: number[] = [];
  for (let i = 0; i < str.length; i++) {
    seeds.push(str.charCodeAt(i) ^ ((i * 1664525) >>> 0));
  }
  return seeds;
}

function setSeedString(str: string): void {
  const seeds = stringToSeeds(str);
  let s = seeds.length > 0 ? seeds[0] : 1;
  for (let i = 1; i < seeds.length; i++) {
    s = mix(s, seeds[i]);
  }
  setSeed(s);
}

function randomBatch(n: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(random());
  }
  return result;
}

function randIntBatch(n: number, min: number, max: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(randInt(min, max));
  }
  return result;
}

export {
  setSeed,
  getSeed,
  resetSeed,
  random,
  randInt,
  setSeedString,
  mix,
  stringToSeeds,
  randomBatch,
  randIntBatch,
};