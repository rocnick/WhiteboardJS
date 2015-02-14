var url         = require('url');
var fs          = require('fs');
var archiver    = require('express-zip');

module.exports = {
    get: function(req, res, db, urlQuery)
    {
        // Handle of this object for anon functions
        var objHandle = this;
        // Strip out query params
        var songId = urlQuery.song;
        var externalId = urlQuery.id;

        var sqlQuery = 'SELECT Filename FROM krVideo WHERE krVideo.SongID = ? AND krVideo.UserID != ?';
        
        db.connect();
        
        db.query(sqlQuery, [songId, externalId], function(err, rows) {
            var toReturn = { found: false };

            if(!err && rows.length >= 1)
            {
                var movieNum = (rows.length >= 3)?3:rows.length;
                var movies = objHandle.pickMovies(movieNum, rows);

                res.zip(movies);
            }
            else
            {
                res.send(JSON.stringify(toReturn));
            }
        });
    },
    add: function(req, res, db, query)
    {
        // Sorta random filename
        var timestamp = Math.floor(new Date() / 1000);
        var filename = (Math.floor((Math.random() * 2048) + 1)*timestamp) + '-' + timestamp;

        var sqlQuery = 'INSERT INTO krVideo () VALUES()';

        req.setBodyEncoding('binary');

          var stream = new multipart.Stream(req);
          stream.addListener('part', function(part) {
            part.addListener('body', function(chunk) {
              var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
              var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

              console.log("Uploading "+mb+"mb ("+progress+"%)\015");

              // chunk could be appended to a file if the uploaded file needs to be saved
            });
          });
          stream.addListener('complete', function() {
            res.sendHeader(200, {'Content-Type': 'text/plain'});
            res.sendBody('Thanks for playing!');
            res.finish();
            sys.puts("\n=> Done");
          });

        res.send('Add Page');
    },
    pickMovies: function(toPick, rows)
    {
        var toReturn = [];
        var validation = [];

        for(var i = 0; i < toPick; i++)
        {
            var num = Math.floor((Math.random() * rows.length) + 1);

            while(validation.indexOf(num) != -1) {
                num = Math.floor((Math.random() * rows.length) + 1);
            }

            validation.push(num);
            toReturn.push({ path: './public/' + rows[num-1].Filename, name: rows[num-1].Filename });
        }

        return toReturn;
    },
    upload: function(req, res, db, urlQuery)
    {
        res.send(
           '<form action="/video/add" method="post" enctype="multipart/form-data">'+
           '<input type="text" name="id" />' +
            '<input type="file" name="upload-file">'+
            '<input type="submit" value="Upload">'+
            '</form>'
        );
    }
};
