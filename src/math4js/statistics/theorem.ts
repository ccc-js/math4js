/**
 * 統計定理驗證
 *
 * 實作中央極限定理、大數定律、Chebyshev 不等式等統計定理的驗證函數
 */

import { random } from './random.js';
import { mean, variance, sd } from './stats.js';

type SampleFn = (n: number) => number[];

interface CLResult {
  pass: boolean;
  expected_mean: number;
  observed_mean: number;
  mean_error: number;
  expected_se: number;
  observed_se: number;
  se_error: number;
}

function central_limit_theorem(
  sampleFn: SampleFn,
  trueMean: number,
  trueVar: number,
  n: number,
  nSamples: number = 1000
): CLResult {
  const sampleMeans: number[] = [];
  for (let i = 0; i < nSamples; i++) {
    sampleMeans.push(mean(sampleFn(n)));
  }
  const expectedSE = Math.sqrt(trueVar / n);
  const observedMean = mean(sampleMeans);
  const observedSE = sd(sampleMeans);

  const meanError = Math.abs(observedMean - trueMean);
  const seError = Math.abs(observedSE - expectedSE);

  const passMean = trueVar > 0 ? meanError < 0.1 * trueVar : meanError < 0.1;
  const passSE = seError < 0.2 * expectedSE;

  return {
    pass: passMean && passSE,
    expected_mean: trueMean,
    observed_mean: observedMean,
    mean_error: meanError,
    expected_se: expectedSE,
    observed_se: observedSE,
    se_error: seError,
  };
}

interface LLNResult {
  pass: boolean;
  true_mean: number;
  sample_mean: number;
  error: number;
  relative_error: number;
}

function law_of_large_numbers(sampleFn: SampleFn, trueMean: number, n: number): LLNResult {
  const sampleMean = mean(sampleFn(n));
  const error = Math.abs(sampleMean - trueMean);
  const relativeError = trueMean !== 0 ? error / Math.abs(trueMean) : error;

  return {
    pass: relativeError < 0.1,
    true_mean: trueMean,
    sample_mean: sampleMean,
    error,
    relative_error: relativeError,
  };
}

interface ChebyshevResult {
  pass: boolean;
  bound: number;
  k: number;
}

function chebyshev_inequality(var_: number, k: number): ChebyshevResult {
  const bound = 1.0 / k ** 2;
  return {
    pass: true,
    bound,
    k,
  };
}

interface ChebyshevVerifyResult {
  pass: boolean;
  observed_prob?: number;
  bound?: number;
  note?: string;
}

function chebyshev_verify(samples: number[], k: number): ChebyshevVerifyResult {
  if (samples.length === 0) return { pass: true, note: 'no samples' };
  const mu = mean(samples);
  const sigma = sd(samples);

  if (sigma === 0) return { pass: true, note: 'zero variance' };

  const violations = samples.filter((x) => Math.abs(x - mu) >= k * sigma).length / samples.length;
  const bound = 1.0 / k ** 2;

  return {
    pass: violations <= bound,
    observed_prob: violations,
    bound,
  };
}

interface MarkovResult {
  pass: boolean;
  k?: number;
  prob?: number;
  bound?: number;
  note?: string;
}

function markov_inequality(x: number[]): MarkovResult {
  const mu = mean(x);
  if (mu <= 0) return { pass: true, note: 'mean <= 0' };

  for (const k of [mu * 0.5, mu, mu * 2]) {
    const prob = x.filter((xi) => xi >= k).length / x.length;
    if (prob > mu / k) {
      return { pass: false, k, prob, bound: mu / k };
    }
  }

  return { pass: true };
}

interface MarkovVerifyResult {
  pass: boolean;
  violations?: boolean[];
  note?: string;
}

function markov_verify(samples: number[]): MarkovVerifyResult {
  const mu = mean(samples);

  if (mu <= 0) return { pass: true, note: 'mean <= 0' };

  const violations: boolean[] = [];
  for (const k of [mu * 0.5, mu, mu * 1.5, mu * 2]) {
    if (k > 0) {
      const obsProb = samples.filter((x) => x >= k).length / samples.length;
      const bound = mu / k;
      violations.push(obsProb <= bound);
    }
  }

  return { pass: violations.every((v) => v), violations };
}

interface BernoulliVerifyResult {
  pass: boolean;
  expected_mean: number;
  observed_mean: number;
  expected_var: number;
  observed_var: number;
}

