/**
 * 可設定種子的線性同餘亂數產生器 (LCG)
 *
 * LCG 公式: X_{n+1} = (a * X_n + c) mod m
 * 參數採用常用設定: a=1664525, c=1013904223, m=2^32
 */

/** @type {number} */
let _seed = 1;

/** @type {number} */
let _initialSeed = 1;

/**
 * 設定亂數種子
 * @param {number} seed
 */
function setSeed(seed) {
  _seed = seed >>> 0;
  _initialSeed = _seed;
}

/**
 * 取得目前種子
 * @returns {number}
 */
function getSeed() {
  return _initialSeed;
}

/**
 * 重置為初始種子
 */
function resetSeed() {
  _seed = _initialSeed;
}

/**
 * 取得下一個亂數 [0, 1)
 * 使用線性同餘生成器
 * @returns {number}
 */
function random() {
  _seed = (1664525 * _seed + 1013904223) >>> 0;
  return _seed / 4294967296;
}

/**
 * 取得整數亂數 [min, max]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * 混合諧波平均 (HMAC-style) 混合兩個值
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function mix(a, b) {
  return ((a ^ b) * 1664525 + 1013904223) >>> 0;
}

/**
 * 將字串轉換為數值陣列
 * @param {string} str
 * @returns {number[]}
 */
function stringToSeeds(str) {
  const seeds = [];
  for (let i = 0; i < str.length; i++) {
    seeds.push(str.charCodeAt(i) ^ ((i * 1664525) >>> 0));
  }
  return seeds;
}

/**
 * 將字串設為種子
 * @param {string} str
 */
function setSeedString(str) {
  const seeds = stringToSeeds(str);
  let s = seeds.length > 0 ? seeds[0] : 1;
  for (let i = 1; i < seeds.length; i++) {
    s = mix(s, seeds[i]);
  }
  setSeed(s);
}

/**
 * 批次產生 [0, 1) 亂數
 * @param {number} n
 * @returns {number[]}
 */
function randomBatch(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(random());
  }
  return result;
}

/**
 * 批次產生整數亂數 [min, max]
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
function randIntBatch(n, min, max) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(randInt(min, max));
  }
  return result;
}

module.exports = {
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
