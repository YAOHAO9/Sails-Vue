/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
let fs = require('fs')
let path = require('path')
let uuid = require('node-uuid');

module.exports = {
  create: function (req, res) {
    if (!req.body.title) {
      return res.forbidden('标题不能为空')
    }
    if (!req.body.article)
      return res.forbidden('内容不能为空')

    let fileName = uuid.v1() + '.html'
    let filePath = path.resolve('.tmp', 'uploads', fileName)
    fs.writeFile(filePath, req.body.article, function (err) {
      if (err)
        res.serverError(err)
      File.create({
        fd: filePath,
        filename: fileName,
        size: 123,
        type: 'html',
      })
        .then(file => {
          return Article.create({
            title: req.body.title,
            file: file.id
          })
        })
        .then(article => {
          res.json(article)
        })
        .catch(e => {
          res.serverError(e)
        })
    })
  },
  update: function () {

  }
}