/**
 * Calculus Module
 *
 * 微分、積分、多變數微積分、數列級數、泰勒展開、優化
 */

export {
  derivative,
  secondDerivative,
  partial,
  gradient,
  jacobian,
  directionalDerivative,
} from './derivative.js';

export {
  trapezoid,
  simpson,
  romberg,
  adaptive,
  monteCarlo,
  gaussLegendre,
} from './integral.js';

export {
  grad,
  divergence,
  curl2D,
  curl3D,
  laplacian,
  hessian,
} from './multivariable.js';

export {
  sequence,
  series,
  converge,
  limit,
  infiniteSeries,
  alternatingSeries,
} from './sequence.js';

export {
  taylor,
  maclaurin,
  seriesSum,
  powerSeriesCoeffs,
} from './taylor.js';

export {
  goldenSection,
  gradientDescent,
  newtonMethod,
  conjugateGradient,
  momentumGradientDescent,
} from './optimize.js';