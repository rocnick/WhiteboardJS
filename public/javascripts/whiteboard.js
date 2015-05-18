//  Project:   Whiteboard JS
//  Author:    Nick Snyder

// JSHint handling
/*jshint loopfunc: true */

var whiteboard = function() {
  var context = this;

  this.boardId = null;
  this.brush = 'brush';
  this.mouse = {
    x: 0,
    y: 0,
    down: false,
    start: [0,0],
    end: [0,0]
  };
  this.canvas = [];
  this.currentDraw = null;

  this.socket = io('http://localhost:1093');
  
  this.socket.on('boards', function (data) {
    console.log(data);
  });

  window.onresize = document.getElementsByTagName('body')[0].onload = this.resizeWorkspace;

  // Attach click handlers to palette buttons
  var paletteButtons = document.getElementsByClassName('paletteButton');

  for(var i = 0, l = paletteButtons.length; i < l; i++)
  {
    paletteButtons[i].addEventListener('click', function(e) {
      context.paletteClick(this, e);
    }, false);
  }

  // Add the mouse cursor to the board
  var board = document.getElementById('board');

  if (typeof board !== 'undefined' && board !== null)
  {
    board.addEventListener('mousemove', function(e) {
      context.boardMouseMove(this, e);
    }, false);
    board.addEventListener('mousedown', function(e) {
      context.boardMouseDown(this, e);
    }, false);
    board.addEventListener('mouseup', function(e) {
      context.boardMouseUp(this, e);
    }, false);
  }

  this.init();
};

