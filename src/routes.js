var url         = require('url');
var mysql       = require('mysql');
var dbInfo      = require('../config/db');

module.exports = function(app) {
    // Handle API calls

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('*', function(req, res) {
        location = url.parse(req.url, true);
        var db = mysql.createConnection({
            host: dbInfo.host,
            user: dbInfo.user,
            password: dbInfo.password,
            database: dbInfo.database
        });

        if(location.pathname && location.pathname.indexOf('/') != -1)
        {
            var handler = (location.pathname.indexOf('/')==0)?location.pathname.split('/').splice(1):location.pathname.split('/');

            if(handler[0] != 'favicon.ico')     // Weird bug fix
            {
                var ctrl = require('./controllers/' + handler[0]);

                if(handler.length > 1 && typeof ctrl[handler[1]] != 'undefined')
                {
                    ctrl[handler[1]](req, res, db, location.query);
                }
                else
                {
                    ctrl.get(req, res, db, location.query);
                }
            }
        }
    });

    // Handle uploads
    app.post('/video/add', function(req, res) {
        var db = mysql.createConnection({
            host: dbInfo.host,
            user: dbInfo.user,
            password: dbInfo.password,
            database: dbInfo.database
        });

        location = url.parse(req.url, true);

        var ctrl = require('./controllers/video');

        ctrl.add(req, res, db, location.query);
    });
}
