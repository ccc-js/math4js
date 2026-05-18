/**
 * math4js - A JavaScript/Node.js math library
 */

const statistics = require('./statistics.js');
const R = statistics;

module.exports = {
  R,
  ...statistics,
};
