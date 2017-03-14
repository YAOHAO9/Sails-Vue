/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
var UploadService = require("../services/UploadService")
let fs = require('fs')
let path = require('path')
let uuid = require('node-uuid');

module.exports = {

  create: function (req, res) {
    if (!req.body.title) {
      return res.forbidden('标题不能为空')
    }
    if (!req.body.description) {
      return res.forbidden('无有效内容')
    }
    if (!req.body.content)
      return res.forbidden('内容不能为空')
    UploadService(req, "icon")
      .then(icon => {
        if (icon && icon.length > 0)
          icon = icon[0]
        else
          icon = undefined
        return ArticleContent.create({ content: req.body.content })
          .then((content) => {
            return Article.create({
              user: 1,
              title: req.body.title,
              description: req.body.description,
              content: content,
              icon: icon
            })
          })
      })
      .then(article => {
        res.json(article)
      })
  },
  update: function () {

  },
  find: function (req, res) {
    if (req.param('id')) {
      Article.findOne(req.param('id'))
        .populate('user')
        .populate('content')
        .then(article => {
          if (!article)
            return res.notFound('Article not found')
          article.content = article.content.content
          res.json(article)
        })
      return
    }
    let conds = {}
    conds.skip = req.query.skip ? req.query.skip : '0'
    conds.limit = req.query.limit ? req.query.limit : '3'
    conds.sort = req.query.sort ? req.query.sort : 'createdAt DESC'
    Article.find(conds)
      .populate('user')
      .then(articles => {
        res.ok(articles)
      })
  },
  findOne: function (req, res) {
    Article.findOne(req.param('id'))
      .populate('user')
      .populate('content')
      .then(article => {
        if (!article) {
          return res.notFound()
        }
        return res.view('article', {
          content: article.content.content
        })
      })

  }
}