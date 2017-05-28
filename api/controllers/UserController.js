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
    UploadService(req, 'avator')
      .then(avators => {
        if (avators && avators.length > 0)
          return User.update({ id: req.param('id') }, { name: req.body.name, avator: avators[0] })
        return User.update({ id: req.param('id') }, { name: req.body.name })
      })
      .then(users => {
        res.ok(users[0])
      })
      .catch(e => {
        res.serverError(e)
      })
  },
  getOtherUser: function (req, res, next) {
    let conds = {}
    conds.skip = req.query.skip ? req.query.skip : '0'
    conds.limit = req.query.limit ? req.query.limit : '20'
    conds.sort = req.query.sort ? req.query.sort : 'updatedAt DESC'
    if (req.body.exclude) {
      req.body.exclude.push(req.session.user.id)
      conds.id = { '!': req.body.exclude }
      let avatorConds = Object.assign({}, conds, { avator: { '!': null } })
      let avatorQuery = User.find(avatorConds)
      avatorQuery
        .then(avatorUsers => {
          if (avatorUsers.length == conds.limit)
            return res.ok(users)
          User.count({ avator: { '!': null }, id: { '!': req.body.exclude } })
            .then(count => {
              let commonConds = Object.assign({}, conds, {
                avator: null,
                skip: conds.skip - count,
                limit: conds.limit - avatorUsers.length
              })
              return User.find(commonConds)
            })
            .then(commonUsers => {
              let users = [...avatorUsers, ...commonUsers]
              res.ok(users)
            })
        })
    } else {
      res.ok([])
    }
  }
};

