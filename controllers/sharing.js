//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var board = require('../dal/board');
var user = require('../dal/user');
var req = null;
var res = null;

module.exports = Sharing;

function Sharing() {
  req = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;

  this.userBoards = null;
  this.users = null;
  this.userInfo = (typeof req.cookies.wbUser !== 'undefined') ? req.cookies.wbUser.UserID : 'undefined';

  this.getBoards(this.userInfo);
}

Sharing.prototype = {
  showPage: function() {
    // Gather out the user cookie
    var userInfo = (typeof req.cookies.wbUser !== 'undefined') ? JSON.stringify(req.cookies.wbUser) : 'undefined';
    var boardCollection = (typeof this.userBoards !== 'undefined') ? JSON.stringify(this.userBoards) : 'undefined';
    var userCollection = (typeof this.users !== 'undefined') ? JSON.stringify(this.users) : 'undefined';

    res.render('sharing', {
      title: 'WhiteboardJS',
      user: userInfo,
      users: userCollection,
      userBoards: boardCollection
    });
  },
  getUsers: function() {
    var context = this;
    var selector = new user();
    selector.fetchAll(function(response) {
      context.users = response;
      context.showPage();
    });
  },
  getBoards: function(userId) {
    // If the user is not logged in to an account, just give them a base board to draw on
    if(typeof userId === 'undefined' || userId === 'undefined' || userId === null) {
      res.redirect('/');
      return;
    }

    var context = this;
    var selector = new board({UserID: userId});

    selector.fetchAllWithPolygons(function(result) {
      context.userBoards = result;

      if(!result || result.length === 0) {
        selector.insert(function(result) {
          context.userBoards = [{ _id: result.BoardID, UserID: result.UserID }];
          context.getUsers();
        });
      } else {
        context.getUsers();
      }
    });
  }
};
