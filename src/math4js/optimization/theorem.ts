/**
 * 優化定理
 *
 * 凸函數條件、KKT、最優性條件
 */

import { hessian } from '../calculus/multivariable.js';

export function convexFirstOrderCondition(
  f: (x: number[]) => number,
  gradF: (x: number[]) => number[],
  x: number[],
  y: number[],
  epsilon: number = 1e-6
): boolean {
  const fx = f(x);
  const fy = f(y);
  const gradFx = gradF(x);
  const rhs = fx + gradFx.reduce((sum, g, i) => sum + g * (y[i] - x[i]), 0);
  return fy <= rhs + epsilon;
}

export function convexSecondOrderCondition(
  f: (x: number[]) => number,
  x: number[],
  epsilon: number = 1e-6
): boolean {
  const H = hessian(f)(x);
  const n = H.length;
  for (let i = 0; i < n; i++) {
    if (H[i][i] < -epsilon) return false;
  }
  return true;
}

export function weierstrassExtremeValue(
  f: (x: number[]) => number,
  compactSet: (x: number[]) => boolean,
  samplePoints: number[][]
): { hasMin: boolean; hasMax: boolean; minVal: number; maxVal: number } {
  let minVal = Infinity;
  let maxVal = -Infinity;
  let hasMin = false;
  let hasMax = false;

  for (const p of samplePoints) {
    if (compactSet(p)) {
      const val = f(p);
      if (val < minVal) {
        minVal = val;
        hasMin = true;
      }
      if (val > maxVal) {
        maxVal = val;
        hasMax = true;
      }
    }
  }

  return { hasMin, hasMax, minVal: hasMin ? minVal : 0, maxVal: hasMax ? maxVal : 0 };
}

export function kktConditions(
  f: (x: number[]) => number,
  constraints: ((x: number[]) => number)[],
  gradF: (x: number[]) => number[],
  gradG: (x: number[]) => number[][],
  x: number[],
  lambda: number[]
): { satisfied: boolean; stationarity: number; feasibility: number; complementarity: number } {
  const gradFx = gradF(x);
  const gradGx = gradG(x);

  let stationarity = 0;
  for (let i = 0; i < gradFx.length; i++) {
    let sum = gradFx[i];
    for (let j = 0; j < lambda.length; j++) {
      sum += lambda[j] * gradGx[j][i];
    }
    stationarity = Math.max(stationarity, Math.abs(sum));
  }

  let feasibility = 0;
  for (let i = 0; i < constraints.length; i++) {
    feasibility = Math.max(feasibility, Math.abs(constraints[i](x)));
  }

  let complementarity = 0;
  for (let i = 0; i < lambda.length; i++) {
    complementarity = Math.max(complementarity, Math.abs(lambda[i] * constraints[i](x)));
  }

  const satisfied = stationarity < 1e-6 && feasibility < 1e-6 && complementarity < 1e-6;
  return { satisfied, stationarity, feasibility, complementarity };
}

export function gradientVanishingAtOptimum(
  gradF: (x: number[]) => number[],
  x: number[],
  epsilon: number = 1e-6
): boolean {
  const grad = gradF(x);
  const norm = Math.sqrt(grad.reduce((sum, g) => sum + g * g, 0));
  return norm < epsilon;
}

export function convexOptimalityCondition(
  f: (x: number[]) => number,
  gradF: (x: number[]) => number[],
  x: number[],
  epsilon: number = 1e-6
): boolean {
  const grad = gradF(x);
  const norm = Math.sqrt(grad.reduce((sum, g) => sum + g * g, 0));
  if (norm >= epsilon) return false;

  const H = hessian(f)(x);
  for (let i = 0; i < H.length; i++) {
    if (H[i][i] < -epsilon) return false;
  }
  return true;
}

export function descentDirectionTheorem(
  gradF: (x: number[]) => number[],
  direction: number[],
  epsilon: number = 1e-6
): boolean {
  const grad = gradF([0]);
  const dot = direction.reduce((sum, d, i) => sum + d * grad[i], 0);
  return dot < -epsilon;
}

export function WolfeConditions(
  f: (x: number[]) => number,
  gradF: (x: number[]) => number[],
  x: number[],
  pk: number[],
  alpha: number,
  c1: number = 0.1,
  c2: number = 0.9
): boolean {
  const fx = f(x);
  const gradFx = gradF(x);
  const slope0 = gradFx.reduce((sum, g, i) => sum + g * pk[i], 0);

  const xNew = x.map((xi, i) => xi + alpha * pk[i]);
  const fNew = f(xNew);
  const sufficientDecrease = fNew <= fx + c1 * alpha * slope0;

  const gradNew = gradF(xNew);
  const slopeNew = gradNew.reduce((sum, g, i) => sum + g * pk[i], 0);
  const curvatureCondition = slopeNew >= c2 * slope0;

  return sufficientDecrease && curvatureCondition;
}