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

  this.showIndex();
}

Whiteboard.prototype = {
  showIndex: function()
  {
    // Gather out the user cookie
    var userInfo = (typeof req.cookies.wbUser !== 'undefined') ? JSON.stringify(req.cookies.wbUser) : 'undefined';

    this.boards = this.getBoards(req.cookies.wbUser.userId);

    res.render('index', {
      title: 'WhiteboardJS',
      user: userInfo,
      userBoards: this.boards
    });
  },
  getBoards: function(userId)
  {
    if(typeof userId === 'undefined' || userId === null)
    {
      return 'undefined';
    }

    var foundBoards = new board();
    foundBoards.UserID = userId;

    foundBoards.fetchAll(function(result) {
      console.log(result);
    });
  }
};