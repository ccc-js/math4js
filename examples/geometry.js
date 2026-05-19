/**
 * Geometry 模組範例
 */

import { Point2D, Vec2, Sphere } from 'math4js/geometry';
import { pointToPoint2D, translate2D, rotate2D, scale2D } from 'math4js/geometry';

console.log('=== 點與向量 ===');
const p1 = new Point2D(1, 2);
const p2 = new Point2D(4, 6);
console.log('p1:', p1.toString());
console.log('p1 到 p2 距離:', pointToPoint2D(p1, p2));

const v = new Vec2(1, 2);
console.log('v + v:', v.add(v).toString());
console.log('v · v:', v.dot(v));

console.log('\n=== 3D 幾何 ===');
const sphere = new Sphere(5);
console.log('球 (r=5): 半徑 =', sphere.radius);

console.log('\n=== 變換 ===');
const p = new Point2D(1, 0);
console.log('原點:', p.toString());
console.log('平移 (2,1):', translate2D(p, new Vec2(2, 1)).toString());
console.log('旋轉 90°:', rotate2D(p, Math.PI / 2).toString());
console.log('放大 2 倍:', scale2D(p, 2).toString());