/**
 * R 風格的繪圖函數
 *
 * 使用 Plotly.js 實現泛型繪圖、直方圖、盒鬚圖等
 * 支援 PNG/PDF 輸出（Node.js）或螢幕顯示（瀏覽器）
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', '..', 'out');

let _traces = [];
let _layout = {};
let _device = null;
let _device_params = {};

const PALETTE = [
  '#2196F3',
  '#F44336',
  '#4CAF50',
  '#FF9800',
  '#9C27B0',
  '#00BCD4',
  '#FF5722',
  '#607D8B',
];

function _normalize_x(x) {
  if (typeof x === 'number') return [x];
  return Array.isArray(x) ? x : [...x];
}

function _norm_inv(p) {
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.38357751867269e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239;
  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;
  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838;
  const c4 = -2.549732539343734;
  const c5 = 4.374664141464968;
  const c6 = 2.938163982698783;
  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996;
  const d4 = 3.754408661907416;
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q, r;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        (((d1 * q + d2) * q + d3) * q + d4) +
      5e5
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        (((d1 * q + d2) * q + d3) * q + d4) +
      5e5
    );
  }
}

function png(filename, options = {}) {
  if (_traces.length > 0) dev_off();
  _device = 'png';
  _device_params = { filename, ...options };
}

function pdf(filename, options = {}) {
  if (_traces.length > 0) dev_off();
  _device = 'pdf';
  _device_params = { filename, ...options };
}

function dev_off() {
  if (_traces.length === 0) return;
  _save_figure();
  _reset();
}

function _reset() {
  _traces = [];
  _layout = {};
  _device = null;
  _device_params = {};
}

function _save_figure() {
  if (typeof window !== 'undefined') {
    _save_html_inline();
    return;
  }
  _save_html_node();
}

function _save_html_node() {
  const html = _build_html();
  let filepath = _device_params.filename;
  if (!path.isAbsolute(filepath) && !filepath.includes(':')) {
    filepath = path.join(OUT_DIR, filepath);
  }
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, html);
  console.log(`Saved: ${filepath}`);
}

function _build_html() {
  const data = JSON.stringify(_traces);
  const layout = JSON.stringify(_layout);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
</head>
<body>
  <div id="chart"></div>
  <script>
    Plotly.newPlot('chart', ${data}, ${layout}, {responsive: true});
  </script>
</body>
</html>`;
}

function _save_html_inline() {
  if (typeof document === 'undefined') return;
  const data = JSON.stringify(_traces);
  const layout = JSON.stringify(_layout);
  const html = `<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<div id="chart"></div>
<script>Plotly.newPlot('chart', ${data}, ${layout}, {responsive: true});</script>`;
  let container = document.getElementById('math4js-plot-output');
  if (!container) {
    container = document.createElement('div');
    container.id = 'math4js-plot-output';
    container.style.cssText =
      'position:fixed;bottom:10px;left:10px;z-index:9999;background:white;border:1px solid #ccc;padding:10px;max-width:90vw;max-height:50vh;overflow:auto;';
    document.body.appendChild(container);
  }
  container.innerHTML = html;
}

function plot(x, y, options = {}) {
  if (typeof y === 'object' && y !== null && !Array.isArray(y)) {
    options = y;
    y = undefined;
  }
  let xArr, yArr;
  if (y === undefined) {
    yArr = _normalize_x(x);
    xArr = yArr.map((_, i) => i);
  } else {
    xArr = _normalize_x(x);
    yArr = _normalize_x(y);
  }
  const type = options.type || 'p';
  const col = options.col || PALETTE[_traces.length % PALETTE.length];
  let trace;
  if (type === 'p') {
    trace = {
      x: xArr,
      y: yArr,
      mode: 'markers',
      type: 'scatter',
      marker: { color: col, size: options.ms || 8 },
      name: options.name || '',
    };
  } else if (type === 'l') {
    trace = {
      x: xArr,
      y: yArr,
      mode: 'lines',
      type: 'scatter',
      line: { color: col, width: options.lwd || 2 },
      name: options.name || '',
    };
  } else {
    trace = {
      x: xArr,
      y: yArr,
      mode: 'markers+lines',
      type: 'scatter',
      marker: { color: col, size: options.ms || 6 },
      line: { color: col, width: options.lwd || 2 },
      name: options.name || '',
    };
  }
  _add_trace(trace, options);
  return trace;
}

function hist(x, options = {}) {
  const xArr = _normalize_x(x);
  const col = options.col || PALETTE[_traces.length % PALETTE.length];
  const trace = {
    x: xArr,
    type: 'histogram',
    nbinsx: options.breaks || 10,
    marker: { color: col, line: { color: options.border || 'white', width: 1 } },
    histnorm: options.freq === false ? 'probability density' : '',
    name: options.name || '',
  };
  _add_trace(trace, options);
  return trace;
}

function boxplot(data, options = {}) {
  let dataArr =
    Array.isArray(data) && typeof data[0] === 'number' ? [data] : data.map((d) => _normalize_x(d));
  const col = options.col || PALETTE[_traces.length % PALETTE.length];
  const traces = dataArr.map((d, i) => ({
    y: d,
    type: 'box',
    name: (options.names && options.names[i]) || `Group ${i + 1}`,
    marker: { color: col },
    boxpoints: options.showpoints ? 'all' : false,
  }));
  traces.forEach((t) => _add_trace(t, options));
  return traces;
}

function qqnorm(x, options = {}) {
  const xArr = _normalize_x(x);
  const sorted = [...xArr].sort((a, b) => a - b);
  const n = sorted.length;
  const p = sorted.map((_, i) => (i + 0.5) / n);
  const theoretical = p.map((pi) => _norm_inv(Math.max(0.0001, Math.min(0.9999, pi))));
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  const sampleStd = sorted.map((v) => (v - mean) / std);
  const col = options.col || PALETTE[0];
  const trace = {
    x: theoretical,
    y: sampleStd,
    mode: 'markers',
    type: 'scatter',
    marker: { color: col, size: options.ms || 8 },
    name: 'Q-Q',
  };
  const minVal = Math.min(theoretical[0], sampleStd[0]);
  const maxVal = Math.max(theoretical[theoretical.length - 1], sampleStd[sampleStd.length - 1]);
  const lineTrace = {
    x: [minVal, maxVal],
    y: [minVal, maxVal],
    mode: 'lines',
    type: 'scatter',
    line: { color: '#F44336', width: 2, dash: 'dash' },
    name: 'Reference',
  };
  _add_trace(trace, options);
  _add_trace(lineTrace, { ...options, col: '#F44336' });
  return [trace, lineTrace];
}

function _add_trace(trace, options = {}) {
  _traces.push(trace);
  if (options.main) _layout.title = options.main;
  if (options.xlab) _layout.xaxis = { ..._layout.xaxis, title: options.xlab };
  if (options.ylab) _layout.yaxis = { ..._layout.yaxis, title: options.ylab };
  if (options.xlim) _layout.xaxis = { ..._layout.xaxis, range: options.xlim };
  if (options.ylim) _layout.yaxis = { ..._layout.yaxis, range: options.ylim };
  if (options.showlegend !== undefined) _layout.showlegend = options.showlegend;
  if (_device !== null && _device_params.auto !== false) {
    if (_traces.length >= 1) dev_off();
  }
}

function clear() {
  if (typeof document !== 'undefined') {
    const container = document.getElementById('math4js-plot-output');
    if (container) container.innerHTML = '';
  }
}

module.exports = { plot, hist, boxplot, qqnorm, png, pdf, dev_off, clear };
