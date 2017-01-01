/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
var mongo = require('mongodb')
var MongoClient = mongo.MongoClient;
var Grid = require('gridfs-stream')
var mongodbServer = sails.config.connections.someMongodbServer
var SkipperDisk = require('skipper-disk')
module.exports = {
  find: function (req, res) {
    /* MongoClient.connect(require('mongodb-uri').format(mongodbServer), { native_parser: true }, function (err, db) {
       if (err)
         return res.serverError(err)
       var gridfs = Grid(db, mongo);
       var options = { _id: req.param('id') }
       gridfs.findOne(options, function (err, file) {
         if (err)
           return res.serverError(err)
         if (!file)
           return res.notFound(options)
         var readstream = gridfs.createReadStream(options);
         readstream.pipe(res);
       });
     })*/

    var fileAdapter = SkipperDisk(/* optional opts */);
    // Stream the file down
    File.findOne(req.param('id'))
      .then(file => {
        fileAdapter.read(file.fd)
          .on('error', function (err) {
            return res.serverError(err)
          })
          .pipe(res)
      })

  }
};

