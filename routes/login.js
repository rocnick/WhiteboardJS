//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'WhiteboardJS' });
});

module.exports = router; 