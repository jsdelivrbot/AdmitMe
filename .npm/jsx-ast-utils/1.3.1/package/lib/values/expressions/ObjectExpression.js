'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractValueFromObjectExpression;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extractor function for an ObjectExpression type value node.
 * An object expression is using {}.
 *
 * @returns - a representation of the object
 */
function extractValueFromObjectExpression(value) {
  return value.properties.reduce(function (obj, property) {
    var object = (0, _objectAssign2.default)({}, obj);
    object[(0, _index2.default)(property.key)] = (0, _index2.default)(property.value);
    return object;
  }, {});
}