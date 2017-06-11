/**
 * AccessRecordController
 *
 * @description :: Server-side logic for managing accessrecords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let getClientIp = require('../services/UserLocationService').getClientIp
module.exports = {
  create: function (req, res) {
    let date = new Date(new Date().toDateString())
    if (req.session.user.isAdmin)
      return res.ok()
    AccessRecord.create(Object.assign(req.body, { user: req.session.user, ip: getClientIp(req), date: date }))
      .then(accessRecord => {
        res.ok(accessRecord)
      })
      .catch(e => {
        res.serverError(e.message)
      })
  }
};

