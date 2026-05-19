/**
 * Geometry Module
 *
 * 2D, 3D, nD 幾何運算
 */

export { Point1D, Point2D, Point3D, PointND } from './point.js';
export { Vec2, Vec3, Vec } from './vector.js';
export { Line2D, Line3D, Ray, Segment } from './line.js';
export { Plane } from './plane.js';
export { Circle, Arc } from './circle.js';
export { Sphere, SphereSection } from './sphere.js';
export { Polygon, Triangle, Rectangle, RegularPolygon } from './polygon.js';
export {
  pointToPoint2D,
  pointToPoint3D,
  pointToLine,
  pointToPlane,
  pointToCircle,
  pointToSphere,
  lineToLine,
  pointToPolygon,
} from './distance.js';
export {
  translate2D,
  translate3D,
  rotate2D,
  rotate3D,
  scale2D,
  scale3D,
  reflect2D,
  reflect3D,
  transformMatrix,
  rotationMatrix2D,
} from './transform.js';