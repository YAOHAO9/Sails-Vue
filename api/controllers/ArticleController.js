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
let cheerio = require('cheerio')
let request = require('request')
let md5 = require('md5')

let imgSrc = (content) => {
  let $ = cheerio.load(content)
  let imgs = $('img')
  let tasks = []
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i]
    let src = img.attribs.src
    if (src.indexOf('http') < 0)
      continue
    let fileFd = path.join('.tmp', 'uploads', md5(src))
    request(src).pipe(fs.createWriteStream(fileFd))
    let task = File.create({
      fd: fileFd,
      type: 'image/jpeg',
      filename: src,
      size: 0
    }).then(file => {
      $(img).attr('src', 'api/file/find/' + file.id)
    })
    tasks.push(task)
  }
  return Promise.all(tasks)
    .then(() => {
      return $.html()
    })
}
let bgImgUrl = (content) => {
  let urls = content.match(/url\([^\)]*\)/g)
  if (!urls)
    urls = []
  urls = urls.map(url => {
    return url.replace('url(', '').replace(')', '').replace(/&quot;/g, '')
  })
  let tasks = urls.map((url) => {
    if (url.indexOf('http') < 0)
      return
    let fileFd = path.join('.tmp', 'uploads', md5(url))
    request(url).pipe(fs.createWriteStream(fileFd))
    return File.create({
      fd: fileFd,
      type: 'image/jpeg',
      filename: url,
      size: 0
    }).then(file => {
      content = content.replace(url, 'api/file/find/' + file.id)
    })
  })
  return Promise.all(tasks)
    .then(() => {
      return content
    })
}

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
        return imgSrc(req.body.content)
          .then(content => {
            return bgImgUrl(content)
          })
          .then(content => {
            return ArticleContent.create({ content: content })
          })
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