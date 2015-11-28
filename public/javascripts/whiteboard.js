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

  var siteHost = window.location.host.toString();
  var sitePort = 81;

  if (siteHost.indexOf(':') !== -1)
  {
    var siteInfo = siteHost.split(':');
    siteHost = siteInfo[0];
    sitePort = parseInt(siteInfo[1]) + 1;
  }

  // Configure socket and initialize board data
  this.socket = io('http://' + siteHost + ':' + sitePort);

  // Create socket listeners
  this.socket.on('boards', function (data) {
    var boardInfo = (data !== null) ? data : [];
  });
  this.socket.on('polygons', function (data) {
    var boardContainer = document.getElementById('board');
    if (typeof boardContainer === 'undefined' || boardContainer === null) {
      return false;
    }

    var polygonResponse = (data !== null) ? data : [];

    // The polygon string to insert into the board
    var polygons = '';

    for (var i = 0, l = polygonResponse.Polygons.length; i < l; i++) {
      polygons += polygonResponse.Polygons[i].Polygon;
    }

    if (polygonResponse.BoardID == context.boardId) {
      document.getElementById('board').innerHTML = '<svg>' + polygons + '</svg>';
    }

    // Gather the board thumbs and add the svg to the thumb
    var boardThumb = document.querySelector('div[data-board=\'' + polygonResponse.BoardID + '\']');
    boardThumb.innerHTML = '<svg width="100%" height ="100%"><g transform="scale(0.3)">' + polygons + '</g></svg>';

    // The polygons have been added to the thumbnail,
    // now let's append the delete button also
    var del = document.createElement('div');
    del.setAttribute('class', 'deleteBoard');
    del.addEventListener('click', function(e) {
      context.deleteBoardClick(this, e);
    });
    boardThumb.appendChild(del);
  });
  this.socket.on('createdBoard', function(data) {
    if (data.Created) {
      context.addCreatedBoard(data);
    }
  });
  this.socket.on('deletionResponse', function(data) {
    if (data.Deleted) {
      context.finalizeDeletion(data);
    }
  });
  context.init();

  // Handle resizing page both on load and whenever window resized by user
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
};

