//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var sharing = require('../controllers/sharing');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  new sharing(req, res);
});

module.exports = router;
