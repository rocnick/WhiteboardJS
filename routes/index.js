//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var server = require('http').createServer(express);
var io = require('socket.io')(server);
var index = require('../controllers/index');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  new index(req, res);
});

io.on('connection', function() { console.log('connection made'); });

server.listen(2092);

module.exports = router;