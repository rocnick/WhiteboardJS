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

  this.getBoards(req.cookies.wbUser.userId);
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
    console.log(userId);
    console.log('hwowijafsodifjasdfoijsdfoisjdfosidjfsodifj')
    var newBoard = new board(null, userId, '');

    newBoard.insert(callback);
  },
  getBoards: function(userId)
  {
    if(typeof userId === 'undefined' || userId === null)
    {
      this.userBoards = 'undefined';
      return;
    }

    var context = this;
    var callback = function(result) {
      context.userBoards = result;

      if(!result)
      {
        context.createFreshBoard(userId, function() {
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