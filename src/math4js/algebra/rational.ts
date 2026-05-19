/**
 * 有理數（分數）類別
 *
 * 自動約分，支援四則運算
 */

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export class Rational {
  private _num: number;
  private _den: number;

  constructor(num: number, den: number = 1) {
    if (den === 0) throw new Error('Denominator cannot be zero');
    const g = gcd(num, den);
    const sign = den < 0 ? -1 : 1;
    this._num = sign * num / g;
    this._den = sign * den / g;
  }

  get num(): number {
    return this._num;
  }

  get den(): number {
    return this._den;
  }

  add(other: Rational): Rational {
    return new Rational(
      this._num * other._den + other._num * this._den,
      this._den * other._den
    );
  }

  sub(other: Rational): Rational {
    return new Rational(
      this._num * other._den - other._num * this._den,
      this._den * other._den
    );
  }

  mul(other: Rational): Rational {
    return new Rational(this._num * other._num, this._den * other._den);
  }

  div(other: Rational): Rational {
    if (other._num === 0) throw new Error('Cannot divide by zero');
    return new Rational(this._num * other._den, this._den * other._num);
  }

  simplify(): Rational {
    const g = gcd(this._num, this._den);
    const sign = this._den < 0 ? -1 : 1;
    return new Rational(sign * this._num / g, sign * this._den / g);
  }

  toNumber(): number {
    return this._num / this._den;
  }

  equals(other: Rational): boolean {
    return this._num === other._num && this._den === other._den;
  }

  toString(): string {
    return this._den === 1 ? `${this._num}` : `${this._num}/${this._den}`;
  }

  valueOf(): number {
    return this.toNumber();
  }
}

export function parseRational(str: string): Rational {
  const parts = str.trim().split('/');
  if (parts.length === 1) {
    return new Rational(parseInt(parts[0], 10));
  }
  return new Rational(parseInt(parts[0], 10), parseInt(parts[1], 10));
}