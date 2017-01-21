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
    if (!req.body.description) {
      return res.forbidden('无有效内容')
    }
    if (!req.body.content)
      return res.forbidden('内容不能为空')

    ArticleContent.create({ content: req.body.content })
      .then((content) => {
        return Article.create({
          user: 1,
          title: req.body.title,
          description: req.body.description,
          content: content
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
    req.query.skip ? (conds.skip = req.query.skip) : ''
    req.query.limit ? (conds.limit = req.query.limit) : ''
    req.query.sort ? (conds.sort = req.query.sort) : ''
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