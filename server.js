// iOS Hackathon February 2015
// 
// Author:  Nick Snyder
// Team:
//          Wyatt McBain
//          Caitlyn Orta
//          Clay Herendeen

// --------------- Modules ---------------

var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var request         = require('request');
var methodOverride  = require('method-override');
var url             = require('url');
var mysql           = require('mysql');

// --------------  Config  ---------------

var dbInfo = require('./config/db');

var port = process.env.PORT || 1066;

// Handle JSON POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// --------------  Routes  ---------------
require('./src/routes')(app);

// --------------  Deploy  ---------------
app.listen(port);

console.log("Server listening on port: " + port);

module.exports = app;