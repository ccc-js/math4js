/**
 * NumPy 風格的 ndarray 類別
 *
 * 支援多維陣列操作，C order (row-major)
 */

export type Dtype = 'float64' | 'int32' | 'float32';

export interface Slice {
  start: number;
  end: number;
  step: number;
}

function computeStrides(shape: number[]): number[] {
  const ndim = shape.length;
  const strides = new Array(ndim);
  strides[ndim - 1] = 1;
  for (let i = ndim - 2; i >= 0; i--) {
    strides[i] = strides[i + 1] * shape[i + 1];
  }
  return strides;
}

function product(arr: number[]): number {
  return arr.reduce((a, b) => a * b, 1);
}

export class ndarray {
  private _data!: Float64Array;
  private _shape!: number[];
  private _strides!: number[];
  private _offset!: number;
  private _dtype!: Dtype;
  private _ndim!: number;
  private _size!: number;

  constructor(data: number[] | Float64Array | ndarray, shape?: number[], dtype: Dtype = 'float64') {
    if (data instanceof ndarray) {
      this._data = new Float64Array(data._data.subarray(data._offset, data._offset + data._size));
      this._shape = [...data._shape];
      this._strides = [...data._strides];
      this._offset = 0;
      this._dtype = data._dtype;
      this._ndim = data._ndim;
      this._size = data._size;
      return;
    }

    if (data instanceof Float64Array) {
      this._data = data;
      this._shape = [...(shape ?? [data.length])];
      this._strides = computeStrides(this._shape);
      this._offset = 0;
      this._dtype = dtype;
      this._ndim = this._shape.length;
      this._size = data.length;
      return;
    }

    if (shape === undefined) {
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0] as unknown)) {
        const rows = data.length;
        const cols = ((data[0] as unknown) as number[]).length;
        shape = [rows, cols];
        const flat: number[] = [];
        for (const row of data as unknown[]) {
          for (const v of row as number[]) flat.push(v);
        }
        this._data = new Float64Array(flat);
        this._shape = shape;
        this._strides = computeStrides(shape);
        this._offset = 0;
        this._dtype = dtype;
        this._ndim = shape.length;
        this._size = flat.length;
        return;
      } else {
        const arr = data as number[];
        this._data = new Float64Array(arr);
        if (shape === undefined) {
          this._shape = [arr.length];
        }
        this._strides = [1];
        this._offset = 0;
        this._dtype = dtype;
        this._ndim = 1;
        this._size = arr.length;
        return;
      }
    }

    const size = product(shape);
    this._data = new Float64Array(size);
    if (Array.isArray(data)) {
      for (let i = 0; i < Math.min(size, data.length); i++) {
        this._data[i] = data[i];
      }
    }
    this._shape = [...shape];
    this._strides = computeStrides(shape);
    this._offset = 0;
    this._dtype = dtype;
    this._ndim = shape.length;
    this._size = size;
  }

  get shape(): number[] {
    return [...this._shape];
  }

  get ndim(): number {
    return this._ndim;
  }

  get size(): number {
    return this._size;
  }

  get dtype(): Dtype {
    return this._dtype;
  }

  get T(): ndarray {
    return this.transpose();
  }

  get flat(): Float64Array {
    return this._data.subarray(this._offset, this._offset + this._size);
  }

  private _index(indices: number[]): number {
    let idx = this._offset;
    for (let i = 0; i < this._ndim; i++) {
      let j = indices[i];
      if (j < 0) j = this._shape[i] + j;
      if (j < 0 || j >= this._shape[i]) throw new Error(`Index ${j} out of bounds for dim ${i}`);
      idx += j * this._strides[i];
    }
    return idx;
  }

  get(...indices: number[]): number | ndarray {
    if (indices.length === 0) throw new Error('No indices provided');
    if (indices.length === 1 && this._ndim > 1) {
      const i = indices[0];
      const size = this._shape.slice(1).reduce((a, b) => a * b, 1);
      const offset = this._index([i]);
      const subShape = this._shape.slice(1);
      return new ndarray(this._data.subarray(offset, offset + size), subShape, this._dtype);
    }
    return this._data[this._index(indices)];
  }

  set(...args: number[]): void {
    const values = args.pop() as number;
    this._data[this._index(args as number[])] = values;
  }

  at(index: number): number {
    return this._data[this._offset + index];
  }

  reshape(shape: number[]): ndarray {
    const newSize = product(shape);
    if (newSize !== this._size) throw new Error(`Cannot reshape ${this._size} to ${newSize}`);
    const arr = new ndarray(this.flat, shape, this._dtype);
    return arr;
  }

  flatten(): ndarray {
    return new ndarray(this.flat, [this._size], this._dtype);
  }

  transpose(axes?: number[]): ndarray {
    if (this._ndim === 1) return this;
    if (this._ndim === 2) {
      const [rows, cols] = this._shape;
      const data: number[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          data.push(this._data[this._index([i, j])]);
        }
      }
      return new ndarray(data, [cols, rows], this._dtype);
    }
    if (!axes) {
      axes = Array.from({ length: this._ndim }, (_, i) => this._ndim - 1 - i);
    }
    const newShape = axes.map(i => this._shape[i]);
    const newStrides = computeStrides(newShape);
    const arr = new ndarray(this._data.subarray(this._offset, this._offset + this._size), this._shape, this._dtype);
    const newArr = new ndarray(new Float64Array(this._size), newShape, this._dtype);
    for (let i = 0; i < this._size; i++) {
      let idx = i;
      let oldIdx = this._offset;
      for (let d = 0; d < this._ndim; d++) {
        const coord = Math.floor(idx / arr._strides[d]);
        idx = idx % arr._strides[d];
        const newCoord = axes[d];
        oldIdx += coord * arr._strides[newCoord];
      }
      newArr._data[i] = this._data[oldIdx];
    }
    return newArr;
  }

  swapaxes(axis1: number, axis2: number): ndarray {
    const axes = Array.from({ length: this._ndim }, (_, i) => i);
    [axes[axis1], axes[axis2]] = [axes[axis2], axes[axis1]];
    return this.transpose(axes);
  }

  squeeze(): ndarray {
    const newShape = this._shape.filter(s => s !== 1);
    if (newShape.length === this._ndim) return this;
    return new ndarray(this._data.subarray(this._offset, this._offset + this._size), newShape, this._dtype);
  }

  expand_dims(axis: number): ndarray {
    const newShape = [...this._shape];
    newShape.splice(axis, 0, 1);
    return new ndarray(this._data.subarray(this._offset, this._offset + this._size), newShape, this._dtype);
  }

  copy(): ndarray {
    const newData = new Float64Array(this._data.subarray(this._offset, this._offset + this._size));
    return new ndarray(newData, [...this._shape], this._dtype);
  }

  view(): ndarray {
    const arr = new ndarray(new Float64Array(0), [], this._dtype);
    arr._data = this._data;
    arr._shape = [...this._shape];
    arr._strides = [...this._strides];
    arr._offset = this._offset;
    arr._ndim = this._ndim;
    arr._size = this._size;
    return arr;
  }

  slice(ranges: [number, number, number][]): ndarray {
    const indices: number[][] = [];
    const newShape: number[] = [];
    for (let i = 0; i < this._ndim; i++) {
      const [start = 0, end = this._shape[i], step = 1] = ranges[i] || [0, this._shape[i], 1];
      const s = start < 0 ? Math.max(0, this._shape[i] + start) : start;
      const e = end < 0 ? Math.min(this._shape[i], this._shape[i] + end) : Math.min(this._shape[i], end);
      const count = Math.max(0, Math.floor((e - s) / step));
      newShape.push(count);
      const idxList: number[] = [];
      for (let j = 0; j < count; j++) {
        idxList.push(s + j * step);
      }
      indices.push(idxList);
    }

    const newSize = newShape.reduce((a, b) => a * b, 1);
    const newData = new Float64Array(newSize);
    let pos = 0;
    const self = this; // eslint-disable-line @typescript-eslint/no-this-alias

    function buildNested(idx: number[], dim: number) {
      if (dim === indices.length) {
        let linearIdx = 0;
        for (let d = 0; d < dim; d++) {
          linearIdx += idx[d] * self._strides[d];
        }
        newData[pos++] = self._data[self._offset + linearIdx];
      } else {
        for (const i of indices[dim]) {
          buildNested([...idx, i], dim + 1);
        }
      }
    }
    buildNested([], 0);

    return new ndarray(newData, newShape, this._dtype);
  }

  [Symbol.iterator](): Iterator<number> {
    return this.flat[Symbol.iterator]();
  }

  toArray(): number[] | number[][] {
    if (this._ndim === 1) return [...this._data.subarray(this._offset, this._offset + this._size)];
    if (this._ndim === 2) {
      const [rows, cols] = this._shape;
      const result: number[][] = [];
      for (let i = 0; i < rows; i++) {
        const row: number[] = [];
        for (let j = 0; j < cols; j++) {
          row.push(this._data[this._index([i, j])]);
        }
        result.push(row);
      }
      return result;
    }
    return [...this.flat];
  }

  toString(): string {
    return JSON.stringify(this.toArray());
  }
}

