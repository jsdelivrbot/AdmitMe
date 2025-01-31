'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _timesLimit = require('./timesLimit');

var _timesLimit2 = _interopRequireDefault(_timesLimit);

var _doLimit = require('./internal/doLimit');

var _doLimit2 = _interopRequireDefault(_doLimit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The same as {@link async.times} but runs only a single async operation at a time.
 *
 * @name timesSeries
 * @static
 * @memberOf async
 * @see async.times
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link async.map}.
 */
exports.default = (0, _doLimit2.default)(_timesLimit2.default, 1);
module.exports = exports['default'];