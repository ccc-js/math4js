/**
 * 圓與弧類別
 *
 * Circle, Arc in 2D
 */

import { Point2D } from './point.js';
import { Line2D } from './line.js';

export class Circle {
  constructor(public center: Point2D, public radius: number) {}

  area(): number {
    return Math.PI * this.radius * this.radius;
  }

  circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  containsPoint(p: Point2D): boolean {
    return this.center.distance(p) <= this.radius + 1e-10;
  }

  tangent(p: Point2D): Line2D | null {
    const dist = this.center.distance(p);
    if (Math.abs(dist - this.radius) > 1e-10) return null;
    const dx = p.x - this.center.x;
    const dy = p.y - this.center.y;
    return new Line2D(p, new Point2D(p.x - dy, p.y + dx));
  }
}

export class Arc {
  constructor(
    public center: Point2D,
    public radius: number,
    public startAngle: number,
    public endAngle: number
  ) {}

  length(): number {
    const dAngle = this.endAngle - this.startAngle;
    return this.radius * Math.abs(dAngle);
  }

  area(): number {
    const dAngle = this.endAngle - this.startAngle;
    return (this.radius * this.radius * Math.abs(dAngle)) / 2;
  }

  point(angle: number): Point2D {
    return new Point2D(
      this.center.x + this.radius * Math.cos(angle),
      this.center.y + this.radius * Math.sin(angle)
    );
  }

  containsPoint(p: Point2D): boolean {
    const dist = this.center.distance(p);
    if (dist > this.radius + 1e-10) return false;
    const angle = Math.atan2(p.y - this.center.y, p.x - this.center.x);
    return angle >= this.startAngle && angle <= this.endAngle;
  }
}