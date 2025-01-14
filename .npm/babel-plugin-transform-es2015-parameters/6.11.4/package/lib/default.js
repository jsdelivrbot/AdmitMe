"use strict";

exports.__esModule = true;
exports.visitor = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _babelHelperGetFunctionArity = require("babel-helper-get-function-arity");

var _babelHelperGetFunctionArity2 = _interopRequireDefault(_babelHelperGetFunctionArity);

var _babelHelperCallDelegate = require("babel-helper-call-delegate");

var _babelHelperCallDelegate2 = _interopRequireDefault(_babelHelperCallDelegate);

var _babelTemplate = require("babel-template");

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var buildDefaultParam = (0, _babelTemplate2.default)("\n  let VARIABLE_NAME =\n    ARGUMENTS.length <= ARGUMENT_KEY || ARGUMENTS[ARGUMENT_KEY] === undefined ?\n      DEFAULT_VALUE\n    :\n      ARGUMENTS[ARGUMENT_KEY];\n");

var buildCutOff = (0, _babelTemplate2.default)("\n  let $0 = $1[$2];\n");

function hasDefaults(node) {
  for (var _iterator = node.params, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var param = _ref;

    if (!t.isIdentifier(param)) return true;
  }
  return false;
}

var iifeVisitor = {
  ReferencedIdentifier: function ReferencedIdentifier(path, state) {
    var name = path.node.name;
    if (name === "eval" || path.scope.hasOwnBinding(name) && path.scope.getOwnBinding(name).kind !== "param") {
      state.iife = true;
      path.stop();
    }
  },
  Scope: function Scope(path) {
    // different bindings
    path.skip();
  }
};

var visitor = exports.visitor = {
  Function: function Function(path) {
    var node = path.node;
    var scope = path.scope;

    if (!hasDefaults(node)) return;

    // ensure it's a block, useful for arrow functions
    path.ensureBlock();

    var state = {
      iife: false,
      scope: scope
    };

    var body = [];

    //
    var argsIdentifier = t.identifier("arguments");
    argsIdentifier._shadowedFunctionLiteral = path;

    // push a default parameter definition
    function pushDefNode(left, right, i) {
      var defNode = buildDefaultParam({
        VARIABLE_NAME: left,
        DEFAULT_VALUE: right,
        ARGUMENT_KEY: t.numericLiteral(i),
        ARGUMENTS: argsIdentifier
      });
      defNode._blockHoist = node.params.length - i;
      body.push(defNode);
    }

    //
    var lastNonDefaultParam = (0, _babelHelperGetFunctionArity2.default)(node);

    //
    var params = path.get("params");
    for (var i = 0; i < params.length; i++) {
      var param = params[i];

      if (!param.isAssignmentPattern()) {
        if (!state.iife && !param.isIdentifier()) {
          param.traverse(iifeVisitor, state);
        }

        continue;
      }

      var left = param.get("left");
      var right = param.get("right");

      //
      if (i >= lastNonDefaultParam || left.isPattern()) {
        var placeholder = scope.generateUidIdentifier("x");
        placeholder._isDefaultPlaceholder = true;
        node.params[i] = placeholder;
      } else {
        node.params[i] = left.node;
      }

      //
      if (!state.iife) {
        if (right.isIdentifier() && scope.hasOwnBinding(right.node.name) && scope.getOwnBinding(right.node.name).kind !== "param") {
          // the right hand side references a parameter
          state.iife = true;
        } else {
          right.traverse(iifeVisitor, state);
        }
      }

      pushDefNode(left.node, right.node, i);
    }

    // add declarations for trailing parameters
    for (var _i2 = lastNonDefaultParam + 1; _i2 < node.params.length; _i2++) {
      var _param = node.params[_i2];
      if (_param._isDefaultPlaceholder) continue;

      var declar = buildCutOff(_param, argsIdentifier, t.numericLiteral(_i2));
      declar._blockHoist = node.params.length - _i2;
      body.push(declar);
    }

    // we need to cut off all trailing parameters
    node.params = node.params.slice(0, lastNonDefaultParam);

    if (state.iife) {
      body.push((0, _babelHelperCallDelegate2.default)(path, scope));
      path.set("body", t.blockStatement(body));
    } else {
      path.get("body").unshiftContainer("body", body);
    }
  }
};