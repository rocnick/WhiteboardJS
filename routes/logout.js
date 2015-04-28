//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var logout = require('../controllers/logout');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  new logout(res);
});

module.exports = router;