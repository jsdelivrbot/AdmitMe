'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sourceCoverage = require('./source-coverage');

var _crypto = require('crypto');

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// function to use for creating hashes
var SHA = 'sha1';
// istanbul ignore comment pattern
var COMMENT_RE = /^\s*istanbul\s+ignore\s+(if|else|next)(?=\W|$)/;
// source map URL pattern
var SOURCE_MAP_RE = /[#@]\s*sourceMappingURL=(.*)\s*$/m;

// generate a variable name from hashing the supplied file path
function genVar(filename) {
    var hash = (0, _crypto.createHash)(SHA),
        suffix;
    hash.update(filename);
    suffix = hash.digest('base64');
    //trim trailing equal signs, turn identifier unsafe chars to safe ones + => _ and / => $
    suffix = suffix.replace(new RegExp('=', 'g'), '').replace(new RegExp('\\+', 'g'), '_').replace(new RegExp('/', 'g'), '$');
    return '__cov_' + suffix;
}

// VisitState holds the state of the visitor, provides helper functions
// and is the `this` for the individual coverage visitors.

var VisitState = function () {
    function VisitState(types, sourceFilePath) {
        _classCallCheck(this, VisitState);

        this.varName = genVar(sourceFilePath);
        this.attrs = {};
        this.nextIgnore = null;
        this.cov = new _sourceCoverage.SourceCoverage(sourceFilePath);
        this.types = types;
        this.sourceMappingURL = null;
    }

    // should we ignore the node? Yes, if specifically ignoring
    // or if the node is generated.


    _createClass(VisitState, [{
        key: 'shouldIgnore',
        value: function shouldIgnore(path) {
            return this.nextIgnore || !path.node.loc;
        }

        // extract the ignore comment hint (next|if|else) or null

    }, {
        key: 'hintFor',
        value: function hintFor(node) {
            var hint = null;
            if (node.leadingComments) {
                node.leadingComments.forEach(function (c) {
                    var v = (c.value || /* istanbul ignore next: paranoid check */"").trim();
                    var groups = v.match(COMMENT_RE);
                    if (groups) {
                        hint = groups[1];
                    }
                });
            }
            return hint;
        }

        // extract a source map URL from comments and keep track of it

    }, {
        key: 'maybeAssignSourceMapURL',
        value: function maybeAssignSourceMapURL(node) {
            var that = this;
            var extractURL = function extractURL(comments) {
                if (!comments) {
                    return;
                }
                comments.forEach(function (c) {
                    var v = (c.value || /* istanbul ignore next: paranoid check */"").trim();
                    var groups = v.match(SOURCE_MAP_RE);
                    if (groups) {
                        that.sourceMappingURL = groups[1];
                    }
                });
            };
            extractURL(node.leadingComments);
            extractURL(node.trailingComments);
        }

        // all the generic stuff that needs to be done on enter for every node

    }, {
        key: 'onEnter',
        value: function onEnter(path) {
            var n = path.node;

            this.maybeAssignSourceMapURL(n);

            // if already ignoring, nothing more to do
            if (this.nextIgnore !== null) {
                return;
            }
            // check hint to see if ignore should be turned on
            var hint = this.hintFor(n);
            if (hint === 'next') {
                this.nextIgnore = n;
                return;
            }
            // else check custom node attribute set by a prior visitor
            if (this.getAttr(path.node, 'skip-all')) {
                this.nextIgnore = n;
            }
        }

        // all the generic stuff on exit of a node,
        // including reseting ignores and custom node attrs

    }, {
        key: 'onExit',
        value: function onExit(path) {
            // restore ignore status, if needed
            if (path.node === this.nextIgnore) {
                this.nextIgnore = null;
            }
            // nuke all attributes for the node
            delete path.node.__cov__;
        }

        // set a node attribute for the supplied node

    }, {
        key: 'setAttr',
        value: function setAttr(node, name, value) {
            node.__cov__ = node.__cov__ || {};
            node.__cov__[name] = value;
        }

        // retrieve a node attribute for the supplied node or null

    }, {
        key: 'getAttr',
        value: function getAttr(node, name) {
            var c = node.__cov__;
            if (!c) {
                return null;
            }
            return c[name];
        }

        //

    }, {
        key: 'increase',
        value: function increase(type, id, index) {
            var T = this.types;
            var wrap = index !== null
            // If `index` present, turn `x` into `x[index]`.
            ? function (x) {
                return T.memberExpression(x, T.numericLiteral(index), true);
            } : function (x) {
                return x;
            };
            return T.unaryExpression('++', wrap(T.memberExpression(T.memberExpression(T.identifier(this.varName), T.identifier(type)), T.stringLiteral(String(id)), true)));
        }
    }, {
        key: 'insertCounter',
        value: function insertCounter(path, increment) {
            var T = this.types;
            if (path.isBlockStatement()) {
                path.node.body.unshift(T.expressionStatement(increment));
            } else if (path.isStatement()) {
                path.insertBefore(T.expressionStatement(increment));
            } else /* istanbul ignore else: not expected */if (path.isExpression()) {
                    path.replaceWith(T.sequenceExpression([increment, path.node]));
                } else {
                    console.error('Unable to insert counter for node type:', path.node.type);
                }
        }
    }, {
        key: 'insertStatementCounter',
        value: function insertStatementCounter(path) {
            /* istanbul ignore if: paranoid check */
            if (!(path.node && path.node.loc)) {
                return;
            }
            var index = this.cov.newStatement(path.node.loc);
            var increment = this.increase('s', index, null);
            this.insertCounter(path, increment);
        }
    }, {
        key: 'insertFunctionCounter',
        value: function insertFunctionCounter(path) {
            var T = this.types;
            /* istanbul ignore if: paranoid check */
            if (!(path.node && path.node.loc)) {
                return;
            }
            var n = path.node;
            var dloc = null;
            // get location for declaration
            switch (n.type) {
                case "FunctionDeclaration":
                    /* istanbul ignore else: paranoid check */
                    if (n.id) {
                        dloc = n.id.loc;
                    }
                    break;
                case "FunctionExpression":
                    if (n.id) {
                        dloc = n.id.loc;
                    }
                    break;
            }
            if (!dloc) {
                dloc = {
                    start: n.loc.start,
                    end: { line: n.loc.start.line, column: n.loc.start.column + 1 }
                };
            }
            var name = path.node.id ? path.node.id.name : path.node.name;
            var index = this.cov.newFunction(name, dloc, path.node.body.loc);
            var increment = this.increase('f', index, null);
            var body = path.get('body');
            /* istanbul ignore else: not expected */
            if (body.isBlockStatement()) {
                body.node.body.unshift(T.expressionStatement(increment));
            } else {
                console.error('Unable to process function body node type:', path.node.type);
            }
        }
    }, {
        key: 'getBranchIncrement',
        value: function getBranchIncrement(branchName, loc) {
            var index = this.cov.addBranchPath(branchName, loc);
            return this.increase('b', branchName, index);
        }
    }, {
        key: 'insertBranchCounter',
        value: function insertBranchCounter(path, branchName, loc) {
            var increment = this.getBranchIncrement(branchName, loc || path.node.loc);
            this.insertCounter(path, increment);
        }
    }, {
        key: 'findLeaves',
        value: function findLeaves(node, accumulator, parent, property) {
            if (!node) {
                return;
            }
            if (node.type === "LogicalExpression") {
                var hint = this.hintFor(node);
                if (hint !== 'next') {
                    this.findLeaves(node.left, accumulator, node, 'left');
                    this.findLeaves(node.right, accumulator, node, 'right');
                }
            } else {
                accumulator.push({
                    node: node,
                    parent: parent,
                    property: property
                });
            }
        }
    }]);

    return VisitState;
}();

// generic function that takes a set of visitor methods and
// returns a visitor object with `enter` and `exit` properties,
// such that:
//
// * standard entry processing is done
// * the supplied visitors are called only when ignore is not in effect
//   This relieves them from worrying about ignore states and generated nodes.
// * standard exit processing is done
//


function entries() {
    var enter = Array.prototype.slice.call(arguments);
    // the enter function
    var wrappedEntry = function wrappedEntry(path, node) {
        this.onEnter(path);
        if (this.shouldIgnore(path)) {
            return;
        }
        var that = this;
        enter.forEach(function (e) {
            e.call(that, path, node);
        });
    };
    var exit = function exit(path, node) {
        this.onExit(path, node);
    };
    return {
        enter: wrappedEntry,
        exit: exit
    };
}

function coverStatement(path) {
    this.insertStatementCounter(path);
}

/* istanbul ignore next: no node.js support */
function coverAssignmentPattern(path) {
    var n = path.node;
    var b = this.cov.newBranch('default-arg', n.loc);
    this.insertBranchCounter(path.get('right'), b);
}

function coverFunction(path) {
    this.insertFunctionCounter(path);
}

function coverVariableDeclarator(path) {
    this.insertStatementCounter(path.get('init'));
}

function skipInit(path) {
    if (path.node.init) {
        this.setAttr(path.node.init, 'skip-all', true);
    }
}

function makeBlock(path) {
    var T = this.types;
    if (!path.node) {
        path.replaceWith(T.blockStatement([]));
    }
    if (!path.isBlockStatement()) {
        path.replaceWith(T.blockStatement([path.node]));
        path.node.loc = path.node.body[0].loc;
    }
}

function blockProp(prop) {
    return function (path) {
        makeBlock.call(this, path.get(prop));
    };
}

function convertArrowExpression(path) {
    var n = path.node;
    var T = this.types;
    if (n.expression) {
        var bloc = n.body.loc;
        n.expression = false;
        n.body = T.blockStatement([T.returnStatement(n.body)]);
        // restore body location
        n.body.loc = bloc;
        // set up the location for the return statement so it gets
        // instrumented
        n.body.body[0].loc = bloc;
    }
}

function coverIfBranches(path) {
    var n = path.node,
        hint = this.hintFor(n),
        ignoreIf = hint === 'if',
        ignoreElse = hint === 'else',
        branch = this.cov.newBranch('if', n.loc);

    if (ignoreIf) {
        this.setAttr(n.consequent, 'skip-all', true);
    } else {
        this.insertBranchCounter(path.get('consequent'), branch, n.loc);
    }
    if (ignoreElse) {
        this.setAttr(n.alternate, 'skip-all', true);
    } else {
        this.insertBranchCounter(path.get('alternate'), branch, n.loc);
    }
}

function createSwitchBranch(path) {
    var b = this.cov.newBranch('switch', path.node.loc);
    this.setAttr(path.node, 'branchName', b);
}

function coverSwitchCase(path) {
    var T = this.types;
    var b = this.getAttr(path.parentPath.node, 'branchName');
    /* istanbul ignore if: paranoid check */
    if (!b) {
        throw new Error('Unable to get switch branch name');
    }
    var increment = this.getBranchIncrement(b, path.node.loc);
    path.node.consequent.unshift(T.expressionStatement(increment));
}

function coverTernary(path) {
    var n = path.node,
        branch = this.cov.newBranch('cond-expr', path.node.loc),
        cHint = this.hintFor(n.consequent),
        aHint = this.hintFor(n.alternate);

    if (cHint !== 'next') {
        this.insertBranchCounter(path.get('consequent'), branch);
    }
    if (aHint !== 'next') {
        this.insertBranchCounter(path.get('alternate'), branch);
    }
}

function coverLogicalExpression(path) {
    var T = this.types;
    if (path.parentPath.node.type === "LogicalExpression") {
        return; // already processed
    }
    var leaves = [];
    this.findLeaves(path.node, leaves);
    var b = this.cov.newBranch("binary-expr", path.node.loc);
    for (var i = 0; i < leaves.length; i += 1) {
        var leaf = leaves[i];
        var hint = this.hintFor(leaf.node);
        if (hint === 'next') {
            continue;
        }
        var increment = this.getBranchIncrement(b, leaf.node.loc);
        if (!increment) {
            continue;
        }
        leaf.parent[leaf.property] = T.sequenceExpression([increment, leaf.node]);
    }
}

var codeVisitor = {
    ArrowFunctionExpression: entries(convertArrowExpression, coverFunction),
    AssignmentPattern: entries(coverAssignmentPattern),
    BlockStatement: entries(), // ignore processing only
    ClassMethod: entries(coverFunction),
    ExpressionStatement: entries(coverStatement),
    BreakStatement: entries(coverStatement),
    ContinueStatement: entries(coverStatement),
    DebuggerStatement: entries(coverStatement),
    ReturnStatement: entries(coverStatement),
    ThrowStatement: entries(coverStatement),
    TryStatement: entries(coverStatement),
    VariableDeclaration: entries(), // ignore processing only
    VariableDeclarator: entries(coverVariableDeclarator),
    IfStatement: entries(blockProp('consequent'), blockProp('alternate'), coverStatement, coverIfBranches),
    ForStatement: entries(blockProp('body'), skipInit, coverStatement),
    ForInStatement: entries(blockProp('body'), skipInit, coverStatement),
    ForOfStatement: entries(blockProp('body'), skipInit, coverStatement),
    WhileStatement: entries(blockProp('body'), coverStatement),
    DoWhileStatement: entries(blockProp('body'), coverStatement),
    SwitchStatement: entries(createSwitchBranch, coverStatement),
    SwitchCase: entries(coverSwitchCase),
    WithStatement: entries(blockProp('body'), coverStatement),
    FunctionDeclaration: entries(coverFunction),
    FunctionExpression: entries(coverFunction),
    LabeledStatement: entries(coverStatement),
    ConditionalExpression: entries(coverTernary),
    LogicalExpression: entries(coverLogicalExpression)
};
// the template to insert at the top of the program.
var coverageTemplate = (0, _babelTemplate2.default)('\n    var COVERAGE_VAR = (function () {\n        var path = PATH, \n            hash = HASH,\n            global = (new Function(\'return this\'))(),\n            gcv = GLOBAL_COVERAGE_VAR,\n            coverageData = INITIAL,\n            coverage = global[gcv] || (global[gcv] = {});\n        if (coverage[path] && coverage[path].hash === hash) {\n            return coverage[path];\n        }\n        coverageData.hash = hash;\n        return coverage[path] = coverageData;\n    })();\n');
/**
 * programVisitor is a `babel` adaptor for instrumentation.
 * It returns an object with two methods `enter` and `exit`.
 * These should be assigned to or called from `Program` entry and exit functions
 * in a babel visitor.
 * These functions do not make assumptions about the state set by Babel and thus
 * can be used in a context other than a Babel plugin.
 *
 * The exit function returns an object that currently has the following keys:
 *
 * `fileCoverage` - the file coverage object created for the source file.
 * `sourceMappingURL` - any source mapping URL found when processing the file.
 *
 * @param {Object} types - an instance of babel-types
 * @param {string} sourceFilePath - the path to source file
 * @param {Object} opts - additional options
 * @param {string} [opts.coverageVariable=__coverage__] the global coverage variable name.
 */
function programVisitor(types) {
    var sourceFilePath = arguments.length <= 1 || arguments[1] === undefined ? 'unknown.js' : arguments[1];
    var opts = arguments.length <= 2 || arguments[2] === undefined ? { coverageVariable: '__coverage__' } : arguments[2];

    var T = types;
    var visitState = new VisitState(types, sourceFilePath);
    return {
        enter: function enter(path) {
            path.traverse(codeVisitor, visitState);
        },
        exit: function exit(path) {
            visitState.cov.freeze();
            var coverageData = visitState.cov.toJSON();
            var hash = (0, _crypto.createHash)(SHA).update(JSON.stringify(coverageData)).digest('hex');
            var coverageNode = T.valueToNode(coverageData);
            var cv = coverageTemplate({
                GLOBAL_COVERAGE_VAR: T.stringLiteral(opts.coverageVariable),
                COVERAGE_VAR: T.identifier(visitState.varName),
                PATH: T.stringLiteral(sourceFilePath),
                INITIAL: coverageNode,
                HASH: T.stringLiteral(hash)
            });
            path.node.body.unshift(cv);
            return {
                fileCoverage: coverageData,
                sourceMappingURL: visitState.sourceMappingURL
            };
        }
    };
}

exports.default = programVisitor;