/**
 * 圓與多邊形測試
 */

import { Circle, Arc } from '../../src/math4js/geometry/circle.js';
import { Polygon, Triangle, Rectangle } from '../../src/math4js/geometry/polygon.js';
import { Point2D } from '../../src/math4js/geometry/point.js';

describe('Circle', () => {
  test('creates circle', () => {
    const c = new Circle(new Point2D(0, 0), 5);
    expect(c.radius).toBe(5);
  });

  test('calculates area', () => {
    const c = new Circle(new Point2D(0, 0), 1);
    expect(c.area()).toBeCloseTo(Math.PI);
  });

  test('calculates circumference', () => {
    const c = new Circle(new Point2D(0, 0), 1);
    expect(c.circumference()).toBeCloseTo(2 * Math.PI);
  });

  test('contains point inside', () => {
    const c = new Circle(new Point2D(0, 0), 5);
    expect(c.containsPoint(new Point2D(0, 0))).toBe(true);
    expect(c.containsPoint(new Point2D(3, 4))).toBe(true);
    expect(c.containsPoint(new Point2D(5, 0))).toBe(true);
  });

  test('contains point outside', () => {
    const c = new Circle(new Point2D(0, 0), 5);
    expect(c.containsPoint(new Point2D(6, 0))).toBe(false);
  });
});

describe('Polygon', () => {
  test('creates polygon', () => {
    const p = new Polygon([
      new Point2D(0, 0),
      new Point2D(4, 0),
      new Point2D(4, 3),
      new Point2D(0, 3),
    ]);
    expect(p.vertices.length).toBe(4);
  });

  test('calculates area of square', () => {
    const p = new Polygon([
      new Point2D(0, 0),
      new Point2D(4, 0),
      new Point2D(4, 3),
      new Point2D(0, 3),
    ]);
    expect(p.area()).toBe(12);
  });

  test('calculates perimeter', () => {
    const p = new Polygon([
      new Point2D(0, 0),
      new Point2D(4, 0),
      new Point2D(4, 3),
      new Point2D(0, 3),
    ]);
    expect(p.perimeter()).toBe(14);
  });

  test('calculates centroid', () => {
    const p = new Polygon([
      new Point2D(0, 0),
      new Point2D(4, 0),
      new Point2D(4, 3),
      new Point2D(0, 3),
    ]);
    const c = p.centroid();
    expect(c.x).toBe(2);
    expect(c.y).toBe(1.5);
  });

  test('contains point inside', () => {
    const p = new Polygon([
      new Point2D(0, 0),
      new Point2D(4, 0),
      new Point2D(4, 3),
      new Point2D(0, 3),
    ]);
    expect(p.containsPoint(new Point2D(2, 1.5))).toBe(true);
  });

  test('contains point outside', () => {
    const p = new Polygon([
      new Point2D(0, 0),
      new Point2D(4, 0),
      new Point2D(4, 3),
      new Point2D(0, 3),
    ]);
    expect(p.containsPoint(new Point2D(5, 1.5))).toBe(false);
  });
});

describe('Triangle', () => {
  test('creates triangle', () => {
    const t = new Triangle(
      new Point2D(0, 0),
      new Point2D(3, 0),
      new Point2D(0, 4)
    );
    expect(t.vertices.length).toBe(3);
  });

  test('calculates area', () => {
    const t = new Triangle(
      new Point2D(0, 0),
      new Point2D(3, 0),
      new Point2D(0, 4)
    );
    expect(t.area()).toBe(6);
  });
});

describe('Rectangle', () => {
  test('creates rectangle', () => {
    const r = new Rectangle(0, 0, 4, 3);
    expect(r.width).toBe(4);
    expect(r.height).toBe(3);
  });

  test('calculates area', () => {
    const r = new Rectangle(0, 0, 4, 3);
    expect(r.area()).toBe(12);
  });
});