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

module.exports = {
  find: function (req, res) {
    MongoClient.connect(require('mongodb-uri').format(mongodbServer), { native_parser: true }, function (err, db) {
      if (err) return cb(err);
      var gridfs = Grid(db, mongo);
      var options = { _id: req.param('id') }
      gridfs.findOne(options, function (err, file) {
        if (err) return next(err);
        var readstream = gridfs.createReadStream(options);
        readstream.pipe(res);
      });
    }
    )
  }
};

