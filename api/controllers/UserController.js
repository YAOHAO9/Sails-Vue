/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
module.exports = {
  create: function (req, res) {
    User.create({})
      .then(user => {
        res.ok(user)
      })
  },
  findOrCreate: function (req, res) {
    User.findOrCreate({ id: req.cookies['UserId'] })
      .then(user => {
        res.cookie('UserId', user.id)
        res.ok(user)
      })
  }
};

