/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  find: function (req, res) {
    // conds.skip = req.query.skip ? req.query.skip : '0'
    // conds.limit = req.query.limit ? req.query.limit : '3'
    // conds.sort = req.query.sort ? req.query.sort : 'createdAt DESC'
    Chat.find()
      .groupBy('session')
      .max('createdAt')
      .limit(3)
      .sort('createdAt DESC')
      .then(chatKind => {
        res.ok(chatKind)
      })
  },
};

