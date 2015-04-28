//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var login = require('../controllers/login');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'WhiteboardJS' });
});

router.post('/', function(req, res) {
  var loginUser = new login(req.body, res);
});

module.exports = router;