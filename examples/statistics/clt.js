const { plot, hist, png, dev_off } = require('../../src/math4js/plot/rplot');
const { rnorm, dnorm } = require('../../src/math4js/statistics/distributions');

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', '..', 'out');

function sample_sum(drawFn, n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += drawFn();
  return total;
}

function coin_flip() {
  return Math.random() < 0.5 ? 1 : 0;
}

function dice_roll() {
  return Math.floor(Math.random() * 6) + 1;
}

function uniform() {
  return Math.random();
}

function normal() {
  return rnorm(1)[0];
}

function clt(distribution, name, n_values, n_trials = 10000) {
  console.log(`\n--- ${name} ---`);
  const colors = ['#2196F3', '#F44336', '#4CAF50', '#FF9800'];
  const trace_sets = [];

  for (let idx = 0; idx < n_values.length; idx++) {
    const n = n_values[idx];
    const sums = [];
    for (let i = 0; i < n_trials; i++) {
      sums.push(sample_sum(distribution, n));
    }
    const mean = sums.reduce((a, b) => a + b, 0) / sums.length;
    const std = Math.sqrt(sums.reduce((a, b) => a + (b - mean) ** 2, 0) / (sums.length - 1));
    const min = Math.min(...sums);
    const max = Math.max(...sums);
    const x = [];
    const y = [];
    for (let v = min; v <= max; v += (max - min) / 100) {
      x.push(v);
      y.push(dnorm(v, mean, std));
    }
    trace_sets.push({ n, sums, mean, std, min, max, x, y, col: colors[idx] });
    console.log(`  n=${n}: mean=${mean.toFixed(2)}, std=${std.toFixed(2)}`);
  }

  const subplot_rows = 2;
  const subplot_cols = 2;
  const figures = [];

  for (let idx = 0; idx < n_values.length; idx++) {
    const { n, sums, mean, std, min, max, x, y, col } = trace_sets[idx];
    const html = _build_subplot_html(
      name,
      idx,
      subplot_rows,
      subplot_cols,
      sums,
      x,
      y,
      mean,
      std,
      col,
      n,
      n_trials
    );
    figures.push(html);
  }

  const combined = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CLT: ${name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h2 { text-align: center; color: #333; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1200px; margin: 0 auto; }
    .chart { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
  </style>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
</head>
<body>
  <h2>Central Limit Theorem: ${name}</h2>
  <div class="grid">
    ${trace_sets.map((t, i) => `<div class="chart" id="chart${i}"></div>`).join('\n    ')}
  </div>
  <script>
    ${trace_sets
      .map(
        (t, i) => `
    Plotly.newPlot('chart${i}', [
      { x: ${JSON.stringify(t.sums)}, type: 'histogram', nbinsx: 50, name: 'Samples', marker: { color: '${t.col}' }, histnorm: 'probability density' },
      { x: ${JSON.stringify(t.x)}, y: ${JSON.stringify(t.y)}, mode: 'lines', name: 'Normal Fit', line: { color: '#F44336', width: 2 } }
    ], {
      title: 'n = ${t.n} (trials = ${n_trials})',
      xaxis: { title: 'Sum' },
      yaxis: { title: 'Density' },
      showlegend: false,
      margin: { t: 40 }
    }, {responsive: true});`
      )
      .join('\n    ')}
  </script>
</body>
</html>`;

  const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.html`;
  const filepath = path.join(OUT_DIR, filename);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(filepath, combined);
  console.log(`  Saved: ${filepath}`);
}

function _build_subplot_html(name, idx, rows, cols, sums, xFit, yFit, mean, std, col, n, trials) {
  return '';
}

console.log('=' + ' '.repeat(58) + '=');
console.log('Central Limit Theorem Demonstration');
console.log('=' + ' '.repeat(58) + '=');

const n_values = [1, 2, 10, 20];

clt(coin_flip, 'Coin Flip (Bernoulli)', n_values);
clt(dice_roll, 'Dice Roll (1-6)', n_values);
clt(uniform, 'Uniform(0,1)', n_values);
clt(normal, 'Normal(0,1)', n_values);

console.log('\n' + '=' + ' '.repeat(58) + '=');
console.log('CLT: Sum of n samples from ANY distribution');
console.log('      → approaches N(n*μ, n*σ²) as n → ∞');
console.log('=' + ' '.repeat(58) + '=');
console.log('\nAll CLT plots saved to ./out/');