export function zeros(shape: number[], dtype: Dtype = 'float64'): ndarray {
  return new ndarray(new Float64Array(product(shape)), shape, dtype);
}

export function ones(shape: number[], dtype: Dtype = 'float64'): ndarray {
  const arr = zeros(shape, dtype);
  for (let i = 0; i < arr.size; i++) {
    arr.flat[i] = 1;
  }
  return arr;
}

export function full(shape: number[], fill_value: number, dtype: Dtype = 'float64'): ndarray {
  const arr = zeros(shape, dtype);
  for (let i = 0; i < arr.size; i++) {
    arr.flat[i] = fill_value;
  }
  return arr;
}

export function eye(N: number, M?: number, dtype: Dtype = 'float64'): ndarray {
  const rows = N;
  const cols = M ?? N;
  const arr = zeros([rows, cols], dtype);
  for (let i = 0; i < Math.min(rows, cols); i++) {
    arr.set(i, i, 1);
  }
  return arr;
}

export function identity(N: number, dtype: Dtype = 'float64'): ndarray {
  return eye(N, N, dtype);
}

export function diag(v: number[], k: number = 0): ndarray {
  const n = v.length + Math.abs(k);
  const arr = zeros([n, n], 'float64');
  for (let i = 0; i < v.length; i++) {
    const row = k >= 0 ? i : i - k;
    const col = k >= 0 ? i + k : i;
    arr.set(row, col, v[i]);
  }
  return arr;
}

