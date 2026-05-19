/**
 * 直線類別
 *
 * Line2D, Line3D, Ray, Segment
 */

import { Point2D } from './point.js';
import { Vec2, Vec3 } from './vector.js';

export class Line2D {
  constructor(public p1: Point2D, public p2: Point2D) {}

  containsPoint(p: Point2D): boolean {
    const v1 = [this.p2.x - this.p1.x, this.p2.y - this.p1.y];
    const v2 = [p.x - this.p1.x, p.y - this.p1.y];
    const cross = v1[0] * v2[1] - v1[1] * v2[0];
    return Math.abs(cross) < 1e-10;
  }

  distanceTo(p: Point2D): number {
    const A = this.p2.y - this.p1.y;
    const B = this.p1.x - this.p2.x;
    const C = -A * this.p1.x - B * this.p1.y;
    return Math.abs(A * p.x + B * p.y + C) / Math.sqrt(A * A + B * B);
  }

  intersect(other: Line2D): Point2D | null {
    const x1 = this.p1.x, y1 = this.p1.y;
    const x2 = this.p2.x, y2 = this.p2.y;
    const x3 = other.p1.x, y3 = other.p1.y;
    const x4 = other.p2.x, y4 = other.p2.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 1e-10) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    return new Point2D(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
  }

  direction(): Vec2 {
    return new Vec2(this.p2.x - this.p1.x, this.p2.y - this.p1.y);
  }
}

export class Line3D {
  constructor(public p1: { x: number; y: number; z: number }, public p2: { x: number; y: number; z: number }) {}

  direction(): Vec3 {
    return new Vec3(
      this.p2.x - this.p1.x,
      this.p2.y - this.p1.y,
      this.p2.z - this.p1.z
    );
  }

  distanceToPoint(p: { x: number; y: number; z: number }): number {
    const d = this.direction();
    const v = new Vec3(p.x - this.p1.x, p.y - this.p1.y, p.z - this.p1.z);
    const cross = d.cross(new Vec3(v.x, v.y, v.z));
    return cross.length() / d.length();
  }
}

export class Ray {
  constructor(public origin: Point2D, public direction: Vec2) {}

  point(t: number): Point2D {
    return new Point2D(
      this.origin.x + t * this.direction.x,
      this.origin.y + t * this.direction.y
    );
  }

  intersectCircle(center: Point2D, radius: number): { t1: number; t2: number } | null {
    const oc = new Vec2(center.x - this.origin.x, center.y - this.origin.y);
    const a = this.direction.dot(this.direction);
    const b = 2 * oc.dot(this.direction);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return null;
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    return { t1, t2 };
  }
}

export class Segment {
  constructor(public p1: Point2D, public p2: Point2D) {}

  length(): number {
    return this.p1.distance(this.p2);
  }

  containsPoint(p: Point2D): boolean {
    const d1 = this.p1.distance(p);
    const d2 = this.p2.distance(p);
    const total = this.length();
    return Math.abs(d1 + d2 - total) < 1e-10;
  }

  midpoint(): Point2D {
    return this.p1.midpoint(this.p2);
  }
}