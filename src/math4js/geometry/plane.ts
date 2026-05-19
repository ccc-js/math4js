/**
 * 平面類別
 *
 * Plane in 3D space
 */

import { Point3D, Point2D } from './point.js';
import { Vec3 } from './vector.js';

export class Plane {
  constructor(public normal: Vec3, public point: { x: number; y: number; z: number }) {}

  static fromPoints(p1: Point3D, p2: Point3D, p3: Point3D): Plane {
    const v1 = new Vec3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    const v2 = new Vec3(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);
    const normal = v1.cross(v2).normalize();
    return new Plane(normal, p1);
  }

  distanceTo(point: Point3D): number {
    const v = new Vec3(point.x - this.point.x, point.y - this.point.y, point.z - this.point.z);
    return Math.abs(v.dot(this.normal));
  }

  containsPoint(p: Point3D): boolean {
    return this.distanceTo(p) < 1e-10;
  }

  intersectLine(
    p1: { x: number; y: number; z: number },
    p2: { x: number; y: number; z: number }
  ): Point3D | null {
    const d = new Vec3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    const denom = this.normal.dot(d);
    if (Math.abs(denom) < 1e-10) return null;

    const v = new Vec3(this.point.x - p1.x, this.point.y - p1.y, this.point.z - p1.z);
    const t = v.dot(this.normal) / denom;

    if (t < 0 || t > 1) return null;

    return new Point3D(
      p1.x + t * d.x,
      p1.y + t * d.y,
      p1.z + t * d.z
    );
  }

  project(point: Point3D): Point3D {
    const v = new Vec3(point.x - this.point.x, point.y - this.point.y, point.z - this.point.z);
    const dist = v.dot(this.normal);
    const proj = v.sub(this.normal.mul(dist));
    return new Point3D(
      this.point.x + proj.x,
      this.point.y + proj.y,
      this.point.z + proj.z
    );
  }

  toString(): string {
    const n = this.normal;
    const d = -(n.x * this.point.x + n.y * this.point.y + n.z * this.point.z);
    return `${n.x.toFixed(2)}x + ${n.y.toFixed(2)}y + ${n.z.toFixed(2)}z + ${d.toFixed(2)} = 0`;
  }
}