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
var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var monCredentials = require(__dirname + '/mongocredentials'),
    mongoCredentials = new monCredentials();

module.exports = User;

function User() {
    this.UserID = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;
    this.Username = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;
    this.Password = (typeof arguments[2] !== 'undefined') ? arguments[2] : null;
    this.FirstName = (typeof arguments[3] !== 'undefined') ? arguments[3] : null;
    this.LastName = (typeof arguments[4] !== 'undefined') ? arguments[4] : null;
    this.EmailAddress = (typeof arguments[5] !== 'undefined') ? arguments[5] : null;
    this.response = {
        UserID: this.UserID,
        Username: this.Username,
        FirstName: this.FirstName,
        LastName: this.LastName,
        EmailAddress: this.EmailAddress,
        LoggedIn: false,
        Created: false,
        Deleted: false
    };
}

User.prototype = {
    setValues: function(values) {
        this.response.UserID = this.userID = values._id;
        this.response.Username = this.Username = values.Username;
        this.response.Password = this.Password = values.Password;
        this.response.FirstName = this.FirstName = values.FirstName;
        this.response.LastName = this.LastName = values.LastName;
        this.response.EmailAddress = this.EmailAddress = values.EmailAddress;
    },
    setSafeValues: function(values) {
        values.Password = null;
        this.setValues(values);
    },
    setPublicSafeValues: function(values) {
      values.EmailAddress = null;
      this.setSafeValues(values);
    },
    fetchAll: function(callback) {
      var context = this;
      var url = mongoCredentials.getUrl();

      var getUser = function(db, cf) {
          // Gather the documents
          var userCollection = db.collection('users');
          userCollection.find().toArray(function(err, result) {
              assert.equal(null, err);
              console.log(result);
              cf(result);
          });
      };

      mongo.connect(url, function(err, db) {
          assert.equal(null, err);

          getUser(db, function(result) {
              db.close();
              context.setPublicSafeValues(result[0]);

              callback(context.response);
          });
      });
    },
    fetch: function(callback) {
        if((typeof this.UserID === 'undefined' || this.UserID === null) && typeof callback === 'function') {
            callback(false);
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var getUser = function(db, cf) {
            // Gather the documents
            var userCollection = db.collection('users');
            userCollection.find({
                "UserID": context.UserID
            }).toArray(function(err, result) {
                assert.equal(null, err);
                cf(result);
            });
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            getUser(db, function(result) {
                db.close();
                context.setSafeValues(result[0]);

                callback(context.response);
            });
        });
    },
    login: function(callback) {
        if((typeof this.EmailAddress === 'undefined' || this.EmailAddress === null) ||
           (typeof this.Password === 'undefined' || this.Password === null)) {
            if(typeof callback === 'function') {
                callback(false);
            }
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var loginUser = function(db, cf) {
            // Gather the documents
            var userCollection = db.collection('users');
            userCollection.find({
                "EmailAddress": context.EmailAddress,
                "Password": context.Password
            }).toArray(function(err, result) {
                assert.equal(null, err);
                cf(result);
            });
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            loginUser(db, function(result) {
                db.close();
                if (result.length > 0) {
                    context.setSafeValues(result[0]);
                    context.response.LoggedIn = true;
                }

                callback(context.response);
            });
        });
    },
    insert: function(callback) {
        if((typeof this.Username === 'undefined' || this.Username === null) ||
           (typeof this.Password === 'undefined' || this.Password === null) ||
           (typeof this.FirstName === 'undefined' || this.FirstName === null) ||
           (typeof this.LastName === 'undefined' || this.LastName === null) ||
           (typeof this.EmailAddress === 'undefined' || this.EmailAddress === null)) {

            if(typeof callback === 'function') {
                callback(false);
            }
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var createUser = function(db, cf) {
            // Gather the documents
            var userCollection = db.collection('users');
            userCollection.insert({
                "Username": context.Username,
                "Password": context.Password,
                "FirstName": context.FirstName,
                "LastName": context.LastName,
                "EmailAddress": context.EmailAddress
            }, function(err, result) {
                cf(result);
            });
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            createUser(db, function(result) {
                db.close();
                if (result.ops.length > 0) {
                    context.setSafeValues(result.ops[0]);
                    context.response.Created = true;
                    context.response.LoggedIn = true;
                }

                callback(context.response);
            });
        });
    },
    update: function(callback) {
        if((typeof this.UserID === 'undefined' || this.UserID === null) ||
           (typeof this.Username === 'undefined' || this.Username === null) ||
           (typeof this.Password === 'undefined' || this.Password === null) ||
           (typeof this.FirstName === 'undefined' || this.FirstName === null) ||
           (typeof this.LastName === 'undefined' || this.LastName === null) ||
           (typeof this.EmailAddress === 'undefined' || this.EmailAddress === null)) {

            if(typeof callback === 'function') {
                callback(false);
            }
        }
    }
};
