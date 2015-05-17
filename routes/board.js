//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var board = require('../dal/board');

module.exports = {
  deliver: function(data, callback)
  {
    var userBoards = new board(null, data.userId, null);

    var boardCollection = userBoards.fetchAll(function() {
      if(typeof callback === 'function')
      {
        callback();
      }
    });

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

    if(typeof data.BoardID === 'undefined')
    {
      data.BoardID = null;
    }

    var dbBoard = new board(data.BoardID, data.UserID, data.Board);

    //console.log(dbBoard);
    dbBoard.upsert();
  },
  createBoard: function()
  {
    //
  }
};