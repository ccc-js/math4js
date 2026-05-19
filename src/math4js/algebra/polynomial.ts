/**
 * 多項式類別
 *
 * 係數陣列 [a0, a1, a2, ...] 表示 a0 + a1*x + a2*x^2 + ...
 */

export class Polynomial {
  private _coeffs: number[];

  constructor(coeffs: number[]) {
    this._coeffs = [...coeffs];
    this._trim();
  }

  private _trim(): void {
    while (this._coeffs.length > 1 && this._coeffs[this._coeffs.length - 1] === 0) {
      this._coeffs.pop();
    }
  }

  coeffs(): number[] {
    return [...this._coeffs];
  }

  degree(): number {
    return Math.max(0, this._coeffs.length - 1);
  }

  eval(x: number): number {
    let result = 0;
    for (let i = this._coeffs.length - 1; i >= 0; i--) {
      result = result * x + this._coeffs[i];
    }
    return result;
  }

  add(other: Polynomial): Polynomial {
    const maxLen = Math.max(this._coeffs.length, other._coeffs.length);
    const result: number[] = [];
    for (let i = 0; i < maxLen; i++) {
      const a = this._coeffs[i] || 0;
      const b = other._coeffs[i] || 0;
      result.push(a + b);
    }
    return new Polynomial(result);
  }

  sub(other: Polynomial): Polynomial {
    const maxLen = Math.max(this._coeffs.length, other._coeffs.length);
    const result: number[] = [];
    for (let i = 0; i < maxLen; i++) {
      const a = this._coeffs[i] || 0;
      const b = other._coeffs[i] || 0;
      result.push(a - b);
    }
    return new Polynomial(result);
  }

  mul(other: Polynomial): Polynomial {
    if (this._coeffs.length === 0 || other._coeffs.length === 0) {
      return new Polynomial([0]);
    }
    const result: number[] = new Array(this._coeffs.length + other._coeffs.length - 1).fill(0);
    for (let i = 0; i < this._coeffs.length; i++) {
      for (let j = 0; j < other._coeffs.length; j++) {
        result[i + j] += this._coeffs[i] * other._coeffs[j];
      }
    }
    return new Polynomial(result);
  }

  scalarMul(s: number): Polynomial {
    return new Polynomial(this._coeffs.map(c => c * s));
  }

  derivative(): Polynomial {
    if (this._coeffs.length <= 1) return new Polynomial([0]);
    const result: number[] = [];
    for (let i = 1; i < this._coeffs.length; i++) {
      result.push(i * this._coeffs[i]);
    }
    return new Polynomial(result);
  }

  integral(c: number = 0): Polynomial {
    const result: number[] = [c];
    for (let i = 0; i < this._coeffs.length; i++) {
      result.push(this._coeffs[i] / (i + 1));
    }
    return new Polynomial(result);
  }

  compose(other: Polynomial): Polynomial {
    let result = new Polynomial([0]);
    for (let i = this._coeffs.length - 1; i >= 0; i--) {
      result = result.mul(other);
      result = result.add(new Polynomial([this._coeffs[i]]));
    }
    return result;
  }

  divide(d: Polynomial): { quotient: Polynomial; remainder: Polynomial } {
    if (d.degree() < 0) throw new Error('Cannot divide by zero polynomial');
    let remainder = new Polynomial(this._coeffs);
    const divisorDeg = d.degree();
    const divisorLead = d._coeffs[divisorDeg];
    const quotientCoeffs: number[] = new Array(Math.max(0, this.degree() - divisorDeg + 1)).fill(0);

    while (remainder.degree() >= divisorDeg && remainder.degree() > 0) {
      const degDiff = remainder.degree() - divisorDeg;
      const leadCoeff = remainder._coeffs[remainder.degree()] / divisorLead;
      quotientCoeffs[degDiff] = leadCoeff;
      const term = new Polynomial([...new Array(degDiff).fill(0), leadCoeff]);
      remainder = remainder.sub(term.mul(d));
    }

    return { quotient: new Polynomial(quotientCoeffs), remainder };
  }

  mod(d: Polynomial): Polynomial {
    return this.divide(d).remainder;
  }

  gcd(other: Polynomial): Polynomial {
    let a = new Polynomial(this._coeffs);
    let b = new Polynomial(other._coeffs);
    while (b.degree() > 0 || (b._coeffs.length > 0 && b._coeffs[0] !== 0)) {
      const r = a.mod(b);
      a = b;
      b = r;
    }
    const lead = a._coeffs[a.degree()];
    if (lead !== 1 && lead !== -1) {
      return a.scalarMul(1 / lead);
    }
    return a;
  }

  equals(other: Polynomial): boolean {
    if (this.degree() !== other.degree()) return false;
    for (let i = 0; i <= this.degree(); i++) {
      if (Math.abs(this._coeffs[i] - other._coeffs[i]) > 1e-10) return false;
    }
    return true;
  }

  toString(): string {
    if (this._coeffs.length === 0) return '0';
    const terms: string[] = [];
    for (let i = this.degree(); i >= 0; i--) {
      const c = this._coeffs[i];
      if (c === 0) continue;
      if (i === 0) {
        terms.push(`${c}`);
      } else if (i === 1) {
        terms.push(c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`);
      } else {
        terms.push(c === 1 ? `x^${i}` : c === -1 ? `-x^${i}` : `${c}x^${i}`);
      }
    }
    return terms.length === 0 ? '0' : terms.join(' + ').replace(/\+ -/g, '- ');
  }
}

export function horner(coeffs: number[], x: number): number {
  let result = coeffs[coeffs.length - 1];
  for (let i = coeffs.length - 2; i >= 0; i--) {
    result = result * x + coeffs[i];
  }
  return result;
}