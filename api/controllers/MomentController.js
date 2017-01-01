/**
 * MomentController
 *
 * @description :: Server-side logic for managing moments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
var UploadService = require("../services/UploadService")

module.exports = {
  create: function (req, res) {
    UploadService(req, "images")
      .then(uploadedFiles => {
        User.findOrCreate({ id: req.cookies['UserId'] })
          .then(user => {
            return Moment.create({
              user: user,
              content: req.body.content,
              images: uploadedFiles
            })
          })
          .then(moment => {
            res.ok(moment)
          })
      })
  }
};

