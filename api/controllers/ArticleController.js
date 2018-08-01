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

let getHtmlByUrl = (url, cookie) => {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36')
      .set("cookie", cookie)
      .end((e, res) => {
        if (e) {
          return reject(e);
        }
        resolve(res.text);
      });
  });
};

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
      writeStream.on("finish", function () {
        resolve(fileFd);
      });
      writeStream.on("error", function (err) {
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

let saveMdToArticle = (html, origin, title, createdAt) => {
  return parseImgSrc(
    html,
    origin
  )
    .spread((html, fileIds) => {
      html = `<div class="markdown">${html}</div>`
      return ArticleContent.create({ content: html })
        .then(content => {
          return Article.create({
            user: 1,
            title: title,
            content: content,
            createdAt,
            icon: fileIds[0] ? fileIds[0] : null
          });
        })
    })
}

let formatDate = (date) => {
  if (date.indexOf('年') === -1) {
    date = `${(new Date()).getFullYear()}年${date}`
  }
  return new Date(date.replace('年', '-').replace('月', '-').replace('日', ''))
}
module.exports = {
  create: function (req, res) {
    if (!req.body.title) {
      return res.forbidden("标题不能为空");
    }
    if (!req.body.description) {
      return res.forbidden("无有效内容");
    }
    if (!req.body.content) return res.forbidden("内容不能为空");
    return parseImgSrc(req.body.content)
      .spread(content => {
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
  segmentFaultNote: function (req, res) {
    console.log(`sf_remember=${req.query.sf_remember}`)

    getHtmlByUrl("https://segmentfault.com/u/yaohao/notes", `sf_remember=${req.query.sf_remember}`)
      .then(html => {
        let $ = cheerio.load(html);
        let list = $('body > div.profile > div > div > div > div.col-md-10.profile-mine > ul > li');
        let notePromises = (Array(list.length).fill(0)).map((_, index) => {
          let item = cheerio.load(list[index]);
          let title = item('div > div.col-md-9.profile-mine__content--title-warp > a')[0].firstChild.data
          let createdAt = formatDate(item('div > div.col-md-2 > span')[0].firstChild.data)
          let note = item('div > div.col-md-9.profile-mine__content--title-warp > a')[0]
          let url = 'https://segmentfault.com' + note.attribs.href.split('?')[0] + '/edit'
          return getHtmlByUrl(url, `sf_remember=${req.query.sf_remember}`)
            .then(html => {
              let $ = cheerio.load(html);
              let data = markdown.render($("#codeMirror")[0].firstChild.data.replace(/$/mg, '  '))
              return saveMdToArticle(data, "https://segmentfault.com", title, createdAt)
            })
        })
        return Promise.all(notePromises)
      })
      .then(articles => {
        res.json(articles);
      })
      .catch(e => {
        console.error(e);
        res.serverError();
      });
  },
  segmentFaultArticle: function (req, res) {

    getHtmlByUrl("https://segmentfault.com/a/1190000009651765/edit", `sf_remember=${req.query.sf_remember}`)
      .then(html => {
        let $ = cheerio.load(html);
        let data = markdown.render($("#myEditor")[0].firstChild.data.replace(/$/mg, '  '))
        return saveMdToArticle(data, "https://segmentfault.com")
      })
      .then(article => {
        res.json(article);
      })
      .catch(e => {
        console.error(e);
        res.serverError();
      });
  },
  update: function () { },
  find: function (req, res) {
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
  findOne: function (req, res) {
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
