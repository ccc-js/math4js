/**
 * 資訊理論函數
 *
 * 實作熵、交叉熵、KL 散度、互資訊等資訊理論函數
 */

function entropy(p: number[], base: number = 2): number {
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

function cross_entropy(p: number[], q: number[], base: number = 2): number {
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

function kl_divergence(p: number[], q: number[], base: number = 2): number {
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

function mutual_information(x: number[], y: number[], base: number = 2): number {
  const joint = x.map((xi, i) => [xi, y[i]] as [number, number]);

  const xCount: Record<string, number> = {};
  const yCount: Record<string, number> = {};
  const jointCount: Record<string, number> = {};

  for (const [xi, yi] of joint) {
    xCount[xi] = (xCount[xi] || 0) + 1;
    yCount[yi] = (yCount[yi] || 0) + 1;
    const key = `${xi},${yi}`;
    jointCount[key] = (jointCount[key] || 0) + 1;
  }

  const n = joint.length;
  let h_x = 0;
  let h_y = 0;
  let h_xy = 0;

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

function conditional_entropy(x: number[], y: number[], base: number = 2): number {
  const joint = x.map((xi, i) => [xi, y[i]] as [number, number]);

  const xCount: Record<string, number> = {};
  const jointCount: Record<string, number> = {};

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

function pmi(x: number[], y: number[], base: number = 2): number {
  const joint = x.map((xi, i) => [xi, y[i]] as [number, number]);

  const xCount: Record<string, number> = {};
  const yCount: Record<string, number> = {};
  const jointCount: Record<string, number> = {};

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

export { entropy, cross_entropy, kl_divergence, mutual_information, conditional_entropy, pmi };
