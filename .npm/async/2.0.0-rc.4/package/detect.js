'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _createTester = require('./internal/createTester');

var _createTester2 = _interopRequireDefault(_createTester);

var _eachOf = require('./eachOf');

var _eachOf2 = _interopRequireDefault(_eachOf);

var _findGetResult = require('./internal/findGetResult');

var _findGetResult2 = _interopRequireDefault(_findGetResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the first value in `coll` that passes an async truth test. The
 * `iteratee` is applied in parallel, meaning the first iteratee to return
 * `true` will fire the detect `callback` with that result. That means the
 * result might not be the first item in the original `coll` (in terms of order)
 * that passes the test.

 * If order within the original `coll` is important, then look at
 * `detectSeries`.
 *
 * @name detect
 * @static
 * @memberOf async
 * @alias find
 * @category Collection
 * @param {Array|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @example
 *
 * async.detect(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // result now equals the first file in the list that exists
 * });
 */
exports.default = (0, _createTester2.default)(_eachOf2.default, _identity2.default, _findGetResult2.default);
module.exports = exports['default'];