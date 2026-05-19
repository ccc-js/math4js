/**
 * 向量類別測試
 */

import { Vec2, Vec3, Vec } from '../../src/math4js/geometry/vector.js';

describe('Vec2', () => {
  test('creates vector', () => {
    const v = new Vec2(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  test('adds vectors', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    const result = v1.add(v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('subtracts vectors', () => {
    const v1 = new Vec2(3, 4);
    const v2 = new Vec2(1, 2);
    const result = v1.sub(v2);
    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });

  test('multiplies by scalar', () => {
    const v = new Vec2(1, 2);
    const result = v.mul(3);
    expect(result.x).toBe(3);
    expect(result.y).toBe(6);
  });

  test('calculates dot product', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    expect(v1.dot(v2)).toBe(11);
  });

  test('calculates cross product', () => {
    const v1 = new Vec2(1, 0);
    const v2 = new Vec2(0, 1);
    expect(v1.cross(v2)).toBe(1);
  });

  test('calculates length', () => {
    const v = new Vec2(3, 4);
    expect(v.length()).toBe(5);
  });

  test('normalizes vector', () => {
    const v = new Vec2(3, 4);
    const result = v.normalize();
    expect(result.length()).toBeCloseTo(1);
  });
});

describe('Vec3', () => {
  test('creates vector', () => {
    const v = new Vec3(1, 2, 3);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
  });

  test('calculates dot product', () => {
    const v1 = new Vec3(1, 2, 3);
    const v2 = new Vec3(4, 5, 6);
    expect(v1.dot(v2)).toBe(32);
  });

  test('calculates cross product', () => {
    const v1 = new Vec3(1, 0, 0);
    const v2 = new Vec3(0, 1, 0);
    const result = v1.cross(v2);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.z).toBe(1);
  });

  test('calculates length', () => {
    const v = new Vec3(1, 2, 2);
    expect(v.length()).toBe(3);
  });
});

describe('Vec', () => {
  test('creates nD vector', () => {
    const v = new Vec([1, 2, 3, 4]);
    expect(v.dim).toBe(4);
  });

  test('calculates dot product', () => {
    const v1 = new Vec([1, 2]);
    const v2 = new Vec([3, 4]);
    expect(v1.dot(v2)).toBe(11);
  });
});