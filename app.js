//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var ioServer = require('http').createServer(app);
var io = require('socket.io')(ioServer);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Set up routes
var routes = require('./routes/index');
var signup = require('./routes/signup');
var login = require('./routes/login');
var logout = require('./routes/logout');
var board = require('./routes/board');

var app = express();

var viewState = {
    title: 'WhiteboardJS'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function(socket) {
  //socket.emit('news', { hello: 'world' });
  socket.on('inboundBoard', function (data) {
    board.insert(data);
  });
});

var serverPort = (process.env.PORT || 1092);
var socketPort = parseInt(serverPort) + 1;

var server = app.listen(serverPort, function() {
    console.log('Express server listening on port ' + server.address().port);
});

ioServer.listen(socketPort, function() {
    console.log('Socket.IO server listening on port ' + ioServer.address().port);
});

module.exports = app;
