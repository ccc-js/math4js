/**
 * math4js statistics module
 *
 * 統計模組：包含亂數產生、分布函數、敘述統計、統計定理等
 */

const random = require('./random.js');
const distributions = require('./distributions.js');
const stats = require('./stats.js');
const function_ = require('./function.js');
const theorem = require('./theorem.js');

module.exports = {
  ...random,
  ...distributions,
  ...stats,
  ...function_,
  ...theorem,
};