whiteboard.prototype = {
  init: function()
  {
    if(typeof boardInfo[0] !== 'undefined' && boardInfo[0] !== null && boardInfo[0] != 'undefined')
    {
      // We are going to take the first board and make it the working board
      if(typeof boardInfo[0]._id !== 'undefined' && boardInfo[0]._id !== null && boardInfo[0]._id !== 'undefined')
      {
        this.boardId = boardInfo[0]._id;
        var board = document.getElementById('board');
        board.innerHTML = '<svg>' + boardInfo[0].Board + '</svg>';
      }
    }
  },
  paletteClick: function(context, e)
  {
    var activePalette = document.getElementsByClassName('active');
    
    // Remove the active class from any other palette buttons
    for(var i = 0, l = activePalette.length; i < l; i++)
    {
      activePalette[i].classList.remove('active');
    }

    this.brush = context.dataset.palette;

    context.classList.add('active');
  },
  boardMouseDown: function(context, e)
  {
    this.mouse.start = [
      this.mouse.x,
      this.mouse.y
    ];

    this.mouse.down = true;

    this.draw[this.brush].begin(this, context, e);
  },
  boardMouseUp: function(context, e)
  {
    this.mouse.down = false;

    if (this.draw[this.brush].obj)
    {
      this.mouse.end = [
        this.mouse.x,
        this.mouse.y
      ];
      
      this.draw[this.brush].complete(this, context, e);
    }
  },
  boardMouseMove: function(context, e)
  {
    this.mouse.x = (e.clientX || e.pageX) - context.offsetLeft;
    this.mouse.y = (e.clientY || e.pageY) - context.offsetTop;

    if (this.mouse.down)
    {
      this.draw[this.brush].act(this, context, e);
    }
  },
  draw: {
    brush: {
      act: function(context, board, e)
      {
        var ele = document.getElementById(context.currentDraw);
        var currentPoint = context.mouse.x + ',' + context.mouse.y;
        var updatedPoints = ele.getAttribute('points') + ' ' + currentPoint;

        ele.setAttribute('points', updatedPoints);

        context.draw.redraw(context, board.children[0]);
      },
      begin: function(context, board, e)
      {
        var currentPoint = context.mouse.start[0] + ',' + context.mouse.start[1];
        var ele = document.createElement('polyline');
        var strokeColor = document.getElementById('drawStrokeColor').value;
        var strokeWidth = document.getElementById('drawStrokeWidth').value;
        var strokeOpacity = parseInt(document.getElementById('drawStrokeOpacity').value) / 100;
        context.currentDraw = 'wbE' + board.children[0].children.length;

        ele.setAttribute('id', context.currentDraw);
        ele.setAttribute('points', currentPoint);
        ele.setAttribute('stroke', strokeColor);
        ele.setAttribute('stroke-opacity', strokeOpacity);
        ele.setAttribute('fill', 'none');
        ele.setAttribute('stroke-width', strokeWidth);
        ele.setAttribute('stroke-linecap', 'round');
        ele.setAttribute('stroke-linejoin', 'round');

        board.children[0].appendChild(ele);

        context.draw.redraw(context, board.children[0]);
      },
      complete: function(context, board, e)
      {
        context.mouse.start = context.mouse.end = [0,0];

        context.draw.redraw(context, board.children[0]);
      },
      continuous: true,
      obj: true
    },
    pencil: {
      act: function(context, board, e)
      {
        var ele = document.getElementById(context.currentDraw);
        var currentPoint = context.mouse.x + ',' + context.mouse.y;
        var updatedPoints = ele.getAttribute('points') + ' ' + currentPoint;

        ele.setAttribute('points', updatedPoints);

        context.draw.redraw(context, board.children[0]);
      },
      begin: function(context, board, e)
      {
        var currentPoint = context.mouse.start[0] + ',' + context.mouse.start[1];
        var ele = document.createElement('polyline');
        var strokeColor = document.getElementById('drawStrokeColor').value;
        var strokeWidth = document.getElementById('drawStrokeWidth').value;
        var strokeOpacity = parseInt(document.getElementById('drawStrokeOpacity').value) / 100;
        context.currentDraw = 'wbE' + board.children[0].children.length;

        ele.setAttribute('id', context.currentDraw);
        ele.setAttribute('points', currentPoint);
        ele.setAttribute('stroke', strokeColor);
        ele.setAttribute('stroke-opacity', strokeOpacity);
        ele.setAttribute('fill', 'none');
        ele.setAttribute('stroke-width', strokeWidth);
        ele.setAttribute('stroke-linecap', 'butt');
        ele.setAttribute('stroke-linejoin', 'miter');

        board.children[0].appendChild(ele);

        context.draw.redraw(context, board.children[0]);
      },
      complete: function(context, board, e)
      {
        context.mouse.start = context.mouse.end = [0,0];

        context.draw.redraw(context, board.children[0]);
      },
      continuous: true,
      obj: false
    },
    fill: {
      act: function()
      {
        console.log('filling the world');
      },
      begin: function(context, board, e)
      {

      },
      complete: function(context, board, e)
      {

      },
      continuous: false,
      obj: false
    },
    eraser: {
      act: function(context, board, e)
      {
        console.log('erasing your life');
      },
      begin: function(context, board, e)
      {

      },
      complete: function(context, board, e)
      {

      },
      continuous: true,
      obj: false
    },
    rect: {
      act: function(context, board, e)
      {
        var ele = document.getElementById(context.currentDraw);

        var startPoint = context.mouse.start;
        var endPoint = [context.mouse.x, context.mouse.y];
        var width = (startPoint[0] >= endPoint[0]) ? (startPoint[0] - endPoint[0]) : (endPoint[0] - startPoint[0]);
        var height = (startPoint[1] >= endPoint[1]) ? (startPoint[1] - endPoint[1]) : (endPoint[1] - startPoint[1]);

        ele.setAttribute('x', ((startPoint[0] >= endPoint[0]) ? endPoint[0] : startPoint[0]));
        ele.setAttribute('y', ((startPoint[1] >= endPoint[1]) ? endPoint[1] : startPoint[1]));

        ele.setAttribute('width', width);
        ele.setAttribute('height', height);

        context.draw.redraw(context, board.children[0]);
      },
      begin: function(context, board, e)
      {
        var startPoint = context.mouse.start;
        var ele = document.createElement('rect');
        var strokeColor = document.getElementById('drawStrokeColor').value;
        var strokeWidth = document.getElementById('drawStrokeWidth').value;
        var strokeOpacity = parseInt(document.getElementById('drawStrokeOpacity').value) / 100;
        var fillColor = document.getElementById('drawFillColor').value;
        var fillOpacity = parseInt(document.getElementById('drawFillOpacity').value) / 100;
        context.currentDraw = 'wbE' + board.children[0].children.length;

        ele.setAttribute('id', context.currentDraw);
        ele.setAttribute('x', startPoint[0]);
        ele.setAttribute('y', startPoint[1]);
        ele.setAttribute('width', 1);
        ele.setAttribute('height', 1);
        ele.setAttribute('stroke', strokeColor);
        ele.setAttribute('stroke-width', strokeWidth);
        ele.setAttribute('stroke-opacity', strokeOpacity);
        ele.setAttribute('fill', fillColor);
        ele.setAttribute('fill-opacity', fillOpacity);

        board.children[0].appendChild(ele);

        context.draw.redraw(context, board.children[0]);
      },
      complete: function(context, board, e)
      {
        var startPoint = context.mouse.start;
        var endPoint = [context.mouse.x, context.mouse.y];
        var width = (startPoint[0] >= endPoint[0]) ? (startPoint[0] - endPoint[0]) : (endPoint[0] - startPoint[0]);
        var height = (startPoint[1] >= endPoint[1]) ? (startPoint[1] - endPoint[1]) : (endPoint[1] - startPoint[1]);
        var ele = document.getElementById(context.currentDraw);
        
        // Reset the drawing positions
        context.mouse.start = context.mouse.end = [0,0];

        if(width === 0 || height === 0)
        {
          ele.parentNode.removeChild(ele);
        }

        context.draw.redraw(context, board.children[0]);
      },
      continuous: true,
      obj: true
    },
    circle: {
      act: function(context, board, e)
      {
        var ele = document.getElementById(context.currentDraw);

        var startPoint = context.mouse.start;
        var endPoint = [context.mouse.x, context.mouse.y];
        var rx = (startPoint[0] >= endPoint[0]) ? (startPoint[0] - endPoint[0]) : (endPoint[0] - startPoint[0]);
        var ry = (startPoint[1] >= endPoint[1]) ? (startPoint[1] - endPoint[1]) : (endPoint[1] - startPoint[1]);

        ele.setAttribute('rx', rx);
        ele.setAttribute('ry', ry);

        context.draw.redraw(context, board.children[0]);
      },
      begin: function(context, board, e)
      {
        var startPoint = context.mouse.start;
        var ele = document.createElement('ellipse');
        var strokeColor = document.getElementById('drawStrokeColor').value;
        var strokeWidth = document.getElementById('drawStrokeWidth').value;
        var strokeOpacity = parseInt(document.getElementById('drawStrokeOpacity').value) / 100;
        var fillColor = document.getElementById('drawFillColor').value;
        var fillOpacity = parseInt(document.getElementById('drawFillOpacity').value) / 100;
        context.currentDraw = 'wbE' + board.children[0].children.length;

        ele.setAttribute('id', context.currentDraw);
        ele.setAttribute('cx', startPoint[0]);
        ele.setAttribute('cy', startPoint[1]);
        ele.setAttribute('rx', 1);
        ele.setAttribute('ry', 1);
        ele.setAttribute('stroke', strokeColor);
        ele.setAttribute('stroke-width', strokeWidth);
        ele.setAttribute('stroke-opacity', '1');
        ele.setAttribute('fill', fillColor);
        ele.setAttribute('fill-opacity', '1');

        board.children[0].appendChild(ele);

        context.draw.redraw(context, board.children[0]);
      },
      complete: function(context, board, e)
      {
        var startPoint = context.mouse.start;
        var endPoint = [context.mouse.x, context.mouse.y];
        var rx = (startPoint[0] >= endPoint[0]) ? (startPoint[0] - endPoint[0]) : (endPoint[0] - startPoint[0]);
        var ry = (startPoint[1] >= endPoint[1]) ? (startPoint[1] - endPoint[1]) : (endPoint[1] - startPoint[1]);
        var ele = document.getElementById(context.currentDraw);
        
        // Reset the drawing positions
        context.mouse.start = context.mouse.end = [0,0];

        if(rx === 0 && ry === 0)
        {
          ele.parentNode.removeChild(ele);
        }

        context.draw.redraw(context, board.children[0]);
      },
      continuous: true,
      obj: true
    },
    type: {
      act: function(context, board, e)
      {

      },
      begin: function(context, board, e)
      {

      },
      complete: function(context, board, e)
      {

      },
      continuous: false,
      obj: true
    },
    redraw: function(context, element)
    {
      element.innerHTML = element.innerHTML;
      
      if((typeof userInfo === 'undefined' || userInfo === null) || (typeof userInfo.userId === 'undefined' || userInfo.userId === null))
      {
        return;
      }

      var data = {
        "BoardID": context.boardId,
        "UserID": userInfo.userId,
        "Board": element.innerHTML,
        "commit": !context.mouse.down
      };
      context.socket.emit('inboundBoard', data);
    }
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
    }
    catch(Exception) {}
  }
};

new whiteboard();