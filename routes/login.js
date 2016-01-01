//  Project:    WhiteboardJS
//  Author:     Nick Snyder

var express = require('express');
var login = require('../controllers/login');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // We need to provide user/board information for the login page

  res.render('login', {
    title: 'WhiteboardJS',
    user: 'undefined',
    users: 'undefined',
    userBoards: 'undefined',
    error: 'undefined'
  });
});

router.post('/', function(req, res) {
  var loginUser = new login(req.body, res);
});

module.exports = router;
