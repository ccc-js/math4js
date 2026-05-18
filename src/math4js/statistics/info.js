/**
 * 資訊理論函數
 *
 * 實作熵、交叉熵、KL 散度、互資訊等資訊理論函數
 */

/**
 * 計算熵 (Entropy)
 * @param {number[]} p - 機率分布
 * @param {number} base - 對數底數（預設 2）
 * @returns {number}
 */
function entropy(p, base = 2) {
  const pSum = p.reduce((a, b) => a + b, 0);
  if (pSum === 0) return 0;

  const pNorm = p.map((pi) => pi / pSum);
  let h = 0;
  for (let i = 0; i < pNorm.length; i++) {
    if (pNorm[i] > 0) {
      h -= (pNorm[i] * Math.log(pNorm[i])) / Math.log(base);
    }
  }
  return h;
}

/**
 * 計算交叉熵 (Cross Entropy)
 * @param {number[]} p - 真實分布
 * @param {number[]} q - 預測分布
 * @param {number} base - 對數底數
 * @returns {number}
 */
function cross_entropy(p, q, base = 2) {
  const pSum = p.reduce((a, b) => a + b, 0);
  const qSum = q.reduce((a, b) => a + b, 0);
  if (pSum === 0 || qSum === 0) return 0;

  const pNorm = p.map((pi) => pi / pSum);
  const qNorm = q.map((qi) => qi / qSum);

  let h = 0;
  for (let i = 0; i < pNorm.length; i++) {
    if (pNorm[i] > 0 && qNorm[i] > 0) {
      h -= (pNorm[i] * Math.log(qNorm[i])) / Math.log(base);
    }
  }
  return h;
}

/**
 * 計算 KL 散度 (Kullback-Leibler Divergence)
 * D(P || Q) = Σ P(x) log(P(x) / Q(x))
 * @param {number[]} p - 真實分布
 * @param {number[]} q - 預測分布
 * @param {number} base - 對數底數
 * @returns {number}
 */
function kl_divergence(p, q, base = 2) {
  const pSum = p.reduce((a, b) => a + b, 0);
  const qSum = q.reduce((a, b) => a + b, 0);
  if (pSum === 0 || qSum === 0) return 0;

  const pNorm = p.map((pi) => pi / pSum);
  const qNorm = q.map((qi) => qi / qSum);

  let kl = 0;
  for (let i = 0; i < pNorm.length; i++) {
    if (pNorm[i] > 0 && qNorm[i] > 0) {
      kl += (pNorm[i] * Math.log(pNorm[i] / qNorm[i])) / Math.log(base);
    }
  }
  return kl;
}

/**
 * 計算互資訊 (Mutual Information)
 * I(X;Y) = H(X) + H(Y) - H(X,Y)
 * @param {number[]} x
 * @param {number[]} y
 * @param {number} base - 對數底數
 * @returns {number}
 */
function mutual_information(x, y, base = 2) {
  const joint = x.map((xi, i) => [xi, y[i]]);

  const xCount = {};
  const yCount = {};
  const jointCount = {};

  for (const [xi, yi] of joint) {
    xCount[xi] = (xCount[xi] || 0) + 1;
    yCount[yi] = (yCount[yi] || 0) + 1;
    const key = `${xi},${yi}`;
    jointCount[key] = (jointCount[key] || 0) + 1;
  }

  const n = joint.length;
  let h_x = 0,
    h_y = 0,
    h_xy = 0;

  for (const key in xCount) {
    const p = xCount[key] / n;
    h_x -= (p * Math.log(p)) / Math.log(base);
  }

  for (const key in yCount) {
    const p = yCount[key] / n;
    h_y -= (p * Math.log(p)) / Math.log(base);
  }

  for (const key in jointCount) {
    const p = jointCount[key] / n;
    h_xy -= (p * Math.log(p)) / Math.log(base);
  }

  return h_x + h_y - h_xy;
}

/**
 * 計算條件熵 (Conditional Entropy)
 * H(Y|X) = -Σ Σ P(x,y) log(P(y|x))
 * @param {number[]} x
 * @param {number[]} y
 * @param {number} base - 對數底數
 * @returns {number}
 */
function conditional_entropy(x, y, base = 2) {
  const joint = x.map((xi, i) => [xi, y[i]]);

  const xCount = {};
  const jointCount = {};

  for (const [xi, yi] of joint) {
    xCount[xi] = (xCount[xi] || 0) + 1;
    const key = `${xi},${yi}`;
    jointCount[key] = (jointCount[key] || 0) + 1;
  }

  const n = joint.length;
  let h_y_given_x = 0;

  for (const [xi, yi] of joint) {
    const key = `${xi},${yi}`;
    const p_xy = jointCount[key] / n;
    const p_x = xCount[xi] / n;
    if (p_xy > 0 && p_x > 0) {
      const p_y_given_x = p_xy / p_x;
      h_y_given_x -= (p_xy * Math.log(p_y_given_x)) / Math.log(base);
    }
  }

  return h_y_given_x;
}

/**
 * 計算點間互資訊 (PMI)
 * PMI(x, y) = log(P(x,y) / (P(x) * P(y)))
 * @param {number[]} x
 * @param {number[]} y
 * @param {number} base - 對數底數
 * @returns {number}
 */
function pmi(x, y, base = 2) {
  const joint = x.map((xi, i) => [xi, y[i]]);

  const xCount = {};
  const yCount = {};
  const jointCount = {};

  for (const [xi, yi] of joint) {
    xCount[xi] = (xCount[xi] || 0) + 1;
    yCount[yi] = (yCount[yi] || 0) + 1;
    const key = `${xi},${yi}`;
    jointCount[key] = (jointCount[key] || 0) + 1;
  }

  const n = joint.length;

  let total_pmi = 0;
  let count = 0;

  for (const key in jointCount) {
    const [xi, yi] = key.split(',').map(Number);
    const p_xy = jointCount[key] / n;
    const p_x = xCount[xi] / n;
    const p_y = yCount[yi] / n;

    if (p_xy > 0 && p_x > 0 && p_y > 0) {
      const pmi_val = Math.log(p_xy / (p_x * p_y)) / Math.log(base);
      total_pmi += pmi_val;
      count++;
    }
  }

  return count > 0 ? total_pmi / count : 0;
}

module.exports = {
  entropy,
  cross_entropy,
  kl_divergence,
  mutual_information,
  conditional_entropy,
  pmi,
};
