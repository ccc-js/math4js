/**
 * 向量運算函數
 */

function norm_vector(v: number[]): number {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
}

function dot_product(v1: number[], v2: number[]): number {
  return v1.reduce((sum, a, i) => sum + a * v2[i], 0);
}

function cross_product(v1: number[], v2: number[]): number[] {
  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0],
  ];
}

export { norm_vector, dot_product, cross_product };
