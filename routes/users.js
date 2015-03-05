//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('Just a test');
});

module.exports = router;
