/**
 * 單變數微分
 *
 * 數值導數、偏導數、梯度
 */

export function derivative(f: (x: number) => number, h: number = 1e-8): (x: number) => number {
  return (x: number): number => {
    return (f(x + h) - f(x - h)) / (2 * h);
  };
}

export function secondDerivative(f: (x: number) => number, h: number = 1e-8): (x: number) => number {
  return (x: number): number => {
    return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
  };
}

export function partial(
  f: (x: number[]) => number,
  i: number,
  h: number = 1e-8
): (x: number[]) => number {
  return (x: number[]): number => {
    const xPlus = [...x];
    const xMinus = [...x];
    xPlus[i] += h;
    xMinus[i] -= h;
    return (f(xPlus) - f(xMinus)) / (2 * h);
  };
}

export function gradient(
  f: (x: number[]) => number,
  h: number = 1e-8
): (x: number[]) => number[] {
  return (x: number[]): number[] => {
    return x.map((_, i) => partial(f, i, h)(x));
  };
}

export function jacobian(
  f: (x: number[]) => number[],
  h: number = 1e-8
): (x: number[]) => number[][] {
  return (x: number[]): number[][] => {
    return f(x).map((_, i) => gradient((y: number[]) => f(y)[i], h)(x));
  };
}

export function directionalDerivative(
  f: (x: number[]) => number,
  x: number[],
  direction: number[]
): number {
  const grad = gradient(f)(x);
  const dir = normalize(direction);
  return grad.reduce((sum, g, i) => sum + g * dir[i], 0);
}

function normalize(v: number[]): number[] {
  const len = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  if (len === 0) return v;
  return v.map(x => x / len);
}