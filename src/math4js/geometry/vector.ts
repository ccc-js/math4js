/**
 * 幾何向量類別
 *
 * Vec2, Vec3, Vec (nD)
 */

export class Vec2 {
  constructor(public x: number, public y: number) {}

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec2): number {
    return this.x * v.y - this.y * v.x;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vec2 {
    const len = this.length();
    if (len === 0) return new Vec2(0, 0);
    return new Vec2(this.x / len, this.y / len);
  }

  project(v: Vec2): Vec2 {
    const dot = this.dot(v);
    const lenSq = v.length() ** 2;
    if (lenSq === 0) return new Vec2(0, 0);
    const t = dot / lenSq;
    return v.mul(t);
  }

  reflect(normal: Vec2): Vec2 {
    const n = normal.normalize();
    const dot = this.dot(n);
    return this.sub(n.mul(2 * dot));
  }

  toArray(): number[] {
    return [this.x, this.y];
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

export class Vec3 {
  constructor(public x: number, public y: number, public z: number) {}

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  mul(s: number): Vec3 {
    return new Vec3(this.x * s, this.y * s, this.z * s);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vec3 {
    const len = this.length();
    if (len === 0) return new Vec3(0, 0, 0);
    return new Vec3(this.x / len, this.y / len, this.z / len);
  }

  project(v: Vec3): Vec3 {
    const dot = this.dot(v);
    const lenSq = v.length() ** 2;
    if (lenSq === 0) return new Vec3(0, 0, 0);
    const t = dot / lenSq;
    return v.mul(t);
  }

  reflect(normal: Vec3): Vec3 {
    const n = normal.normalize();
    const dot = this.dot(n);
    return this.sub(n.mul(2 * dot));
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export class Vec {
  constructor(public coords: number[]) {}

  static fromArray(arr: number[]): Vec {
    return new Vec([...arr]);
  }

  add(v: Vec): Vec {
    const result = this.coords.map((c, i) => c + v.coords[i]);
    return new Vec(result);
  }

  sub(v: Vec): Vec {
    const result = this.coords.map((c, i) => c - v.coords[i]);
    return new Vec(result);
  }

  mul(s: number): Vec {
    return new Vec(this.coords.map(c => c * s));
  }

  dot(v: Vec): number {
    return this.coords.reduce((sum, c, i) => sum + c * v.coords[i], 0);
  }

  length(): number {
    return Math.sqrt(this.dot(this));
  }

  normalize(): Vec {
    const len = this.length();
    if (len === 0) return new Vec(this.coords.map(() => 0));
    return this.mul(1 / len);
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