export function arange(start: number, stop?: number, step: number = 1): ndarray {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const data: number[] = [];
  for (let i = start; i < stop; i += step) {
    data.push(i);
  }
  return new ndarray(data, [data.length], 'float64');
}

export function linspace(start: number, stop: number, num: number = 50, endpoint: boolean = true): ndarray {
  const data: number[] = [];
  const step = endpoint ? (stop - start) / (num - 1) : (stop - start) / num;
  for (let i = 0; i < num; i++) {
    data.push(start + i * step);
  }
  return new ndarray(data, [num], 'float64');
}

export function array(data: number[] | number[][], dtype: Dtype = 'float64'): ndarray {
  return new ndarray(data as number[], undefined, dtype);
}

export function fromFlat(data: number[], shape: number[], dtype: Dtype = 'float64'): ndarray {
  return new ndarray(data, shape, dtype);
}

export function concatenate(arrays: ndarray[], axis: number = 0): ndarray {
  if (arrays.length === 0) throw new Error('No arrays to concatenate');
  if (axis === 0) {
    const totalRows = arrays.reduce((sum, a) => sum + a.shape[0], 0);
    const cols = arrays[0].shape[1];
    const result = zeros([totalRows, cols]);
    let row = 0;
    for (const arr of arrays) {
      for (let i = 0; i < arr.shape[0]; i++) {
        for (let j = 0; j < arr.shape[1]; j++) {
          const val = arr.get(i, j);
          const numVal = typeof val === 'number' ? val : (val as ndarray).flat[0];
          result.set(row + i, j, numVal);
        }
      }
      row += arr.shape[0];
    }
    return result;
  }
  return arrays[0];
}

export function vstack(arrays: ndarray[]): ndarray {
  return concatenate(arrays, 0);
}

export function hstack(arrays: ndarray[]): ndarray {
  return concatenate(arrays, 1);
}