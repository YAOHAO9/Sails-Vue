/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
module.exports = {
  moment: function (req, res) {
    Moment.findOne(req.param('id'))
      .then((moment) => {
        return Comment.create({
          user: req.session.user,
          content: '<p>' + req.body.content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
          moment: moment
        })
      })
      .then(comment => {
        res.ok(comment)
      })
      .catch(e => {
        res.serverError(e.message)
      })
  },
  article: function (req, res) {
    Article.findOne(req.param('id'))
      .then((article) => {
        return Comment.create({
          user: req.session.user,
          content: '<p>' + req.body.content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
          article: article
        })
      })
      .then(comment => {
        res.ok(comment)
      })
      .catch(e => {
        res.serverError(e.message)
      })
  }
};

