var mysql = require('mysql');
var mongo = require('mongodb').MongoClient
  , assert = require('assert');
var mysqlCredentials = require(__dirname + '/dbcredentials'),
    dbCredentials = new mysqlCredentials();
var monCredentials = require(__dirname + '/mongocredentials'),
    mongoCredentials = new monCredentials();
var db = mysql.createConnection({
    user: dbCredentials.user,
    password: dbCredentials.password,
    host: dbCredentials.host,
    database: dbCredentials.database
});

module.exports = Board;

function Board()
{
    this.BoardID = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
    this.UserID = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;
    this.BoardContent = (typeof arguments[2] !== 'undefined') ? arguments[2] : null;
    this.BoardCollection = null;
}

Board.prototype = {
    fetch: function(callback)
    {
        if(typeof this.BoardID === 'undefined' || this.BoardID === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
            return;
        }

        var context = this;
        var sqlQuery = 'SELECT BoardID, UserID FROM Board WHERE BoardID = ?';
        
        var toReturn = db.query(sqlQuery, [this.BoardID], function(err, result) {
            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
                return;
            }

            if(result.length > 0)
            {
                context.UserID = result[0].UserID;
                context.BoardID = result[0].BoardID;

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
        if(typeof this.UserID === 'undefined' || this.UserID === null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
            return;
        }

        var context = this;
        var sqlQuery = 'SELECT BoardID, UserID FROM Board WHERE UserID = ?';

        var toReturn = db.query(sqlQuery, [this.UserID], function(err, result) {
            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
                return;
            }

            if(result.length > 0)
            {
                context.BoardCollection = [];
                var url = mongoCredentials.getUrl();

                for(var i = 0, l = result.length; i < l; i++)
                {
                    // Collect the board from Mongo
                    var collectedBoard = '<svg></svg>';

                    var ObjectID = require('mongodb').ObjectID();

                    context.BoardCollection.push({
                        BoardID: result[i].BoardID,
                        UserID: result[i].UserID,
                        Board: collectedBoard
                    });
                }

                if(typeof callback === 'function')
                {
                    callback(context.BoardCollection);
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
        if((typeof this.UserID === 'undefined' || this.UserID === null)
            || (typeof this.BoardContent === 'undefined' || this.BoardContent === null))
        {
            if(typeof callback === 'function')
            {
                callback(false);
                return;
            }
        }

        var context = this;
        var sqlQuery = 'INSERT INTO Board (UserID) VALUES(?)';
        var mongoQuery = '';

        var url = mongoCredentials.getUrl();

        var insertBoard = function(db, cf)
        {
          // Insert the object into the collection
          var boardCollection = db.collection('boards');

          var data = {
            userId: this.UserID,
            board: this.BoardContent
          };

          boardCollection.insert(data, function(err, result) {
            cf(result);
          })
        }
        
        // Use connect method to connect to the Server 
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);

          insertBoard(db, function(result, callback) {
            console.log(result);

            db.close();
          });
        });
        
        var toReturn = db.query(sqlQuery, [this.UserID], function(err, result) {

            if(err)
            {
                if(typeof callback === 'function')
                {
                    //callback(false);
                }
                return;
            }

            if(typeof result.insertId !== 'undefined')
            {
                context.BoardID = result.insertId
                if(typeof callback === 'function')
                {
                    //callback(result.insertId);
                }
            }
            else
            {
                if(typeof callback === 'function')
                {
                    //callback(false);
                }
            }
        });
    },
    upsert: function(callback)
    {
        if(typeof this.UserID === 'undefined')
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
            return;
        }

        if(typeof this.BoardContent === 'undefined' || this.BoardContent === null)
        {
            this.BoardContent = '';
        }

        if(typeof this.BoardID === 'undefined' || this.BoardID == null)
        {
            this.insert(function() { console.log(result); });
        }
    },
    delete: function(callback)
    {
        if(typeof this.BoardID === 'undefined' || this.BoardID == null)
        {
            if(typeof callback === 'function')
            {
                callback(false);
            }
            return;
        }

        var context = this;
        var sqlQuery =  'DELETE FROM Board WHERE BoardID = ?';

        var toReturn = db.query(sqlQuery, [this.BoardID], function(err, result) {

            if(err)
            {
                if(typeof callback === 'function')
                {
                    callback(false);
                }
                return;
            }

            if(result.affectedRows > 0)
            {
                context.BoardID = null;
                context.UserID = null;

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