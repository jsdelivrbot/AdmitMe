'use strict';

exports.__esModule = true;
exports.default = isStaticRequire;
// todo: merge with module visitor
function isStaticRequire(node) {
  return node && node.callee && node.callee.type === 'Identifier' && node.callee.name === 'require' && node.arguments.length === 1 && node.arguments[0].type === 'Literal';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc3RhdGljUmVxdWlyZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7a0JBQ3dCLGU7QUFEeEI7QUFDZSxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDNUMsU0FBTyxRQUNMLEtBQUssTUFEQSxJQUVMLEtBQUssTUFBTCxDQUFZLElBQVosS0FBcUIsWUFGaEIsSUFHTCxLQUFLLE1BQUwsQ0FBWSxJQUFaLEtBQXFCLFNBSGhCLElBSUwsS0FBSyxTQUFMLENBQWUsTUFBZixLQUEwQixDQUpyQixJQUtMLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBbEIsS0FBMkIsU0FMN0I7QUFNRCIsImZpbGUiOiJjb3JlL3N0YXRpY1JlcXVpcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0b2RvOiBtZXJnZSB3aXRoIG1vZHVsZSB2aXNpdG9yXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1N0YXRpY1JlcXVpcmUobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJlxuICAgIG5vZGUuY2FsbGVlICYmXG4gICAgbm9kZS5jYWxsZWUudHlwZSA9PT0gJ0lkZW50aWZpZXInICYmXG4gICAgbm9kZS5jYWxsZWUubmFtZSA9PT0gJ3JlcXVpcmUnICYmXG4gICAgbm9kZS5hcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgbm9kZS5hcmd1bWVudHNbMF0udHlwZSA9PT0gJ0xpdGVyYWwnXG59XG4iXX0=