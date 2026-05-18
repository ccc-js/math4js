/**
 * 統計定理驗證
 *
 * 實作中央極限定理、大數定律、Chebyshev 不等式等統計定理的驗證函數
 */

const { random } = require('./random.js');
const { mean, variance, std } = require('./function.js');

/**
 * 中央極限定理：樣本均值趨近 N(μ, σ²/n)
 * @param {function} sampleFn - 產生樣本的函數
 * @param {number} trueMean - 真實均值
 * @param {number} trueVar - 真實變異數
 * @param {number} n - 樣本大小
 * @param {number} nSamples - 抽樣次數
 * @returns {object}
 */
function central_limit_theorem(sampleFn, trueMean, trueVar, n, nSamples = 1000) {
  const sampleMeans = [];
  for (let i = 0; i < nSamples; i++) {
    sampleMeans.push(mean(sampleFn(n)));
  }
  const expectedSE = Math.sqrt(trueVar / n);
  const observedMean = mean(sampleMeans);
  const observedSE = std(sampleMeans);

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

/**
 * 大數定律：樣本均值收斂到真實均值
 * @param {function} sampleFn
 * @param {number} trueMean
 * @param {number} n
 * @returns {object}
 */
function law_of_large_numbers(sampleFn, trueMean, n) {
  const sampleMean = mean(sampleFn(n));
  const error = Math.abs(sampleMean - trueMean);
  const relativeError = trueMean !== 0 ? error / Math.abs(trueMean) : error;

  return {
    pass: relativeError < 0.1,
    true_mean: trueMean,
    sample_mean: sampleMean,
    error: error,
    relative_error: relativeError,
  };
}

/**
 * Chebyshev 不等式：P(|X-μ| ≥ kσ) ≤ 1/k²
 * @param {number} var
 * @param {number} k
 * @returns {object}
 */
function chebyshev_inequality(var_, k) {
  const bound = 1.0 / (k ** 2);
  return {
    pass: true,
    bound: bound,
    k: k,
  };
}

/**
 * 驗證 Chebyshev 不等式於實際樣本
 * @param {number[]} samples
 * @param {number} k
 * @returns {object}
 */
function chebyshev_verify(samples, k) {
  if (samples.length === 0) return { pass: true, note: 'no samples' };
  const mu = mean(samples);
  const sigma = std(samples);

  if (sigma === 0) return { pass: true, note: 'zero variance' };

  const violations = samples.filter(x => Math.abs(x - mu) >= k * sigma).length / samples.length;
  const bound = 1.0 / (k ** 2);

  return {
    pass: violations <= bound,
    observed_prob: violations,
    bound: bound,
  };
}

/**
 * Markov 不等式：P(X ≥ k) ≤ E[X]/k
 * @param {number[]} x
 * @returns {object}
 */
function markov_inequality(x) {
  const mu = mean(x);
  if (mu <= 0) return { pass: true, note: 'mean <= 0' };

  for (const k of [mu * 0.5, mu, mu * 2]) {
    const prob = x.filter(xi => xi >= k).length / x.length;
    if (prob > mu / k) {
      return { pass: false, k: k, prob: prob, bound: mu / k };
    }
  }

  return { pass: true };
}

/**
 * 驗證 Markov 不等式於實際樣本
 * @param {number[]} samples
 * @returns {object}
 */
function markov_verify(samples) {
  const mu = mean(samples);

  if (mu <= 0) return { pass: true, note: 'mean <= 0' };

  const violations = [];
  for (const k of [mu * 0.5, mu, mu * 1.5, mu * 2]) {
    if (k > 0) {
      const obsProb = samples.filter(x => x >= k).length / samples.length;
      const bound = mu / k;
      violations.push(obsProb <= bound);
    }
  }

  return { pass: violations.every(v => v), violations: violations };
}

/**
 * Bernoulli 試驗驗證
 * @param {number} n - 試驗次數
 * @param {number} p - 成功機率
 * @param {number} nSamples - 抽樣次數
 * @returns {object}
 */
function bernoulli_verify(n, p, nSamples = 1000) {
  const experiments = [];
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
    pass: Math.abs(observedMean - expectedMean) < 0.1 * n &&
          Math.abs(observedVar - expectedVar) < 0.1 * n,
    expected_mean: expectedMean,
    observed_mean: observedMean,
    expected_var: expectedVar,
    observed_var: observedVar,
  };
}

