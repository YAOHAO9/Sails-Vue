'use strict'
let MixCrypto = new (require('../services/MixCrypto'))()

module.exports = function (req, res, next) {
  let id = undefined
  if (req.cookies['UserId'])
    id = MixCrypto.decrypt(req.cookies['UserId'])

  User.findOrCreate({ id: id })
    .then(user => {
      res.cookie('UserId', MixCrypto.encrypt(user.id), { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
      req.session.user = user
      next()
    })
};