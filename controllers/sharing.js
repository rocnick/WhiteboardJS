//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var req = null;
var res = null;

module.exports = Sharing;

function Sharing() {
  req = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;

  this.userBoards = null;

  this.showPage();
}

Sharing.prototype = {
  showPage: function() {
    // Gather out the user cookie
    var userInfo = (typeof req.cookies.wbUser !== 'undefined') ? JSON.stringify(req.cookies.wbUser) : 'undefined';
    var boardCollection = (typeof this.userBoards !== 'undefined') ? JSON.stringify(this.userBoards) : 'undefined';

    res.render('sharing', {
      title: 'WhiteboardJS',
      user: userInfo,
      userBoards: boardCollection
    });
  }
};
