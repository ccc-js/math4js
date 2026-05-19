/**
 * 多邊形類別
 *
 * Polygon, Triangle, Rectangle in 2D
 */

import { Point2D } from './point.js';

export class Polygon {
  constructor(public vertices: Point2D[]) {
    if (vertices.length < 3) throw new Error('Polygon must have at least 3 vertices');
  }

  area(): number {
    let sum = 0;
    const n = this.vertices.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      sum += this.vertices[i].x * this.vertices[j].y;
      sum -= this.vertices[j].x * this.vertices[i].y;
    }
    return Math.abs(sum) / 2;
  }

  perimeter(): number {
    let sum = 0;
    const n = this.vertices.length;
    for (let i = 0; i < n; i++) {
      sum += this.vertices[i].distance(this.vertices[(i + 1) % n]);
    }
    return sum;
  }

  centroid(): Point2D {
    let x = 0, y = 0;
    for (const v of this.vertices) {
      x += v.x;
      y += v.y;
    }
    return new Point2D(x / this.vertices.length, y / this.vertices.length);
  }

  containsPoint(p: Point2D): boolean {
    let inside = false;
    const n = this.vertices.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = this.vertices[i].x, yi = this.vertices[i].y;
      const xj = this.vertices[j].x, yj = this.vertices[j].y;
      if (
        yi > p.y !== yj > p.y &&
        p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
    }
    return inside;
  }
}

export class Triangle extends Polygon {
  constructor(p1: Point2D, p2: Point2D, p3: Point2D) {
    super([p1, p2, p3]);
  }
}

export class Rectangle extends Polygon {
  constructor(x: number, y: number, width: number, height: number) {
    super([
      new Point2D(x, y),
      new Point2D(x + width, y),
      new Point2D(x + width, y + height),
      new Point2D(x, y + height),
    ]);
  }

  get width(): number {
    return this.vertices[2].x - this.vertices[0].x;
  }

  get height(): number {
    return this.vertices[2].y - this.vertices[0].y;
  }
}

export class RegularPolygon extends Polygon {
  constructor(center: Point2D, radius: number, sides: number) {
    const vertices: Point2D[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (2 * Math.PI * i) / sides;
      vertices.push(new Point2D(
        center.x + radius * Math.cos(angle),
        center.y + radius * Math.sin(angle)
      ));
    }
    super(vertices);
  }
}