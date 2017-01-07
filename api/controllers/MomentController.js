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

/**
 * 根据 ip 获取获取地址信息
 */
var getIpInfo = function (ip, cb) {
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
        return Promise.all([User.findOrCreate({ id: req.cookies['UserId'] }), uploadedFiles])
      })
      .spread((user, uploadedFiles) => {
        return Promise.all([user, uploadedFiles, getUserCityInfo(req)])
      })
      .spread((user, uploadedFiles, cityInfo) => {
        var city = cityInfo instanceof Object ? (cityInfo.province + ' ' + cityInfo.city) : undefined
        return Moment.create({
          user: user,
          content: req.body.content,
          images: uploadedFiles,
          city: city,
          approves: [],
          disapproves: []
        })
      })
      .then(moment => {
        res.ok(moment)
      })
  },
  approve: function (req, res) {
    User.findOrCreate({ id: req.cookies['UserId'] })
      .then(user => {
        return Promise.all([user, Moment.findOne(req.param('id'))])
      })
      .spread((user, moment) => {
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
    User.findOrCreate({ id: req.cookies['UserId'] })
      .then(user => {
        return Promise.all([user, Moment.findOne(req.param('id'))])
      })
      .spread((user, moment) => {
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

