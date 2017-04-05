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
          content: req.body.content,
          moment: moment
        })
      })
      .then(comment => {
        res.ok(comment)
      })
  },
  article: function (req, res) {
    Article.findOne(req.param('id'))
      .then((article) => {
        return Comment.create({
          user: req.session.user,
          content: req.body.content,
          article: article
        })
      })
      .then(comment => {
        res.ok(comment)
      })
  }
};

