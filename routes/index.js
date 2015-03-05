//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WhiteboardJS' });
});

module.exports = router;
