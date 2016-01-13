//  Project:   Whiteboard JS
//  Author:    Nick Snyder

// JSHint handling
/*jshint loopfunc: true */

var mongo = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var monCredentials = require(__dirname + '/mongocredentials'),
    mongoCredentials = new monCredentials();
var polygon = require(__dirname + '/polygon');
var workingBoards = [];
var finishedBoards = [];

module.exports = Board;

function Board(data) {
    this.BoardID = (typeof data.BoardID !== 'undefined') ? data.BoardID : null;
    this.UserID = (typeof data.UserID !== 'undefined') ? data.UserID : null;
    this.Username = (typeof data.Username !== 'undefined') ? data.Username : null;
    this.Shared = (typeof data.Shared !== 'undefined') ? data.Shared : [];
    this.Sharing = (typeof data.Sharing !== 'undefined') ? data.Sharing : null;
    this.BoardCollection = null;
    this.response = {
        BoardID: this.BoardID,
        UserID: this.UserID,
        Shared: this.Shared,
        BoardContent: this.BoardContent,
        Deleted: false,
        Updated: false,
        Created: false
    };
}

Board.prototype = {
    fetchAllWithPolygons: function(callback) {
      if (typeof this.UserID === 'undefined' || this.UserID === null) {
          if (typeof callback === 'function') {
              callback([]);
          }
          return;
      }

      var context = this;
      var url = mongoCredentials.getUrl();

      var gatherBoards = function(db, cf) {
          // Gather the documents
          var boardCollection = db.collection('boards');
          boardCollection.find({
              "UserID": context.UserID
          }).toArray(function(err, result) {
              assert.equal(null, err);
              cf(result);
          });
      };

      mongo.connect(url, function(err, db) {
          assert.equal(null, err);

          gatherBoards(db, function(result) {
              db.close();

              workingBoards = result;
              finishedBoards = [];
              allBoards = {};

              if (workingBoards.length === 0) {
                callback(null);
              }

              // We need to request the polygons per object now
              for (var i = 0, l = workingBoards.length; i < l; i++) {
                var currentBoard = workingBoards[i];
                allBoards[currentBoard._id] = currentBoard;

                var selector = new polygon({
                  "BoardID": new ObjectId(currentBoard._id).toString()
                });
                selector.fetch(function(response) {
                  response.Shared = allBoards[response.BoardID].Shared;
                  response.Sharing = allBoards[response.BoardID].Sharing;
                  response.UserID = allBoards[response.BoardID].UserID;
                  response.Username = allBoards[response.BoardID].Username;
                  delete response.PolygonID;
                  finishedBoards.push(response);

                  if (finishedBoards.length == workingBoards.length) {
                    callback(finishedBoards);
                  }
                });
              }
          });
      });
    },
    fetchAllSharedWithPolygons: function(callback) {
      if (typeof this.UserID === 'undefined' || this.UserID === null) {
          if (typeof callback === 'function') {
              callback([]);
          }
          return;
      }

      var context = this;
      var url = mongoCredentials.getUrl();

      var gatherBoards = function(db, cf) {
          // Gather the documents
          var boardCollection = db.collection('boards');
          boardCollection.find({
              "Shared._id": context.UserID,
              "Sharing" : { $ne : "private" }
          }).toArray(function(err, result) {
              assert.equal(null, err);
              cf(result);
          });
      };

      mongo.connect(url, function(err, db) {
          assert.equal(null, err);

          gatherBoards(db, function(result) {
              db.close();

              workingBoards = result;
              finishedBoards = [];
              allBoards = {};

              if (workingBoards.length === 0) {
                callback(null);
              }

              // We need to request the polygons per object now
              for (var i = 0, l = workingBoards.length; i < l; i++) {
                var currentBoard = workingBoards[i];
                allBoards[currentBoard._id] = currentBoard;

                var selector = new polygon({
                  "BoardID": new ObjectId(currentBoard._id).toString()
                });
                selector.fetch(function(response) {
                  response.Shared = allBoards[response.BoardID].Shared;
                  response.Sharing = allBoards[response.BoardID].Sharing;
                  response.UserID = allBoards[response.BoardID].UserID;
                  response.Username = allBoards[response.BoardID].Username;
                  delete response.PolygonID;
                  finishedBoards.push(response);

                  if (finishedBoards.length == workingBoards.length) {
                    callback(finishedBoards);
                  }
                });
              }
          });
      });
    },
    fetchAll: function(callback) {
        if (typeof this.UserID === 'undefined' || this.UserID === null) {
            if (typeof callback === 'function') {
                callback([]);
            }
            return;
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var gatherBoards = function(db, cf) {
            // Gather the documents
            var boardCollection = db.collection('boards');
            boardCollection.find({
                "UserID": context.UserID
            }).toArray(function(err, result) {
                assert.equal(null, err);
                cf(result);
            });
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            gatherBoards(db, function(result) {
                db.close();

                callback(result);
            });
        });
    },
    fetch: function(callback) {
        if (typeof this.BoardID === 'undefined' || this.BoardID === null) {
            if (typeof callback === 'function') {
                callback([]);
            }
            return;
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var gatherBoards = function(db, cf) {
            // Gather the documents
            var boardCollection = db.collection('boards');
            boardCollection.find({
                "_id": new ObjectId(context.BoardID)
            }).toArray(function(err, result) {
                assert.equal(null, err);
                cf(result);
            });
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            gatherBoards(db, function(result) {
                db.close();

                callback(result);
            });
        });
    },
    insert: function(callback) {
        if ((typeof this.UserID === 'undefined' || this.UserID === null)) {
            if (typeof callback === 'function') {
                callback(this.response);
            }
            return;
        }

        if (typeof this.BoardContent === 'undefined' || this.BoardContent === null) {
            this.response.BoardContent = this.BoardContent = '';
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var insertBoard = function(db, cf) {
            // Define the collection to use
            var boardCollection = db.collection('boards');

            boardCollection.insert({
                "UserID": context.UserID,
                "Username": context.Username,
                "Sharing": "private",
                "Shared": []
            }, function(err, result) {
                cf(result);
            });
        };

        // Use connect method to connect to the Server
        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            insertBoard(db, function(result, cback) {
                db.close();
                context.response.Created = true;
                context.response.BoardID = this.BoardID = result.insertedIds[0];

                callback(context.response);
            });
        });
    },
    delete: function(callback) {
        if ((typeof this.BoardID === 'undefined' || this.BoardID === null) ||
           (typeof this.UserID === 'undefined' || this.UserID === null)) {
            if(typeof callback === 'function') {
                callback(this.response);
            }
            return;
        }

        var context = this;
        var url = mongoCredentials.getUrl();

        var deleteBoard = function(db, cf) {
            // Define the board collection
            var boardCollection = db.collection('boards');

            // The actual remove query
            boardCollection.remove({
                "_id": new ObjectId(context.BoardID),
                "UserID": context.UserID
            }, function(err, result) {
                cf(result);
            });
        };

        // Use connect method to connect to the Server
        mongo.connect(url, function(err, db) {
            assert.equal(null, err);

            deleteBoard(db, function(result, cback) {
                db.close();
                context.response.Deleted = true;

                callback(context.response);
            });
        });
    },
    update: function(callback) {
      if ((typeof this.BoardID === 'undefined' || this.BoardID === null) ||
          (typeof this.UserID === 'undefined' || this.UserID === null)) {

        if (typeof callback === 'function') {
          callback(false);
        }
        return;
      }

      var context = this;
      var url = mongoCredentials.getUrl();

      var updateBoard = function(db, cf) {
        // Define the board collection
        var boardCollection = db.collection('boards');

        // The actual remove query
        boardCollection.update({
            "_id": new ObjectId(context.BoardID),
            "UserID": context.UserID
        }, {
          "_id": new ObjectId(context.BoardID),
          "Username": context.Username,
          "UserID": context.UserID,
          "Sharing": context.Sharing,
          "Shared": context.Shared
        }, {
          upsert: true
        }, function(err, result) {
            cf(result);
        });
      };

      // Use connect method to connect to the Server
      mongo.connect(url, function(err, db) {
          assert.equal(null, err);

          updateBoard(db, function(result, cback) {
              db.close();
              context.response.Updated = true;

              callback(context.response);
          });
      });
    }
};
