declare module 'jstat' {
  const jstat: {
    normal: {
      pdf(x: number, mean?: number, sd?: number): number;
      cdf(x: number, mean?: number, sd?: number): number;
      inv(p: number, mean?: number, sd?: number): number;
      sample(df: number): number;
    };
    studentt: {
      pdf(x: number, df: number): number;
      cdf(x: number, df: number): number;
      inv(p: number, df: number): number;
      sample(df: number): number;
    };
    chisquare: {
      pdf(x: number, df: number): number;
      cdf(x: number, df: number): number;
      inv(p: number, df: number): number;
      sample(df: number): number;
    };
    centralF: {
      pdf(x: number, df1: number, df2: number): number;
      cdf(x: number, df1: number, df2: number): number;
      inv(p: number, df1: number, df2: number): number;
      sample(df1: number, df2: number): number;
    };
    binomial: {
      pdf(k: number, n: number, p: number): number;
      cdf(k: number, n: number, p: number): number;
    };
    poisson: {
      pdf(k: number, lambda: number): number;
      cdf(k: number, lambda: number): number;
      new (lambda: number): { sample(): number };
    };
    combination(n: number, k: number): number;
  };
  export default jstat;
}

declare module 'numeric' {
  function transpose(A: number[][]): number[][];
  function inv(A: number[][]): number[][];
  function det(A: number[][]): number;
  function dot(A: number[][], B: number[][]): number[][];
  function add(A: number[][], B: number[][] | number): number[][];
  function sub(A: number[][], B: number[][] | number): number[][];
  function mul(A: number[][], B: number[][] | number): number[][];
  function identity(n: number): number[][];
  function rep(shape: [number, number], value: number): number[][];
  function prettyPrint(A: number[][]): string;
  function norminf(A: number[][]): number;
  function solve(A: number[][], b: number[][]): number[][];
  function eig(A: number[][]): { lambda: { x: number[] }; E: { x: number[][] } };
  function svd(A: number[][]): { U: number[][]; S: number[]; V: number[][] };
  const version: string;
  export default {
    transpose,
    inv,
    det,
    dot,
    add,
    sub,
    mul,
    identity,
    rep,
    prettyPrint,
    norminf,
    solve,
    eig,
    svd,
    version,
  };
  export {
    transpose,
    inv,
    det,
    dot,
    add,
    sub,
    mul,
    identity,
    rep,
    prettyPrint,
    norminf,
    solve,
    eig,
    svd,
    version,
  };
}
