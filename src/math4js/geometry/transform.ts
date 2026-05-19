/**
 * 幾何變換
 *
 * Translate, Rotate, Scale, Reflect
 */

import { Point2D, Point3D } from './point.js';
import { Vec2, Vec3 } from './vector.js';

export function translate2D(p: Point2D, v: Vec2): Point2D {
  return new Point2D(p.x + v.x, p.y + v.y);
}

export function translate3D(p: Point3D, v: Vec3): Point3D {
  return new Point3D(p.x + v.x, p.y + v.y, p.z + v.z);
}

export function rotate2D(p: Point2D, angle: number, center?: Point2D): Point2D {
  const c = center || new Point2D(0, 0);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return new Point2D(
    c.x + dx * cos - dy * sin,
    c.y + dx * sin + dy * cos
  );
}

export function rotate3D(
  p: Point3D,
  axis: 'x' | 'y' | 'z',
  angle: number,
  center?: Point3D
): Point3D {
  const c = center || new Point3D(0, 0, 0);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  const dz = p.z - c.z;

  let nx: number, ny: number, nz: number;
  switch (axis) {
    case 'x':
      nx = dx;
      ny = dy * cos - dz * sin;
      nz = dy * sin + dz * cos;
      break;
    case 'y':
      nx = dx * cos + dz * sin;
      ny = dy;
      nz = -dx * sin + dz * cos;
      break;
    case 'z':
      nx = dx * cos - dy * sin;
      ny = dx * sin + dy * cos;
      nz = dz;
      break;
  }
  return new Point3D(c.x + nx, c.y + ny, c.z + nz);
}

export function scale2D(p: Point2D, factor: number, center?: Point2D): Point2D {
  const c = center || new Point2D(0, 0);
  return new Point2D(c.x + factor * (p.x - c.x), c.y + factor * (p.y - c.y));
}

export function scale3D(p: Point3D, factor: number, center?: Point3D): Point3D {
  const c = center || new Point3D(0, 0, 0);
  return new Point3D(
    c.x + factor * (p.x - c.x),
    c.y + factor * (p.y - c.y),
    c.z + factor * (p.z - c.z)
  );
}

export function reflect2D(p: Point2D, axis: 'x' | 'y'): Point2D {
  if (axis === 'x') return new Point2D(p.x, -p.y);
  return new Point2D(-p.x, p.y);
}

export function reflect3D(p: Point3D, plane: 'xy' | 'yz' | 'xz'): Point3D {
  switch (plane) {
    case 'xy': return new Point3D(p.x, p.y, -p.z);
    case 'yz': return new Point3D(-p.x, p.y, p.z);
    case 'xz': return new Point3D(p.x, -p.y, p.z);
  }
}

export function transformMatrix(
  points: Point2D[],
  matrix: number[][]
): Point2D[] {
  return points.map(p => {
    const x = matrix[0][0] * p.x + matrix[0][1] * p.y + matrix[0][2];
    const y = matrix[1][0] * p.x + matrix[1][1] * p.y + matrix[1][2];
    return new Point2D(x, y);
  });
}

export function rotationMatrix2D(angle: number): number[][] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
}