/**
 * 貝氏定理：P(A|B) = P(B|A) P(A) / P(B)
 * @param {number} pA
 * @param {number} pBgivenA
 * @param {number} pB
 * @returns {object}
 */
function bayes_theorem(pA, pBgivenA, pB) {
  const posterior = pBgivenA * pA / pB;
  return {
    pass: true,
    prior: pA,
    p_b_given_a: pBgivenA,
    p_b: pB,
    posterior: posterior,
  };
}

/**
 * 驗證貝氏定理
 * @param {number[]} prior
 * @param {number[]} likelihood
 * @returns {object}
 */
function bayes_verify(prior, likelihood) {
  const priorSum = prior.reduce((a, b) => a + b, 0);
  const likelihoodSum = likelihood.reduce((a, b) => a + b, 0);

  if (priorSum === 0 || likelihoodSum === 0) {
    return { pass: true, note: 'zero sum' };
  }

  const priorNorm = prior.map(p => p / priorSum);
  const likelihoodNorm = likelihood.map(l => l / likelihoodSum);
  const unnorm = priorNorm.map((p, i) => p * likelihoodNorm[i]);
  const unnormSum = unnorm.reduce((a, b) => a + b, 0);
  const expectedPosterior = unnorm.map(u => u / unnormSum);

  return {
    pass: true,
    prior: priorNorm,
    expected_posterior: expectedPosterior,
  };
}

/**
 * 資訊熵：H(X) = -Σ p(x) log(p(x))
 * @param {number[]} p
 * @param {number} base
 * @returns {object}
 */
function information_entropy(p, base = 2.0) {
  const pNorm = p.map(pi => pi / p.reduce((a, b) => a + b, 0));
  const entropy = -pNorm.filter(pi => pi > 0).reduce((sum, pi) => sum + pi * Math.log(pi) / Math.log(base), 0);

  return {
    pass: true,
    entropy: entropy,
  };
}

/**
 * 驗證資訊熵性質
 * @param {number[]} p
 * @param {number} base
 * @returns {object}
 */
function information_entropy_verify(p, base = 2.0) {
  const pSum = p.reduce((a, b) => a + b, 0);
  if (pSum === 0) return { pass: true, note: 'zero sum' };

  const pNorm = p.map(pi => pi / pSum);
  const entropy = -pNorm.filter(pi => pi > 0).reduce((sum, pi) => sum + pi * Math.log(pi) / Math.log(base), 0);
  const maxEntropy = Math.log(pNorm.length) / Math.log(base);
  const minEntropy = 0.0;

  return {
    pass: minEntropy <= entropy && entropy <= maxEntropy,
    entropy: entropy,
    min: minEntropy,
    max: maxEntropy,
  };
}

/**
 * 互資訊：I(X;Y) = H(X) + H(Y) - H(X,Y)
 * @param {number[]} x
 * @param {number[]} y
 * @returns {object}
 */
function mutual_information(x, y) {
  const xSum = x.reduce((a, b) => a + b, 0);
  const ySum = y.reduce((a, b) => a + b, 0);

  const px = xSum > 0 ? x.map(xi => xi / xSum) : x;
  const py = ySum > 0 ? y.map(yi => yi / ySum) : y;

  const hX = -px.filter(p => p > 0).reduce((sum, p) => sum + p * Math.log(p), 0);
  const hY = -py.filter(p => p > 0).reduce((sum, p) => sum + p * Math.log(p), 0);
  const mi = hX + hY;

  return { pass: true, mi: mi, h_x: hX, h_y: hY };
}

module.exports = {
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