whiteboard.prototype = {
  init: function()
  {
    var context = this;

    if(boardInfo !== null && boardInfo.length > 0 && typeof boardInfo[0] !== 'undefined' && boardInfo[0] !== null && boardInfo[0] != 'undefined')
    {
      // We are going to take the first board and make it the working board
      if(typeof boardInfo[0]._id !== 'undefined' && boardInfo[0]._id !== null && boardInfo[0]._id !== 'undefined')
      {
        this.boardId = boardInfo[0]._id;
      }
    }

    // Using jQuery here because animations
    $(document).ready(function() {
      var addBoard = document.createElement('div');
      addBoard.setAttribute('class', 'addBoard');
      addBoard.setAttribute('id', 'addBoardButton');
      addBoard.addEventListener('click', function(e) {
        context.newBoardClick(this, e);
      }, false);

      $('#userBoards').append(addBoard);

      for(var i = 0, l = boardInfo.length; i < l; i++)
      {
        var bp = document.createElement('div');

        // Create the view of the board thumbnail
        bp.style.width = '150px';
        bp.style.height = '90px';
        bp.style.borderWidth = '1px';
        bp.style.borderStyle = 'solid';
        bp.style.borderColor = '#000';
        bp.style.margin = '4px 10px';
        bp.setAttribute('class', 'boardThumb');
        bp.setAttribute('data-board', boardInfo[i]._id);

        // Add the listener to choose this board to work on
        bp.addEventListener('click', function(e) {
          context.selectBoard(this, e);
        });

        // If this is the currently selected board, make it active
        if(boardInfo[i]._id == context.boardId)
        {
          bp.setAttribute('class', bp.getAttribute('class') + ' activeBoard');
        }

        // Make a request over the socket for the polygons of this board
        context.socket.emit('requestPolygons', { BoardID: boardInfo[i]._id });

        $('#userBoards').append(bp);
      }

      $('#userBoards .handle').on('click', function() {
        var newWidth = 20;

        if ($(this).parent().width() == 20)
        {
          newWidth = $(this).parent().parent().width() - $('#palette').width() -14;
        }

        $(this).css({
          width: '20px'
        }).parent().animate({
          width: newWidth
        }, 1000);
      });
    });
  },
  selectBoard: function(context, e)
  {
    var selectedBoard = context.dataset.board;
    var activeThumbs = document.getElementsByClassName('boardThumb');
    var i, l;

    for(i = 0, l = activeThumbs.length; i < l; i++)
    {
      if(activeThumbs[i].getAttribute('class').indexOf('activeBoard') != -1)
      {
        activeThumbs[i].setAttribute('class', (activeThumbs[i].getAttribute('class')).replace('activeBoard', '').replace('  ', ' '));
      }

      if(activeThumbs[i].dataset.board == selectedBoard)
      {
        activeThumbs[i].setAttribute('class', activeThumbs[i].getAttribute('class') + ' activeBoard');
        var svgContainer = activeThumbs[i].children[0];
        var svgContent = svgContainer.children[0].innerHTML;
        document.getElementById('board').innerHTML = '<svg>' + svgContent + '</svg>';
      }
    }

    this.boardId = selectedBoard;
  },
  addCreatedBoard: function(board)
  {
    context = this;

    var addBoardButton = document.getElementById('addBoardButton');
    var bp = document.createElement('div');
    var staleBoard = document.getElementById('board');
    var activeBoards = document.getElementsByClassName('activeBoard');
    var del = document.createElement('div');

    del.setAttribute('class', 'deleteBoard');
    del.addEventListener('click', function(e) {
      context.deleteBoardClick(this, e);
    });

    for(var i = 0, l = activeBoards.length; i < l; i++)
    {
      activeBoards[i].setAttribute('class', (activeBoards[i].getAttribute('class')).replace('activeBoard', '').replace('  ', ' '));
    }

    bp.style.width = '150px';
    bp.style.height = '90px';
    bp.style.borderWidth = '1px';
    bp.style.borderStyle = 'solid';
    bp.style.borderColor = '#000';
    bp.style.margin = '4px 10px';

    bp.setAttribute('class', 'boardThumb');
    bp.setAttribute('class', bp.getAttribute('class') + ' activeBoard');
    bp.setAttribute('data-board', board.BoardID);

    bp.innerHTML = '<svg width="100%" height ="100%"></svg>';
    staleBoard.innerHTML = '<svg></svg>';

    boardInfo.unshift(board);

    bp.appendChild(del);
    addBoardButton.parentNode.insertBefore(bp, addBoardButton.nextSibling);
  },
  finalizeDeletion: function(board)
  {
    var boardThumb = document.querySelector('div[data-board=\'' + board.BoardID + '\']');
    boardThumb.parentNode.removeChild(boardThumb);

    // Ensure that there is still a selected board
    if (document.querySelector('div.activeBoard') === null) {
      document.querySelector('div[data-board]').click();
    }
  },
  deleteBoardClick: function(context, e)
  {
    // We don't want the event to bubble to the parent
    e.stopPropagation();

    // Go ahead and send the delete request
    this.socket.emit('deleteBoard', { "UserID": userInfo.UserID, "BoardID": context.parentNode.dataset.board });
  },
  newBoardClick: function(context, e)
  {
    this.socket.emit('newBoard', { "UserID": userInfo.UserID });
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
    createId: function(context, board) {
      var eleId = 'wbE-';
      var nextEleNum = 0;

      if (board.children[0].children.length > 0) {
        var lastEleId = board.children[0].children[board.children[0].children.length-1].id;
        var eleParts = lastEleId.split('-');
        nextEleNum = parseInt(eleParts[eleParts.length-1]) + 1;
      }

      if (typeof context.boardId !== 'undefined' && context.boardId !== null) {
        eleId += context.boardId + '-';
      }

      if (typeof userInfo.UserID !== 'undefined' && userInfo.UserID !== null) {
        eleId += userInfo.UserID + '-';
      }

      return eleId += nextEleNum;
    },
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
        context.currentDraw = context.draw.createId(context, board);

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
        context.currentDraw = context.draw.createId(context, board);

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
        context.currentDraw = context.draw.createId(context, board);

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
        context.currentDraw = context.draw.createId(context, board);

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
      // Commit the work to the main board
      element.innerHTML = element.innerHTML;

      if((typeof userInfo === 'undefined' || userInfo === null) || (typeof userInfo.UserID === 'undefined' || userInfo.UserID === null))
      {
        return;
      }

      context.commitPolygon(context, element);
    }
  },
  commitPolygon: function(context, element)
  {
    var polygon = document.getElementById(context.currentDraw).outerHTML;
    var data = {
      "BoardID": context.boardId,
      "PolygonID": context.currentDraw,
      "UserID": userInfo.UserID,
      "Polygon": polygon,
      "commit": !context.mouse.down
    };
    console.dir(data);
    context.socket.emit('inboundPolygon', data);
  },
  resizeWorkspace: function()
  {
    var body = document.getElementsByTagName('body')[0];
    var header = document.getElementsByTagName('header')[0];
    var board = document.getElementById('board');
    var userBoards = document.getElementById('userBoards');
    var palette = document.getElementById('palette');

    try
    {
      palette.style.height = board.style.height = parseInt(body.offsetHeight) - parseInt(header.offsetHeight) + 'px';
    }
    catch(Exception) {}
  }
};

new whiteboard();
