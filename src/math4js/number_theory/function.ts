/**
 * 數論基礎函數
 *
 * GCD, LCM, 質數, 質因數分解, 歐拉函數, 模運算, 費波那契
 */

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const sqrt = Math.sqrt(n);
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function primesUpTo(n: number): number[] {
  if (n < 2) return [];
  const isPrimeArr = new Array(n + 1).fill(true);
  isPrimeArr[0] = isPrimeArr[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrimeArr[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrimeArr[j] = false;
      }
    }
  }
  const result: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrimeArr[i]) result.push(i);
  }
  return result;
}

export function primeFactors(n: number): number[] {
  if (n < 2) return [];
  const factors: number[] = [];
  let d = 2;
  let temp = Math.abs(n);
  while (d * d <= temp) {
    while (temp % d === 0) {
      factors.push(d);
      temp /= d;
    }
    d++;
  }
  if (temp > 1) factors.push(temp);
  return factors;
}

export function eulerPhi(n: number): number {
  if (n < 1) return 0;
  let result = n;
  const pf = primeFactors(n);
  const unique = [...new Set(pf)];
  for (const p of unique) {
    result = result * (p - 1) / p;
  }
  return result;
}

export function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let result = 1;
  base = ((base % mod) + mod) % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return result;
}

export function modInv(a: number, m: number): number {
  const g = gcd(a, m);
  if (g !== 1) throw new Error('Modular inverse does not exist');
  let x = 1, y = 0;
  let a1 = a, b1 = m;
  while (b1 !== 0) {
    const q = Math.floor(a1 / b1);
    const r = a1 - q * b1;
    a1 = b1;
    b1 = r;
    const xNew = x - q * y;
    x = y;
    y = xNew;
  }
  return ((x % m) + m) % m;
}

export function fibonacci(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  if (n === 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

export function factorial(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n - k) k = n - k;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

export function isCoprime(a: number, b: number): boolean {
  return gcd(Math.abs(a), Math.abs(b)) === 1;
}