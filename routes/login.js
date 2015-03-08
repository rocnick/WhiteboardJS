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
  var credentials = req.body;
  if(login.verifyCredentials())
    res.send('successful login');
  else
    res.send('failed login');
});

module.exports = router; 