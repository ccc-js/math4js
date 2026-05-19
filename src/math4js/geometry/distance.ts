/**
 * 距離計算
 *
 * Point to point, point to line, point to plane, etc.
 */

import { Point2D, Point3D } from './point.js';
import { Circle } from './circle.js';
import { Sphere } from './sphere.js';
import { Line2D } from './line.js';
import { Plane } from './plane.js';

export function pointToPoint2D(p1: Point2D, p2: Point2D): number {
  return p1.distance(p2);
}

export function pointToPoint3D(p1: Point3D, p2: Point3D): number {
  return p1.distance(p2);
}

export function pointToLine(p: Point2D, line: Line2D): number {
  return line.distanceTo(p);
}

export function pointToPlane(p: Point3D, plane: Plane): number {
  return plane.distanceTo(p);
}

export function pointToCircle(p: Point2D, circle: Circle): number {
  return Math.abs(circle.center.distance(p) - circle.radius);
}

export function pointToSphere(p: Point3D, sphere: Sphere): number {
  return Math.abs(sphere.center.distance(p) - sphere.radius);
}

export function lineToLine(l1: Line2D, l2: Line2D): number | null {
  const intersection = l1.intersect(l2);
  if (intersection) return 0;
  return l1.distanceTo(l2.p1);
}

export function pointToPolygon(p: Point2D, vertices: Point2D[]): number {
  let minDist = Infinity;
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % n];
    const dist = pointToLineSegment(p, v1, v2);
    minDist = Math.min(minDist, dist);
  }
  return minDist;
}

function pointToLineSegment(p: Point2D, v1: Point2D, v2: Point2D): number {
  const l2 = v1.distance(v2) ** 2;
  if (l2 === 0) return p.distance(v1);
  let t = ((p.x - v1.x) * (v2.x - v1.x) + (p.y - v1.y) * (v2.y - v1.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const proj = new Point2D(v1.x + t * (v2.x - v1.x), v1.y + t * (v2.y - v1.y));
  return p.distance(proj);
}