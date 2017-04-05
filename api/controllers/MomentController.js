/**
 * MomentController
 *
 * @description :: Server-side logic for managing moments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
var UploadService = require("../services/UploadService")

var http = require('http');
var util = require('util');
var fs = require('fs')

/**
 * 根据 ip 获取获取地址信息
 */
function getIpInfo(ip, cb) {
  var sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
  var url = sina_server + ip;
  http.get(url, function (res) {
    var code = res.statusCode;
    if (code == 200) {
      res.on('data', function (data) {
        try {
          cb(null, JSON.parse(data));
        } catch (err) {
          cb(err);
        }
      });
    } else {
      cb({ code: code });
    }
  }).on('error', function (e) { cb(e); });
};

function getClientIp(req) {
  let ip = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(':')
  return ip[ip.length - 1]
};

function getUserCityInfo(req) {
  let ip = getClientIp(req)
  return new Promise((resolve, reject) => {
    getIpInfo(ip, function (err, data) {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
}

module.exports = {
  create: function (req, res) {
    UploadService(req, "images")
      .then(uploadedFiles => {
        return Promise.all([uploadedFiles, getClientIp(req)])
      })
      .spread((uploadedFiles, ip) => {
        // var city = cityInfo instanceof Object ? (cityInfo.province + ' ' + cityInfo.city) : undefined
        return Moment.create({
          user: req.session.user,
          content: req.body.content,
          images: uploadedFiles,
          ip: ip,
          approves: [],
          disapproves: []
        })
      })
      .then(moment => {
        res.ok(moment)
      })
  },
  delete: function (req, res) {
    let id = req.param('id')
    if (!id)
      return res.badRequest('参数错误')
    Moment.findOne(id)
      .then(moment => {
        if (moment.user != req.session.user.id && !req.session.user.isAdmin)
          throw new Error('无权操作')
        let tasks = moment.images.map(img => {
          return File.findOne(img).then(file => {
            fs.unlink(file.fd)
            return file
          }).then(file => {
            return File.destroy({ id: file.id })
          })
        })
        return Promise.all(tasks)
      })
      .then(() => {
        return Moment.destroy({ id: id })
      })
      .then((moments) => {
        if (moments && moments.length == 1)
          res.json(moments[0])
        else
          res.serverError('删除失败')
      })
      .catch(e => {
        res.forbidden(e.message)
      })
  },
  edit: function (req, res) {
    let content = req.body.content
    let id = req.body.id
    if (!id)
      return res.badRequest('参数错误')
    if (!content)
      return res.badRequest('请输入修改过的内容')
    Moment.update({ id: id }, { content: content })
      .then(moment => {
        res.ok(moment)
      })
  },
  approve: function (req, res) {
    Moment.findOne(req.param('id'))
      .then((moment) => {
        let user = req.session.user
        if (!moment.approves)
          moment.approves = []
        if (!moment.disapproves)
          moment.disapproves = []
        let foundUser = moment.approves.find(approve => {
          return approve == user.id
        })
        if (foundUser) {
          moment.approves.splice(moment.approves.indexOf(user.id), 1)
        } else {
          moment.approves.push(user.id)
        }
        if (moment.disapproves.indexOf(user.id) >= 0)
          moment.disapproves.splice(moment.disapproves.indexOf(user.id), 1)
        return moment.save().then(() => Moment.findOne(req.param('id')))
      })
      .then(moment => {
        res.ok(moment)
      })
  },
  disapprove: function (req, res) {
    Moment.findOne(req.param('id'))
      .then((moment) => {
        let user = req.session.user
        if (!moment.approves)
          moment.approves = []
        if (!moment.disapproves)
          moment.disapproves = []
        let foundUser = moment.disapproves.find(approve => {
          return approve == user.id
        })
        if (foundUser) {
          moment.disapproves.splice(moment.disapproves.indexOf(user.id), 1)
        } else {
          moment.disapproves.push(user.id)
        }
        if (moment.approves.indexOf(user.id) >= 0)
          moment.approves.splice(moment.approves.indexOf(user.id), 1)
        return moment.save().then(() => Moment.findOne(req.param('id')))
      })
      .then(moment => {
        res.ok(moment)
      })
  }
};

