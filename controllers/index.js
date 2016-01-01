//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var url = require('url');
var board = require('../dal/board');
var req = null;
var res = null;
var viewState = null;

module.exports = Whiteboard;

function Whiteboard() {
  req = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;

  // Get some URL query parameters if they exist
  var urlParts = url.parse(req.url, true);
  var urlParams = urlParts.query;

  this.userBoards = null;
  this.userInfo = (typeof req.cookies.wbUser !== 'undefined') ? req.cookies.wbUser.UserID : 'undefined';
  this.BoardID = (typeof urlParams.bid !== 'undefined') ? urlParams.bid : null;

  this.getBoards(this.userInfo, this.BoardID);
}

Whiteboard.prototype = {
  showIndex: function() {
    // Gather out the user cookie
    var userInfo = (typeof req.cookies.wbUser !== 'undefined') ? JSON.stringify(req.cookies.wbUser) : 'undefined';
    var boardCollection = (typeof this.userBoards !== 'undefined') ? JSON.stringify(this.userBoards) : 'undefined';

    res.render('index', {
      title: 'WhiteboardJS',
      user: userInfo,
      users: 'undefined', // Alter this eventually to pass in all users.
      userBoards: boardCollection
    });
  },
  getBoards: function(userId, boardId) {
    // If the user is not logged in to an account, just give them a base board to draw on
    if(typeof userId === 'undefined' || userId === 'undefined' || userId === null) {
      this.showIndex();
      return;
    }

    var context = this;
    var selector = new board({UserID: userId, BoardID: boardId});

    selector.fetchAll(function(result) {
      context.userBoards = result;

      if(!result || result.length === 0) {
        selector.insert(function(result) {
          context.userBoards = [{ _id: result.BoardID, UserID: result.UserID }];
          context.showIndex();
        });
      } else {
        context.showIndex();
      }
    });
  }
};
