//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('signup', { title: 'WhiteboardJS' });
});

router.post('/', function(req, res) {
  var createUser = new signup(req.body, res);
});

module.exports = router;