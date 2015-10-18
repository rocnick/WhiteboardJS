//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var mysql = require('mysql');
var Credentials = require(__dirname + '/dbcredentials'),
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
    this.UserID = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
    this.Username = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;
    this.Password = (typeof arguments[2] !== 'undefined') ? arguments[2] : null;
    this.FirstName = (typeof arguments[3] !== 'undefined') ? arguments[3] : null;
    this.LastName = (typeof arguments[4] !== 'undefined') ? arguments[4] : null;
    this.EmailAddress = (typeof arguments[5] !== 'undefined') ? arguments[5] : null;
}

User.prototype = {
    fetch: function(callback)
    {
        if(typeof this.UserID === 'undefined' || this.UserID === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery = 'SELECT UserID, Username, Password, FirstName, LastName, EmailAddress FROM User WHERE UserID = ?';
        
        var toReturn = db.query(sqlQuery, [this.UserID], function(err, result) {
            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.length > 0)
            {
                context.UserID = result[0].UserID;
                context.Username = result[0].Username;
                context.Password = result[0].Password;
                context.FirstName = result[0].FirstName;
                context.LastName = result[0].LastName;
                context.EmailAddress = result[0].EmailAddress;

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
    login: function(callback)
    {
        if((typeof this.EmailAddress === 'undefined' || this.EmailAddress === null) ||
           (typeof this.Password === 'undefined' || this.Password === null))
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery = 'SELECT UserID, Username, Password, FirstName, LastName, EmailAddress FROM User WHERE EmailAddress = ? AND Password = ?';

        var toReturn = db.query(sqlQuery, [this.EmailAddress, this.Password], function(err, result) {

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.length > 0)
            {
                context.UserID = result[0].UserID;
                context.Username = result[0].Username;
                context.Password = result[0].Password;
                context.FirstName = result[0].FirstName;
                context.LastName = result[0].LastName;
                context.EmailAddress = result[0].EmailAddress;

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
    insert: function(callback)
    {
        if((typeof this.Username === 'undefined' || this.Username === null) ||
           (typeof this.Password === 'undefined' || this.Password === null) ||
           (typeof this.FirstName === 'undefined' || this.FirstName === null) ||
           (typeof this.LastName === 'undefined' || this.LastName === null) ||
           (typeof this.EmailAddress === 'undefined' || this.EmailAddress === null))
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery = 'INSERT INTO User (Username, Password, FirstName, LastName, EmailAddress) VALUES(?, ?, ?, ?, ?)';
        
        var toReturn = db.query(sqlQuery, [this.Username, this.Password, this.FirstName, this.LastName, this.EmailAddress], function(err, result) {

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }
            console.log(result);
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
    update: function(callback)
    {
        if((typeof this.UserID === 'undefined' || this.UserID === null) ||
           (typeof this.Username === 'undefined' || this.Username === null) ||
           (typeof this.Password === 'undefined' || this.Password === null) ||
           (typeof this.FirstName === 'undefined' || this.FirstName === null) ||
           (typeof this.LastName === 'undefined' || this.LastName === null) ||
           (typeof this.EmailAddress === 'undefined' || this.EmailAddress === null))
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var sqlQuery = 'UPDATE User SET Username = ?, Password = ?, FirstName = ?, LastName = ?, EmailAddress = ? WHERE UserID = ?';

        var toReturn = db.query(sqlQuery, [this.Username, this.Password, this.FirstName, this.LastName, this.EmailAddress, this.UserID], function(err, result) {

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.changedRows > 0)
            {
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
    delete: function(callback)
    {
        if(typeof this.UserID === 'undefined' || this.UserID === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
        }

        var context = this;
        var sqlQuery =  'DELETE FROM User WHERE UserID = ?';

        var toReturn = db.query(sqlQuery, [this.UserID], function(err, result) {

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
            }

            if(result.affectedRows > 0)
            {
                context.UserID = null;
                context.Username = null;
                context.Password = null;
                context.FirstName = null;
                context.LastName = null;
                context.EmailAddress = null;

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