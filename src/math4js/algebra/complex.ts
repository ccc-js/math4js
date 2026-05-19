/**
 * 複數類別
 *
 * 支援四則運算、極座標、三角函數、指數對數
 */

export class Complex {
  private _re: number;
  private _im: number;

  constructor(re: number = 0, im: number = 0) {
    this._re = re;
    this._im = im;
  }

  get re(): number {
    return this._re;
  }

  get im(): number {
    return this._im;
  }

  add(other: Complex): Complex {
    return new Complex(this._re + other._re, this._im + other._im);
  }

  sub(other: Complex): Complex {
    return new Complex(this._re - other._re, this._im - other._im);
  }

  mul(other: Complex): Complex {
    return new Complex(
      this._re * other._re - this._im * other._im,
      this._re * other._im + this._im * other._re
    );
  }

  div(other: Complex): Complex {
    const denom = other._re * other._re + other._im * other._im;
    if (denom === 0) throw new Error('Cannot divide by zero');
    return new Complex(
      (this._re * other._re + this._im * other._im) / denom,
      (this._im * other._re - this._re * other._im) / denom
    );
  }

  conj(): Complex {
    return new Complex(this._re, -this._im);
  }

  abs(): number {
    return Math.sqrt(this._re * this._re + this._im * this._im);
  }

  arg(): number {
    return Math.atan2(this._im, this._re);
  }

  sqrt(): Complex {
    const r = this.abs();
    const theta = this.arg();
    const sqrtR = Math.sqrt(r);
    return new Complex(sqrtR * Math.cos(theta / 2), sqrtR * Math.sin(theta / 2));
  }

  exp(): Complex {
    const er = Math.exp(this._re);
    return new Complex(er * Math.cos(this._im), er * Math.sin(this._im));
  }

  log(): Complex {
    return new Complex(Math.log(this.abs()), this.arg());
  }

  pow(n: number): Complex {
    const r = this.abs();
    const theta = this.arg();
    const rn = Math.pow(r, n);
    return new Complex(rn * Math.cos(n * theta), rn * Math.sin(n * theta));
  }

  sin(): Complex {
    return new Complex(
      Math.sin(this._re) * Math.cosh(this._im),
      Math.cos(this._re) * Math.sinh(this._im)
    );
  }

  cos(): Complex {
    return new Complex(
      Math.cos(this._re) * Math.cosh(this._im),
      -Math.sin(this._re) * Math.sinh(this._im)
    );
  }

  tan(): Complex {
    const sin = this.sin();
    const cos = this.cos();
    return sin.div(cos);
  }

  equals(other: Complex): boolean {
    return this._re === other._re && this._im === other._im;
  }

  toString(): string {
    if (this._im === 0) return `${this._re}`;
    if (this._re === 0) return this._im === 1 ? 'i' : this._im === -1 ? '-i' : `${this._im}i`;
    const sign = this._im >= 0 ? '+' : '-';
    return `${this._re} ${sign} ${Math.abs(this._im)}i`;
  }

  valueOf(): number {
    return this._re;
  }

  toPolar(): { r: number; theta: number } {
    return { r: this.abs(), theta: this.arg() };
  }

  static fromPolar(r: number, theta: number): Complex {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  static i(): Complex {
    return new Complex(0, 1);
  }
}