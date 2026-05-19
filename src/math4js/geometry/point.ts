/**
 * 點類別
 *
 * 支援 1D, 2D, 3D, nD 座標點
 */

export class Point1D {
  constructor(public x: number) {}
  distance(other: Point1D): number {
    return Math.abs(this.x - other.x);
  }
  midpoint(other: Point1D): Point1D {
    return new Point1D((this.x + other.x) / 2);
  }
  translate(v: number): Point1D {
    return new Point1D(this.x + v);
  }
  scale(factor: number): Point1D {
    return new Point1D(this.x * factor);
  }
  toArray(): number[] {
    return [this.x];
  }
  toString(): string {
    return `${this.x}`;
  }
}

export class Point2D {
  constructor(public x: number, public y: number) {}
  distance(other: Point2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  midpoint(other: Point2D): Point2D {
    return new Point2D((this.x + other.x) / 2, (this.y + other.y) / 2);
  }
  translate(v: [number, number]): Point2D {
    return new Point2D(this.x + v[0], this.y + v[1]);
  }
  scale(factor: number): Point2D {
    return new Point2D(this.x * factor, this.y * factor);
  }
  toArray(): number[] {
    return [this.x, this.y];
  }
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

export class Point3D {
  constructor(public x: number, public y: number, public z: number) {}
  distance(other: Point3D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  midpoint(other: Point3D): Point3D {
    return new Point3D(
      (this.x + other.x) / 2,
      (this.y + other.y) / 2,
      (this.z + other.z) / 2
    );
  }
  translate(v: [number, number, number]): Point3D {
    return new Point3D(this.x + v[0], this.y + v[1], this.z + v[2]);
  }
  scale(factor: number): Point3D {
    return new Point3D(this.x * factor, this.y * factor, this.z * factor);
  }
  toArray(): number[] {
    return [this.x, this.y, this.z];
  }
  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export class PointND {
  constructor(public coords: number[]) {}

  static fromArray(arr: number[]): PointND {
    return new PointND([...arr]);
  }

  distance(other: PointND): number {
    let sum = 0;
    for (let i = 0; i < this.coords.length; i++) {
      const d = this.coords[i] - other.coords[i];
      sum += d * d;
    }
    return Math.sqrt(sum);
  }

  midpoint(other: PointND): PointND {
    const result = this.coords.map((c, i) => (c + other.coords[i]) / 2);
    return new PointND(result);
  }

  translate(v: number[]): PointND {
    const result = this.coords.map((c, i) => c + (v[i] || 0));
    return new PointND(result);
  }

  scale(factor: number): PointND {
    return new PointND(this.coords.map(c => c * factor));
  }

  get dim(): number {
    return this.coords.length;
  }

  toArray(): number[] {
    return [...this.coords];
  }

  toString(): string {
    return `(${this.coords.join(', ')})`;
  }
}