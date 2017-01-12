/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
let MixCrypto = new (require('../services/MixCrypto'))()

module.exports = {
  create: function (req, res) {
    User.create({})
      .then(user => {
        res.ok(user)
      })
  },
  findOrCreate: function (req, res) {
    let id = undefined
    if (req.cookies['UserId'])
      id = MixCrypto.decrypt(req.cookies['UserId'])

    User.findOrCreate({ id: id })
      .then(user => {
        res.cookie('UserId', MixCrypto.encrypt(user.id))
        req.session.user = user
        res.ok(user)
      })
  }
};

