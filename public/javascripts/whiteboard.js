//  Project:   Whiteboard JS
//  Author:    Nick Snyder
var whiteboard = function() {
  var context = this;

  window.onresize = document.getElementsByTagName('body')[0].onload = this.resizeWorkspace;

  // Attach click handlers to palette buttons
  var paletteButtons = document.getElementsByClassName('paletteButton');

  for(var i = 0, l = paletteButtons.length; i < l; i++)
  {
    paletteButtons[i].addEventListener('click', function() {
      context.paletteClick(this);
    }, false);
  }

  // Add the mouse cursor to the board
  var board = document.getElementById('board');
  this.cursor = 'brush';

  board.addEventListener('mousemove', function(e) {
    context.boardMouseMove(this, e);
  }, false);
};

whiteboard.prototype = {
  paletteClick: function(context)
  {
    var activePalette = document.getElementsByClassName('active');
    
    // Remove the active class from any other palette buttons
    for(var i = 0, l = activePalette.length; i < l; i++)
    {
      activePalette[i].classList.remove('active');
    }
    
    context.brush = this.dataset-palette;

    context.classList.add('active');
  },
  boardMouseMove: function(context, e)
  {
    var mouseX = (e.clientX || e.pageX) - context.offsetLeft;
    var mouseY = (e.clientY || e.pageY) - context.offsetTop;

    console.log(mouseX + 'x' + mouseY);
  },
  resizeWorkspace: function()
  {
    var body = document.getElementsByTagName('body')[0];
    var header = document.getElementsByTagName('header')[0];
    var board = document.getElementById('board');
    var palette = document.getElementById('palette');

    try
    {
      palette.style.height = board.style.height = parseInt(body.offsetHeight) - parseInt(header.offsetHeight) + 'px';
      palette.style.marginTop = board.style.marginTop = parseInt(header.offsetHeight) + 'px';
    }
    catch(Exception) {}
  }
};

new whiteboard();