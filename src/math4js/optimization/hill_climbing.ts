/**
 * 爬山演算法
 *
 * 爬山、隨機重啟、模擬退火
 */

export function hillClimbing(
  f: (x: number[]) => number,
  x0: number[],
  stepSize: number = 0.1,
  maxIter: number = 1000,
  neighborhood: (x: number[]) => number[][] = (x) => {
    const result: number[][] = [];
    for (let i = 0; i < 10; i++) {
      result.push(x.map((xi) => {
        const delta = (Math.random() - 0.5) * 2 * stepSize;
        return xi + delta;
      }));
    }
    return result;
  }
): { x: number[]; value: number; iterations: number } {
  let x = [...x0];
  let bestVal = f(x);

  for (let i = 0; i < maxIter; i++) {
    const candidates = neighborhood(x);
    let improved = false;
    for (const cand of candidates) {
      const val = f(cand);
      if (val < bestVal) {
        x = cand;
        bestVal = val;
        improved = true;
      }
    }
    if (!improved) break;
  }
  return { x, value: bestVal, iterations: maxIter };
}

export function hillClimbingSimple(
  f: (x: number[]) => number,
  x0: number[],
  stepSize: number = 0.1,
  maxIter: number = 1000
): { x: number[]; value: number; iterations: number } {
  let x = [...x0];
  let bestVal = f(x);

  for (let i = 0; i < maxIter; i++) {
    const neighbors: number[][] = [];
    for (let j = 0; j < x.length; j++) {
      const xPlus = [...x];
      xPlus[j] += stepSize;
      neighbors.push(xPlus);
      const xMinus = [...x];
      xMinus[j] -= stepSize;
      neighbors.push(xMinus);
    }

    let bestNeighbor = x;
    let bestNeighborVal = bestVal;

    for (const cand of neighbors) {
      const val = f(cand);
      if (val < bestNeighborVal) {
        bestNeighbor = cand;
        bestNeighborVal = val;
      }
    }

    if (bestNeighborVal < bestVal) {
      x = bestNeighbor;
      bestVal = bestNeighborVal;
    } else {
      break;
    }
  }
  return { x, value: bestVal, iterations: maxIter };
}

export function randomRestartHillClimbing(
  f: (x: number[]) => number,
  bounds: number[][],
  restarts: number = 10,
  maxIterPerRestart: number = 1000,
  stepSize: number = 0.1
): { x: number[]; value: number; restarts: number } {
  let bestX: number[] = [];
  let bestVal = Infinity;

  for (let r = 0; r < restarts; r++) {
    const x0 = bounds.map(([min, max]) => min + Math.random() * (max - min));
    const result = hillClimbingSimple(f, x0, stepSize, maxIterPerRestart);
    if (result.value < bestVal) {
      bestVal = result.value;
      bestX = result.x;
    }
  }
  return { x: bestX, value: bestVal, restarts };
}

export function simulatedAnnealing(
  f: (x: number[]) => number,
  x0: number[],
  initialTemp: number = 100,
  coolingRate: number = 0.95,
  minTemp: number = 0.01,
  maxIter: number = 1000,
  neighborhood: (x: number[], step: number) => number[][] = (x, step) => {
    const neighbors: number[][] = [];
    for (let i = 0; i < 10; i++) {
      neighbors.push(x.map((xi) => xi + (Math.random() - 0.5) * 2 * step));
    }
    return neighbors;
  }
): { x: number[]; value: number; iterations: number } {
  let x = [...x0];
  let currentVal = f(x);
  let bestX = [...x];
  let bestVal = currentVal;
  let temp = initialTemp;
  let step = 10;

  for (let i = 0; i < maxIter && temp > minTemp; i++) {
    const candidates = neighborhood(x, step);
    const cand = candidates[Math.floor(Math.random() * candidates.length)];
    const candVal = f(cand);
    const delta = candVal - currentVal;

    if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
      x = cand;
      currentVal = candVal;
      if (currentVal < bestVal) {
        bestX = [...x];
        bestVal = currentVal;
      }
    }

    temp *= coolingRate;
    step *= coolingRate;
  }
  return { x: bestX, value: bestVal, iterations: maxIter };
}

export function stochasticHillClimbing(
  f: (x: number[]) => number,
  x0: number[],
  neighbors: number = 5,
  maxIter: number = 1000,
  stepSize: number = 0.1
): { x: number[]; value: number; iterations: number } {
  let x = [...x0];
  let bestVal = f(x);

  for (let i = 0; i < maxIter; i++) {
    const candidates: number[][] = [];
    for (let n = 0; n < neighbors; n++) {
      candidates.push(x.map(xi => xi + (Math.random() - 0.5) * 2 * stepSize));
    }
    const bestCand = candidates.reduce((best, cand) => {
      const val = f(cand);
      return val < f(best) ? cand : best;
    }, x);
    const bestCandVal = f(bestCand);
    if (bestCandVal < bestVal) {
      x = bestCand;
      bestVal = bestCandVal;
    }
  }
  return { x, value: bestVal, iterations: maxIter };
}