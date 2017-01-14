/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
var UploadService = require("../services/UploadService")
module.exports = {
  get: function (req, res, next) {
    res.ok(req.session.user)
  },
  update: function (req, res, next) {
    if (!req.body.name)
      return res.badRequest('Name is required')
    if (!req.param('id'))
      return res.badRequest('Id is required')
    UploadService(req, 'avatar')
      .then(avatars => {
        if (avatars && avatars.length > 0)
          return User.update({ id: req.param('id') }, { name: req.body.name, avatar: avatars[0] })
        return User.update({ id: req.param('id') }, { name: req.body.name })
      })
      .then(users => {
        res.ok(users[0])
      })
      .catch(e => {
        res.serverError(e)
      })

  }
};

