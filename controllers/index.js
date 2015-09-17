var board = require('../dal/board');
var req = null;
var res = null;
var viewState = null;

module.exports = Whiteboard;

function Whiteboard()
{
  req = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;

  this.userBoards = null;
  this.userInfo = (typeof req.cookies.wbUser !== 'undefined') ? req.cookies.wbUser.userId : 'undefined';

  this.showIndex();
  //this.getBoards(this.userInfo);
}

Whiteboard.prototype = {
  showIndex: function()
  {
    // Gather out the user cookie
    var userInfo = (typeof req.cookies.wbUser !== 'undefined') ? JSON.stringify(req.cookies.wbUser) : 'undefined';
    var boardCollection = (typeof this.userBoards !== 'undefined') ? JSON.stringify(this.userBoards) : 'undefined';

    res.render('index', {
      title: 'WhiteboardJS',
      user: userInfo,
      userBoards: boardCollection
    });
  },
  createFreshBoard: function(userId, callback)
  {
    var newBoard = new board(null, userId, '');

    newBoard.insert(callback);
  },
  getBoards: function(userId)
  {
    if(typeof userId === 'undefined' || userId === 'undefined' || userId === null)
    {
      this.userBoards = 'undefined';

      this.showIndex();
      return;
    }

    var context = this;
    var callback = function(result) {
      context.userBoards = result;

      if(!result || result.length === 0)
      {
        context.createFreshBoard(userId, function(result) {
          context.userBoards = result;

          context.showIndex();
        });
      }
      else
      {
        context.showIndex();
      }
    };

    var foundBoards = new board();
    foundBoards.UserID = userId;

    foundBoards.fetchAll(callback);
  }
};