/**
 * 球面類別
 *
 * Sphere, SphereSection in 3D
 */

import { Point3D, Point2D } from './point.js';
import { Vec3 } from './vector.js';

export class Sphere {
  constructor(public center: Point3D, public radius: number) {}

  area(): number {
    return 4 * Math.PI * this.radius * this.radius;
  }

  volume(): number {
    return (4 / 3) * Math.PI * this.radius * this.radius * this.radius;
  }

  containsPoint(p: Point3D): boolean {
    return this.center.distance(p) <= this.radius + 1e-10;
  }

  intersect(
    origin: { x: number; y: number; z: number },
    direction: Vec3
  ): { t1: number; t2: number } | null {
    const oc = new Vec3(
      origin.x - this.center.x,
      origin.y - this.center.y,
      origin.z - this.center.z
    );
    const a = direction.dot(direction);
    const b = 2 * oc.dot(direction);
    const c = oc.dot(oc) - this.radius * this.radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return null;
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    return { t1, t2 };
  }

  normal(p: Point3D): Vec3 {
    return new Vec3(
      p.x - this.center.x,
      p.y - this.center.y,
      p.z - this.center.z
    ).normalize();
  }
}

export class SphereSection {
  constructor(
    public center: Point3D,
    public radius: number,
    public theta1: number,
    public theta2: number,
    public phi1: number = 0,
    public phi2: number = 2 * Math.PI
  ) {}

  area(): number {
    const dTheta = this.theta2 - this.theta1;
    const dPhi = this.phi2 - this.phi1;
    return this.radius * this.radius * dTheta * dPhi;
  }

  volume(): number {
    const dTheta = this.theta2 - this.theta1;
    const dPhi = this.phi2 - this.phi1;
    return (this.radius ** 3 * dTheta * dPhi) / 3;
  }

  point(theta: number, phi: number): Point3D {
    return new Point3D(
      this.center.x + this.radius * Math.sin(theta) * Math.cos(phi),
      this.center.y + this.radius * Math.sin(theta) * Math.sin(phi),
      this.center.z + this.radius * Math.cos(theta)
    );
  }
}