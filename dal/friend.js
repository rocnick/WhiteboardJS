//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var mysql = require('mysql');
var Credentials = require('dbcredentials'),
    dbCredentials = new Credentials();
var db = mysql.createConnection({
    user: dbCredentials.user,
    password: dbCredentials.password,
    host: dbCredentials.host,
    database: dbCredentials.database
});

module.exports = User;

function User()
{
    this.UserID1 = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
    this.UserID2 = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;

    this.Friends = null;
}

User.prototype = {
    fetch: function(callback)
    {
        if(typeof this.UserID1 === 'undefined' || this.UserID1 === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery = 'SELECT UserID1, UserID2 FROM Friend WHERE UserID1 = ?';

        db.connect();

        var toReturn = db.query(sqlQuery, [this.UserID1, this.UserID2], function(err, result) {
            db.end();

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.length > 0)
            {
                context.UserID1 = result[0].UserID1;
                context.UserID2 = result[0].UserID2;

                if(typeof callback === 'function')
                {
                    callback(true);
                }
            }
            else
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }
        });
    },
    fetchAll: function(callback)
    {
        if(typeof this.UserID1 === 'undefined' || this.UserID1 === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery = 'SELECT User.UserID, User.Username, User.FirstName, User.LastName, User.EmailAddress FROM User INNER JOIN Friend ON (User.UserID = Friend.UserID2) WHERE Friend.UserID1 = ?' +
                       'UNION' +
                       'SELECT User.UserID, User.Username, User.FirstName, User.LastName, User.EmailAddress FROM User INNER JOIN Friend ON (User.UserID = Friend.UserID1) WHERE Friend.UserID2 = ?';

        db.connect();
        
        var toReturn = db.query(sqlQuery, [this.UserID1, this.UserID1], function(err, result) {
            db.end();

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.length > 0)
            {
                context.Friends = [];

                for(var i = 0, l = result.length; i < l; i++)
                {
                    context.Friends.push(result[i]);
                }

                if(typeof callback === 'function')
                {
                    callback(context.Friends);
                }
            }
            else
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }
        });
    },
    insert: function(callback)
    {
        if((typeof this.UserID1 === 'undefined' || this.UserID1 === null) ||
           (typeof this.UserID2 === 'undefined' || this.UserID2 === null))
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery = 'INSERT INTO Friend (UserID1, UserID2) VALUES(?, ?)';

        db.connect();

        var toReturn = db.query(sqlQuery, [this.UserID1, this.UserID2], function(err, result) {
            db.end();

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(typeof result.insertId !== 'undefined')
            {
                context.UserID = result.insertId;
                if(typeof callback === 'function')
                {
                    callback(result.insertId);
                }
            }
            else
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }
        });
    },
    delete: function()
    {
        if(typeof this.UserID1 === 'undefined' || this.UserID1 === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery =  'DELETE Friend WHERE UserID1 = ? OR UserID2 = ?';

        db.connect();

        var toReturn = db.query(sqlQuery, [this.UserID1, UserID1], function(err, result) {
            db.end();

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.affectedRows > 0)
            {
                context.UserID1 = null;
                context.UserID2 = null;

                if(typeof callback === 'function')
                {
                    callback(true);
                }
            }
            else
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }
        });
    }
};