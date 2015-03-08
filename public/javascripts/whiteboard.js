//  Project:   Whiteboard JS
//  Author:    Nick Snyder
var whiteboard = function() {
  window.onresize = document.getElementsByTagName('body')[0].onload = this.resizeWorkspace;
};

whiteboard.prototype = {
  resizeWorkspace: function()
  {
    var body = document.getElementsByTagName('body')[0];
    var header = document.getElementsByTagName('header')[0];
    var board = document.getElementById('board');
    var palette = document.getElementById('palette');

    try {
      palette.style.height = board.style.height = parseInt(body.offsetHeight) - parseInt(header.offsetHeight) + 'px';
      palette.style.marginTop = board.style.marginTop = parseInt(header.offsetHeight) + 'px';
    }
    catch(Exception) {}
  }
};

new whiteboard();