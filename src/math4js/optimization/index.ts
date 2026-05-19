/**
 * Optimization Module
 *
 * 優化演算法：梯度下降、牛頓法、共軛梯度、爬山、模擬退火、線性規劃
 */

export {
  gradientDescent,
  newtonMethod,
  conjugateGradient,
  momentumGradientDescent,
  adam,
  backtrackingLineSearch,
  lagrangeMultiplier,
  isConvexFunction,
} from './function.js';

export {
  hillClimbing,
  hillClimbingSimple,
  randomRestartHillClimbing,
  simulatedAnnealing,
  stochasticHillClimbing,
} from './hill_climbing.js';

export {
  simplexMethod,
  solveLP,
  isFeasiblePoint,
  dualityGap,
  interiorPointMethod,
} from './linear_programming.js';

export {
  convexFirstOrderCondition,
  convexSecondOrderCondition,
  weierstrassExtremeValue,
  kktConditions,
  gradientVanishingAtOptimum,
  convexOptimalityCondition,
  descentDirectionTheorem,
  WolfeConditions,
} from './theorem.js';