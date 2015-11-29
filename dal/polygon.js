//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var mongo = require('mongodb').MongoClient, assert = require('assert');
var monCredentials = require(__dirname + '/mongocredentials'),
    mongoCredentials = new monCredentials();

module.exports = Polygon;

function Polygon(data)
{
    this.BoardID = (typeof data.BoardID !== 'undefined') ? data.BoardID : null;
    this.PolygonID = (typeof data.PolygonID !== 'undefined') ? data.PolygonID : null;
    this.UserID = (typeof data.UserID !== 'undefined') ? data.UserID : null;
    this.PolygonContent = (typeof data.Polygon !== 'undefined') ? data.Polygon : null;
    this.response = {
      BoardID: this.BoardID,
      PolygonID: this.PolygonID,
      UserID: this.UserID,
      Polygons: this.PolygonContent
    };
}

Polygon.prototype = {
  fetch: function() {
    var callback;
    if (typeof arguments[0] === 'function')
    {
      callback = arguments[0];
    }

    var context = this;
    var url = mongoCredentials.getUrl();

    var gatherPolygons = function(db, cf)
    {
      // Gather the documents
      var polygonCollection = db.collection('polygons');
      polygonCollection.find({
        "BoardID": context.BoardID
      }).toArray(function(err, result) {
        assert.equal(null, err);
        cf(result);
      });
    };

    mongo.connect(url, function(err, db) {
      assert.equal(null, err);

      gatherPolygons(db, function(result) {
        db.close();

        // Wrap the result in the result object
        context.response.Polygons = result;

        if (typeof callback === 'function') {
          callback(context.response);
        }
      });
    });
  },
  upsert: function() {
    var callback;
    if (typeof arguments[0] === 'function')
    {
      callback = arguments[0];
    }

    // Make sure the preconditions are met
    if (this.BoardID === null || this.PolygonID === null || this.UserID === null || this.PolygonContent === null) {
        if (typeof callback === 'function') {
            callback(false);
        } else {
            return false;
        }
    }

    var context = this;
    var mongoQuery = '';
    var url = mongoCredentials.getUrl();

    var upsertPolygon = function(db, cf)
    {
      // Insert the object into the collection
      var polygonCollection = db.collection('polygons');

      polygonCollection.update({
        "_id": context.PolygonID,
        "BoardID": context.BoardID,
        "UserID": context.UserID
      },
      {
        "_id": context.PolygonID,
        "BoardID": context.BoardID,
        "UserID": context.UserID,
        "Polygon": context.PolygonContent
      },
      {
        upsert: true
      },
      function(err, result) {
        cf(result);
      });
    };

    // Use connect method to connect to the Server
    mongo.connect(url, function(err, db) {
      assert.equal(null, err);

      upsertPolygon(db, function(result, callback) {
        db.close();
      });
    });
  }
};
