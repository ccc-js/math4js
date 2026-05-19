import * as statistics from './statistics/index.js';

export default statistics;
export const R = statistics;
export {
  mean as stats_mean,
  median,
  variance,
  sd,
  covariance,
  correlation,
  quantile,
  iqr,
  z_score,
  standardize,
  summary,
  min_val,
  max_val,
  range_stat,
  sum_stat,
} from './statistics/index.js';
export { setSeed, getSeed, resetSeed, random, randInt, setSeedString, mix, stringToSeeds, randomBatch, randIntBatch } from './statistics/index.js';
export { z_test, t_test, t_test_two, t_test_paired, chisq_test, anova } from './statistics/index.js';
export { entropy, cross_entropy, kl_divergence, mutual_information, conditional_entropy, pmi } from './statistics/index.js';
export { conf_interval, conf_interval_proportion, bootstrap_ci, conf_interval_variance } from './statistics/index.js';
export { central_limit_theorem, law_of_large_numbers, chebyshev_inequality, chebyshev_verify, markov_inequality, markov_verify, bernoulli_verify, bayes_theorem, bayes_verify, information_entropy, information_entropy_verify, mutual_information as mi_theorem } from './statistics/index.js';
export { dnorm, pnorm, qnorm, rnorm, dt, pt, qt, rt, dchisq, pchisq, qchisq, rchisq, df, pf, qf, rf, dbinom, pbinom, qbinom, rbinom, dpois, ppois, qpois, rpois } from './statistics/index.js';

export * from './linear_algebra/index.js';

export {
  ndarray,
  zeros,
  ones,
  full,
  eye,
  identity,
  diag,
  arange,
  linspace,
  array,
  fromFlat,
  concatenate,
  vstack,
  hstack,
} from './ndarray/index.js';
export * from './ndarray/operations.js';
export { rand, randn, randint, choice, shuffle } from './ndarray/random.js';
export type { Dtype, Slice } from './ndarray/core.js';

export * from './algebra/index.js';
export * from './geometry/index.js';

export {
  derivative,
  secondDerivative,
  partial,
  gradient,
  jacobian,
  directionalDerivative,
} from './calculus/derivative.js';
export {
  trapezoid,
  simpson,
  romberg,
  adaptive,
  monteCarlo,
  gaussLegendre,
} from './calculus/integral.js';
export {
  grad,
  divergence,
  curl2D,
  curl3D,
  laplacian,
  hessian,
} from './calculus/multivariable.js';
export {
  sequence,
  series,
  converge,
  limit,
  infiniteSeries,
  alternatingSeries,
} from './calculus/sequence.js';
export {
  taylor,
  maclaurin,
  seriesSum,
  powerSeriesCoeffs,
} from './calculus/taylor.js';
export {
  goldenSection,
  gradientDescent as calc_gradientDescent,
  newtonMethod as calc_newtonMethod,
  conjugateGradient as calc_conjugateGradient,
  momentumGradientDescent as calc_momentumGradientDescent,
} from './calculus/optimize.js';

export * from './number_theory/index.js';
export * from './optimization/index.js';
export * from './plot/rplot.js';
