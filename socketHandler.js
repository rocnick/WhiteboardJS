//  Project:    WhiteboardJS
//  Author:     Nick Snyder

/*jshint loopfunc: true */

var board = require('./dal/board');
var polygon = require('./dal/polygon');

module.exports = function(socket, ch) {
  // Request the boards
  socket.on('requestBoards', function(data) {
    new board(data).fetchAll(function(results) {
      socket.emit('boards', results);
    });
  });

  // Request polygons
  socket.on('requestPolygons', function(data) {
    new polygon(data).fetch(function(results) {
      socket.emit('polygons', results);
    });
  });

  // Save an existing board
  socket.on('saveBoard', function(data) {
    new board(data).update(function(result) {
      socket.emit('boardUpdate', 'result');
    });
  });

  // Create a new board
  socket.on('newBoard', function(data) {
    new board(data).insert(function(result) {
      socket.emit('createdBoard', result);
    });
  });

  // Delete a board
  socket.on('deleteBoard', function(data) {
    new board(data).delete(function(result) {
      socket.emit('deletionResponse', result);
    });
  });

  // Upsert a polygon
  socket.on('inboundPolygon', function(data) {
    if (data.commit)
      new polygon(data).upsert();
  });

  socket.on('identifyConnection', function(data) {
    if (typeof data !== 'undefined' && data !== null) {
      ch.identifyConnection({
        id: socket.id,
        userId: data
      });
    }
  });
};
