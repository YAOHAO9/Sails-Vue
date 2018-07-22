/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";
let UploadService = require("../services/UploadService");
let fs = require("fs");
let path = require("path");
let cheerio = require("cheerio");
let request = require("request");
let md5 = require("md5");
let parseImgSrc = require("../services/ParseImgSrc");
let markdown = require("markdown-it")();
let superagent = require("superagent");
let Promise = require("bluebird");

let bgImgUrl = content => {
  let urls = content.match(/url\([^\)]*\)/g);
  if (!urls) urls = [];
  urls = urls.map(url => {
    return url
      .replace("url(", "")
      .replace(")", "")
      .replace(/&quot;/g, "");
  });
  let tasks = urls.map(url => {
    if (url.indexOf("http") < 0) return;
    return new Promise((resolve, reject) => {
      let fileFd = path.join(".tmp", "uploads", md5(url));
      let writeStream = fs.createWriteStream(fileFd);
      request(url).pipe(writeStream);
      writeStream.on("finish", function() {
        resolve(fileFd);
      });
      writeStream.on("error", function(err) {
        reject(err);
      });
    })
      .then(fileFd => {
        return File.create({
          fd: fileFd,
          type: "image/jpeg",
          filename: url,
          size: 0
        });
      })
      .then(file => {
        content = content.replace(url, "api/file/find/" + file.id);
      });
  });
  return Promise.all(tasks).then(() => {
    return content;
  });
};

module.exports = {
  create: function(req, res) {
    if (!req.body.title) {
      return res.forbidden("标题不能为空");
    }
    if (!req.body.description) {
      return res.forbidden("无有效内容");
    }
    if (!req.body.content) return res.forbidden("内容不能为空");
    return parseImgSrc(req.body.content)
      .then(content => {
        return bgImgUrl(content);
      })
      .then(content => {
        return Promise.all([
          ArticleContent.create({ content: content }),
          UploadService(req, "icon").then(icon => {
            if (icon && icon.length > 0) icon = icon[0];
            else icon = undefined;
            return icon;
          })
        ]);
      })
      .spread((content, icon) => {
        return Article.create({
          user: 1,
          title: req.body.title,
          description: req.body.description,
          content: content,
          icon: icon
        });
      })
      .then(article => {
        res.json(article);
      })
      .catch(e => {
        console.error(e);
        res.serverError();
      });
  },
  seekArticle: function(req, res) {
    const getHtmlByRequest = request => {
      return new Promise((resolve, reject) => {
        request.end((e, res) => {
          if (e) {
            reject(e);
          }
          resolve(res.text);
        });
      });
    };
    let request = superagent
      .get("https://segmentfault.com/a/1190000009651765/edit")
      .set("cookie", "sf_remember=88e867590f7f5f0890a4c0645e4db83e");

    getHtmlByRequest(request)
      .then(html => {
        let $ = cheerio.load(html);
        return parseImgSrc(
          markdown.render($("#myEditor")[0].firstChild.data),
          "https://segmentfault.com"
        );
      })
      .then(html => {
        let link =
          '<link rel="stylesheet" href="/css/markdown.css" type="text/css">\n';
        return ArticleContent.create({ content: link + html });
      })
      .then(content => {
        console.log(content);
        return Article.create({
          user: 1,
          title: "Article",
          description: "Article descript",
          content: content,
          icon: 3
        });
      })
      .then(article => {
        res.json(article);
      })
      .catch(e => {
        console.error(e);
        res.serverError();
      });
  },
  update: function() {},
  find: function(req, res) {
    if (req.param("id")) {
      return Article.findOne(req.param("id"))
        .populate("user")
        .populate("content")
        .populate("comments")
        .then(article => {
          if (!article) return res.notFound("Article not found");
          article.content = article.content.content;
          res.json(article);
        })
        .catch(e => {
          res.serverError(e.message);
        });
    }
    let conds = {};
    conds.skip = req.query.skip ? req.query.skip : "0";
    conds.limit = req.query.limit ? req.query.limit : "10";
    conds.sort = req.query.sort ? req.query.sort : "createdAt DESC";
    Article.find(conds)
      .populate("user")
      .populate("content")
      .populate("comments")
      .then(articles => {
        res.ok(articles);
      })
      .catch(e => {
        res.serverError(e.message);
      });
  },
  findOne: function(req, res) {
    Article.findOne(req.param("id"))
      .populate("user")
      .populate("content")
      .populate("comments")
      .then(article => {
        if (!article) {
          return res.notFound();
        }
        return res.view("article", {
          content: article.content.content
        });
      })
      .catch(e => {
        res.serverError(e.message);
      });
  }
};
