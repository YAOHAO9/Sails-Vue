/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
module.exports = {
  create: function (req, res) {
    Promise.all([User.findOrCreate({ id: req.cookies['UserId'] }), Moment.findOne(req.param('id'))])
      .spread((user,moment) => {
        return Comment.create({
          user: user,
          content: req.body.content,
          owner: moment
        })
      })
      .then(comment => {
        res.ok(comment)
      })
  }
};

