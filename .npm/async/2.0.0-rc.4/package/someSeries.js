'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _someLimit = require('./someLimit');

var _someLimit2 = _interopRequireDefault(_someLimit);

var _doLimit = require('./internal/doLimit');

var _doLimit2 = _interopRequireDefault(_doLimit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The same as `some` but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf async
 * @see async.some
 * @alias anySeries
 * @category Collection
 * @param {Array|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
exports.default = (0, _doLimit2.default)(_someLimit2.default, 1);
module.exports = exports['default'];