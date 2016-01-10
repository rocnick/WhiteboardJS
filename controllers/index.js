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
  this.userInfo = (typeof req.cookies.wbUser !== 'undefined') ? req.cookies.wbUser : 'undefined';
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
      users: 'undefined',
      userBoards: boardCollection
    });
  },
  getSharedBoards: function(userInfo) {
    var context = this;
    var selector = new board({ UserID: userInfo.UserID });

    selector.fetchAllSharedWithPolygons(function(result) {
      if (typeof result !== undefined && result !== null) {
        context.userBoards = context.userBoards.concat(result);
      }

      context.showIndex();
    });
  },
  getBoards: function(userInfo) {
    // If the user is not logged in to an account, just give them a base board to draw on
    if(typeof userInfo === 'undefined' || userInfo === 'undefined' || userInfo === null) {
      this.showIndex();
      return;
    }

    var context = this;
    var selector = new board({ UserID: userInfo.UserID, Username: userInfo.Username });

    selector.fetchAllWithPolygons(function(result) {
      context.userBoards = result;

      // The user is likely new and has no boards.
      // This will create one for them so they are able
      // to start drawing right away.
      if(!result || result.length === 0) {
        selector.insert(function(result) {
          context.userBoards = [{
            BoardID: result.BoardID,
            UserID: result.UserID,
            Username: context.userInfo.Username,
            Polygons: [],
            Sharing: 'private',
            Shared: []
          }];
          context.getSharedBoards(userInfo);
        });
      } else {
        context.getSharedBoards(userInfo);
      }
    });
  }
};