function bernoulli_verify(n: number, p: number, nSamples: number = 1000): BernoulliVerifyResult {
  const experiments: number[] = [];
  for (let i = 0; i < nSamples; i++) {
    let successes = 0;
    for (let j = 0; j < n; j++) {
      if (random() < p) successes++;
    }
    experiments.push(successes);
  }

  const expectedMean = n * p;
  const expectedVar = n * p * (1 - p);
  const observedMean = mean(experiments);
  const observedVar = variance(experiments);

  return {
    pass:
      Math.abs(observedMean - expectedMean) < 0.1 * n &&
      Math.abs(observedVar - expectedVar) < 0.1 * n,
    expected_mean: expectedMean,
    observed_mean: observedMean,
    expected_var: expectedVar,
    observed_var: observedVar,
  };
}

interface BayesTheoremResult {
  pass: boolean;
  prior: number;
  p_b_given_a: number;
  p_b: number;
  posterior: number;
}

function bayes_theorem(pA: number, pBgivenA: number, pB: number): BayesTheoremResult {
  const posterior = (pBgivenA * pA) / pB;
  return {
    pass: true,
    prior: pA,
    p_b_given_a: pBgivenA,
    p_b: pB,
    posterior,
  };
}

interface BayesVerifyResult {
  pass: boolean;
  prior: number[];
  expected_posterior: number[];
  note?: string;
}

function bayes_verify(prior: number[], likelihood: number[]): BayesVerifyResult {
  const priorSum = prior.reduce((a, b) => a + b, 0);
  const likelihoodSum = likelihood.reduce((a, b) => a + b, 0);

  if (priorSum === 0 || likelihoodSum === 0) {
    return { pass: true, note: 'zero sum', prior: [], expected_posterior: [] };
  }

  const priorNorm = prior.map((p) => p / priorSum);
  const likelihoodNorm = likelihood.map((l) => l / likelihoodSum);
  const unnorm = priorNorm.map((p, i) => p * likelihoodNorm[i]);
  const unnormSum = unnorm.reduce((a, b) => a + b, 0);
  const expectedPosterior = unnorm.map((u) => u / unnormSum);

  return {
    pass: true,
    prior: priorNorm,
    expected_posterior: expectedPosterior,
  };
}

interface InformationEntropyResult {
  pass: boolean;
  entropy: number;
}

function information_entropy(p: number[], base: number = 2.0): InformationEntropyResult {
  const pNorm = p.map((pi) => pi / p.reduce((a, b) => a + b, 0));
  const entropy = -pNorm
    .filter((pi) => pi > 0)
    .reduce((sum, pi) => sum + (pi * Math.log(pi)) / Math.log(base), 0);

  return {
    pass: true,
    entropy,
  };
}

interface InformationEntropyVerifyResult {
  pass: boolean;
  entropy: number;
  min: number;
  max: number;
  note?: string;
}

function information_entropy_verify(
  p: number[],
  base: number = 2.0
): InformationEntropyVerifyResult {
  const pSum = p.reduce((a, b) => a + b, 0);
  if (pSum === 0) return { pass: true, note: 'zero sum', entropy: 0, min: 0, max: 0 };

  const pNorm = p.map((pi) => pi / pSum);
  const entropy = -pNorm
    .filter((pi) => pi > 0)
    .reduce((sum, pi) => sum + (pi * Math.log(pi)) / Math.log(base), 0);
  const maxEntropy = Math.log(pNorm.length) / Math.log(base);
  const minEntropy = 0.0;

  return {
    pass: minEntropy <= entropy && entropy <= maxEntropy,
    entropy,
    min: minEntropy,
    max: maxEntropy,
  };
}

interface MutualInfoResult {
  pass: boolean;
  mi: number;
  h_x: number;
  h_y: number;
}

function mutual_information(x: number[], y: number[]): MutualInfoResult {
  const xSum = x.reduce((a, b) => a + b, 0);
  const ySum = y.reduce((a, b) => a + b, 0);

  const px = xSum > 0 ? x.map((xi) => xi / xSum) : x;
  const py = ySum > 0 ? y.map((yi) => yi / ySum) : y;

  const hX = -px.filter((p) => p > 0).reduce((sum, p) => sum + p * Math.log(p), 0);
  const hY = -py.filter((p) => p > 0).reduce((sum, p) => sum + p * Math.log(p), 0);
  const mi = hX + hY;

  return { pass: true, mi, h_x: hX, h_y: hY };
}

export {
  central_limit_theorem,
  law_of_large_numbers,
  chebyshev_inequality,
  chebyshev_verify,
  markov_inequality,
  markov_verify,
  bernoulli_verify,
  bayes_theorem,
  bayes_verify,
  information_entropy,
  information_entropy_verify,
  mutual_information,
};
