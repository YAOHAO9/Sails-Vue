/**
 * MomentController
 *
 * @description :: Server-side logic for managing moments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var UploadService = require("../services/UploadService")

module.exports = {
  create: function (req, res) {
    UploadService(req, "images")
      .then(filesUploaded => {
        Moment.create({
          content: req.body.content,
          images: filesUploaded.map(file => {
            return file.extra.fileId
          })
        })
          .then(moment => {
            res.ok(moment)
          })
      })
  }
};

