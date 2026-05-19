/**
 * 微分測試
 */

import { derivative, secondDerivative, gradient, jacobian } from '../../src/math4js/calculus/derivative.js';

describe('derivative', () => {
  test('computes derivative of x^2', () => {
    const f = (x: number) => x * x;
    const df = derivative(f);
    expect(df(2)).toBeCloseTo(4, 5);
  });

  test('computes derivative of sin', () => {
    const f = (x: number) => Math.sin(x);
    const df = derivative(f);
    expect(df(Math.PI / 2)).toBeCloseTo(0, 5);
    expect(df(0)).toBeCloseTo(1, 5);
  });

  test('computes derivative at multiple points', () => {
    const f = (x: number) => 3 * x * x + 2 * x + 1;
    const df = derivative(f);
    expect(df(0)).toBeCloseTo(2, 5);
    expect(df(1)).toBeCloseTo(8, 5);
    expect(df(2)).toBeCloseTo(14, 5);
  });
});

describe('secondDerivative', () => {
  test('computes second derivative of x^3 at x=1', () => {
    const f = (x: number) => x * x * x;
    const ddf = secondDerivative(f, 1e-4);
    expect(ddf(1)).toBeCloseTo(6, 1);
  });

  test('computes second derivative of x^3 at x=1', () => {
    const f = (x: number) => x * x * x;
    const ddf = secondDerivative(f, 1e-4);
    expect(ddf(1)).toBeCloseTo(6, 1);
  });
});

describe('gradient', () => {
  test('computes gradient of x^2 + y^2', () => {
    const f = (x: number[]) => x[0] * x[0] + x[1] * x[1];
    const grad = gradient(f);
    expect(grad([1, 2])[0]).toBeCloseTo(2, 5);
    expect(grad([1, 2])[1]).toBeCloseTo(4, 5);
  });

  test('gradient of x^2 - y^2', () => {
    const f = (x: number[]) => x[0] * x[0] - x[1] * x[1];
    const grad = gradient(f);
    expect(grad([3, 2])[0]).toBeCloseTo(6, 5);
    expect(grad([3, 2])[1]).toBeCloseTo(-4, 5);
  });
});

describe('jacobian', () => {
  test('computes jacobian of [x+y, x-y]', () => {
    const f = (x: number[]) => [x[0] + x[1], x[0] - x[1]];
    const jac = jacobian(f);
    const result = jac([1, 2]);
    expect(result[0][0]).toBeCloseTo(1, 5);
    expect(result[0][1]).toBeCloseTo(1, 5);
    expect(result[1][0]).toBeCloseTo(1, 5);
    expect(result[1][1]).toBeCloseTo(-1, 5);
  });
});