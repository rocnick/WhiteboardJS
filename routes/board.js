//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var board = require('../dal/board');

module.exports = {
  deliver: function(callback)
  {
    var boardCollection = [];

    if(typeof callback === 'function')
    {
      callback(boardCollection);
    }
  },
  upsert: function(data)
  {
    if(typeof data === 'undefined' || data === null)
    {
      return;
    }

    if(typeof data.boardId === 'undefined')
    {
      data.boardId = null;
    }

    var dbBoard = new board(data.boardId, data.userId, data.board);

    console.log(dbBoard);
    //dbBoard.upsert();
  },
  createBoard: function()
  {
    //
  }
};