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
    if (!req.body.conetnt)
      return res.forbidden('内容不能为空')
    Article.create({
      title: req.body.title,
      content: req.body.conetnt
    })
      .then(article => {
        res.json(article)
      })
  },
  update: function () {

  },
  findOne: function (req, res) {
    Article.findOne(req.param('id'))
      .then(article => {
        if (!article) {
          return res.notFound()
        }
        return res.view('article', {
          content: article.content
        })
      })

  }
}