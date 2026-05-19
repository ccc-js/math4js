/**
 * 變換測試
 */

import { translate2D, rotate2D, scale2D, reflect2D, rotationMatrix2D } from '../../src/math4js/geometry/transform.js';
import { Point2D } from '../../src/math4js/geometry/point.js';
import { Vec2 } from '../../src/math4js/geometry/vector.js';

describe('translate2D', () => {
  test('translates point', () => {
    const p = new Point2D(1, 2);
    const result = translate2D(p, new Vec2(3, 4));
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });
});

describe('rotate2D', () => {
  test('rotates point around origin', () => {
    const p = new Point2D(1, 0);
    const result = rotate2D(p, Math.PI / 2);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
  });

  test('rotates point around center', () => {
    const p = new Point2D(2, 0);
    const result = rotate2D(p, Math.PI / 2, new Point2D(1, 0));
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(1);
  });
});

describe('scale2D', () => {
  test('scales point from origin', () => {
    const p = new Point2D(2, 3);
    const result = scale2D(p, 2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('scales point from center', () => {
    const p = new Point2D(3, 3);
    const result = scale2D(p, 2, new Point2D(1, 1));
    expect(result.x).toBe(5);
    expect(result.y).toBe(5);
  });
});

describe('reflect2D', () => {
  test('reflects across x-axis', () => {
    const p = new Point2D(1, 2);
    const result = reflect2D(p, 'x');
    expect(result.x).toBe(1);
    expect(result.y).toBe(-2);
  });

  test('reflects across y-axis', () => {
    const p = new Point2D(1, 2);
    const result = reflect2D(p, 'y');
    expect(result.x).toBe(-1);
    expect(result.y).toBe(2);
  });
});

describe('rotationMatrix2D', () => {
  test('creates rotation matrix', () => {
    const m = rotationMatrix2D(Math.PI / 2);
    expect(m[0][0]).toBeCloseTo(0);
    expect(m[0][1]).toBeCloseTo(-1);
    expect(m[1][0]).toBeCloseTo(1);
    expect(m[1][1]).toBeCloseTo(0);
  });
});