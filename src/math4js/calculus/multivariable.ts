/**
 * 多變數微積分
 *
 * 梯度、散度、旋度、拉普拉斯、Hessian
 */

export function grad(
  f: (x: number[]) => number,
  h: number = 1e-8
): (x: number[]) => number[] {
  return (x: number[]): number[] => {
    return x.map((_, i) => {
      const xPlus = [...x];
      const xMinus = [...x];
      xPlus[i] += h;
      xMinus[i] -= h;
      return (f(xPlus) - f(xMinus)) / (2 * h);
    });
  };
}

export function divergence(
  F: (x: number[]) => number[],
  h: number = 1e-8
): (x: number[]) => number {
  return (x: number[]): number => {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      const xPlus = [...x];
      const xMinus = [...x];
      xPlus[i] += h;
      xMinus[i] -= h;
      const Fi = (y: number[]) => F(y)[i];
      sum += (Fi(xPlus) - Fi(xMinus)) / (2 * h);
    }
    return sum;
  };
}

export function curl2D(
  F: (x: number[]) => number[]
): (x: number[]) => number {
  const dF1dx2 = (x: number[]): number => {
    const eps = 1e-8;
    const xPlus = [...x];
    xPlus[1] += eps;
    return (F(xPlus)[0] - F(x)[0]) / eps;
  };
  const dF2dx1 = (x: number[]): number => {
    const eps = 1e-8;
    const xPlus = [...x];
    xPlus[0] += eps;
    return (F(xPlus)[1] - F(x)[1]) / eps;
  };
  return (x: number[]): number => dF1dx2(x) - dF2dx1(x);
}

export function curl3D(
  F: (x: number[]) => number[]
): (x: number[]) => number[] {
  return (x: number[]): number[] => {
    const eps = 1e-8;
    const fx = (i: number): number => {
      return (F([x[0] + eps, x[1], x[2]])[i] - F([x[0] - eps, x[1], x[2]])[i]) / (2 * eps);
    };
    const fy = (i: number): number => {
      return (F([x[0], x[1] + eps, x[2]])[i] - F([x[0], x[1] - eps, x[2]])[i]) / (2 * eps);
    };
    const fz = (i: number): number => {
      return (F([x[0], x[1], x[2] + eps])[i] - F([x[0], x[1], x[2] - eps])[i]) / (2 * eps);
    };

    return [
      fy(2) - fz(1),
      fz(0) - fx(2),
      fx(1) - fy(0)
    ];
  };
}

export function laplacian(
  f: (x: number[]) => number,
  h: number = 1e-8
): (x: number[]) => number {
  return (x: number[]): number => {
    let sum = 0;
    const f0 = f(x);
    for (let i = 0; i < x.length; i++) {
      const xPlus = [...x];
      const xMinus = [...x];
      xPlus[i] += h;
      xMinus[i] -= h;
      sum += (f(xPlus) - 2 * f0 + f(xMinus)) / (h * h);
    }
    return sum;
  };
}

export function hessian(
  f: (x: number[]) => number,
  h: number = 1e-8
): (x: number[]) => number[][] {
  return (x: number[]): number[][] => {
    const n = x.length;
    const result: number[][] = [];

    for (let i = 0; i < n; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          const xPlus = [...x];
          const xMinus = [...x];
          xPlus[i] += h;
          xMinus[i] -= h;
          result[i][j] = (f(xPlus) - 2 * f(x) + f(xMinus)) / (h * h);
        } else {
          const xpp = [...x];
          const xpm = [...x];
          const xmp = [...x];
          const xmm = [...x];
          xpp[i] += h; xpp[j] += h;
          xpm[i] += h; xpm[j] -= h;
          xmp[i] -= h; xmp[j] += h;
          xmm[i] -= h; xmm[j] -= h;
          result[i][j] = (f(xpp) - f(xpm) - f(xmp) + f(xmm)) / (4 * h * h);
        }
      }
    }
    return result;
  };
}