//  Project:   Whiteboard JS
//  Author:    Nick Snyder
var whiteboard = function() {
  document.getElementsByTagName('body')[0].onload = this.resizeWorkspace;
  window.onresize = this.resizeWorkspace;
};

whiteboard.prototype = {
  resizeWorkspace: function()
  {
    var body = document.getElementsByTagName('body')[0];
    var header = document.getElementsByTagName('header')[0];
    var board = document.getElementById('board');
    var palatte = document.getElementById('palatte');

    palatte.style.height = board.style.height = parseInt(body.offsetHeight) - parseInt(header.offsetHeight) + 'px';
    palatte.style.marginTop = board.style.marginTop = parseInt(header.offsetHeight) + 'px';
  }
};

new whiteboard();