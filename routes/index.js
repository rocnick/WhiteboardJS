//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var index = require('../controllers/index');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  new index(req, res);
});

module.exports = router;