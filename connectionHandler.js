//  Project:    WhiteboardJS
//  Author:     Nick Snyder

/*jshint loopfunc: true */

var board = require('./dal/board');

module.exports = ConnectionHandler;

function ConnectionHandler(data) {
  if (typeof data === 'undefined' || data === null) {
    return;
  }

  this.io = (typeof data === 'undefined' || data === null) ? null : data;
  this.connections = [];
}

ConnectionHandler.prototype = {
  add: function(socket) {
    this.connections.push({
      userId: null,
      id: socket.id,
      socket: socket
    });
  },
  identifyConnection: function(conn) {
    var index = this.getConnectionIndex(this.getConnectionByField('id', conn.id));
    if (index === null) {
      return;
    }

    this.killPreviousConnection(conn.userId);

    index = this.getConnectionIndex(this.getConnectionByField('id', conn.id));
    this.connections[index].userId = conn.userId;
  },
  killPreviousConnection: function(userId) {
    var previousConnection = this.getConnectionByField('userId', userId);
    if (typeof previousConnection === 'undefined' || previousConnection === null) {
      return;
    }

    this.kill(previousConnection);
  },
  kill: function(socket) {
    var index = this.getConnectionIndex(socket);
    if (index !== null) {
      this.connections.splice(index, 1);
    }
  },
  getConnectionByField: function(field, value) {
    if ((typeof field === 'undefined' || field === null) ||
        (typeof value === 'undefined' || value === null)) {
      return null;
    }

    for (var i = 0, l = this.connections.length; i < l; i++) {
      if (this.connections[i][field] == value) {
        return this.connections[i].socket;
      }
    }

    return null;
  },
  getConnectionIndex: function(socket) {
    if (typeof socket === 'undefined' || socket === null) {
      return null;
    }

    for (var i = 0, l = this.connections.length; i < l; i++) {
      if (this.connections[i].id == socket.id) {
        return i;
      }
    }

    return null;
  },
  sendPolygonToWatchers: function(data) {
    var context = this;
    var selector = new board({ BoardID: data.BoardID });
    var users = [];

    selector.fetch(function(result) {
      users.push(result[0].UserID);
      for (var i = 0, l = result[0].Shared.length; i < l; i++) {
        users.push(result[0].Shared[i]._id);
      }

      context.emitPolygons(users, data);
    });
  },
  emitPolygons: function(users, polygon) {
    for (var i = 0, l = users.length; i < l; i++) {
      var socket = this.getConnectionByField('userId', users[i]);

      if (typeof socket === 'undefined' || socket === null) {
        continue;
      }
      socket.emit('polygon', polygon);
    }
  }
};
