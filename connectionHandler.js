//  Project:    WhiteboardJS
//  Author:     Nick Snyder

/*jshint loopfunc: true */

var req;
var res;
var connections = [];

module.exports = ConnectionHandler;

function ConnectionHandler() {
  req = (typeof arguments[0] !== 'undefined' && arguments[0] !== null) ?
    arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined' && arguments[1] !== null) ?
    arguments[1] : null;
}

ConnectionHandler.prototype = {
  add: function() {
    connections.push({});
  },
  kill: function() {

  },
  get: function() {
    var connectionToGet = (typeof arguments[0] !== 'undefined' && arguments[0] !== null) ?
      arguments[0] : null;

    // Gather the connection from the connections array and return it
  }
};
