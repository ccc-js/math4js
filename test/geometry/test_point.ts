/**
 * 點類別測試
 */

import { Point1D, Point2D, Point3D, PointND } from '../../src/math4js/geometry/point.js';

describe('Point1D', () => {
  test('creates point', () => {
    const p = new Point1D(5);
    expect(p.x).toBe(5);
  });

  test('calculates distance', () => {
    const p1 = new Point1D(1);
    const p2 = new Point1D(4);
    expect(p1.distance(p2)).toBe(3);
  });

  test('calculates midpoint', () => {
    const p1 = new Point1D(0);
    const p2 = new Point1D(10);
    expect(p1.midpoint(p2).x).toBe(5);
  });
});

describe('Point2D', () => {
  test('creates point', () => {
    const p = new Point2D(3, 4);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
  });

  test('calculates distance', () => {
    const p1 = new Point2D(0, 0);
    const p2 = new Point2D(3, 4);
    expect(p1.distance(p2)).toBe(5);
  });

  test('translates point', () => {
    const p = new Point2D(1, 2);
    const result = p.translate([3, 4]);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('scales point', () => {
    const p = new Point2D(2, 3);
    const result = p.scale(2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });
});

describe('Point3D', () => {
  test('creates point', () => {
    const p = new Point3D(1, 2, 3);
    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
    expect(p.z).toBe(3);
  });

  test('calculates distance', () => {
    const p1 = new Point3D(0, 0, 0);
    const p2 = new Point3D(1, 2, 2);
    expect(p1.distance(p2)).toBe(3);
  });
});

describe('PointND', () => {
  test('creates point', () => {
    const p = new PointND([1, 2, 3, 4]);
    expect(p.dim).toBe(4);
  });

  test('calculates distance', () => {
    const p1 = new PointND([0, 0]);
    const p2 = new PointND([3, 4]);
    expect(p1.distance(p2)).toBe(5);
  });
});