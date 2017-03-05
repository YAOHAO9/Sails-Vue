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
      .sort('updatedAt DESC')
      // .limit(10)
      .then(chatKind => {
        res.ok(chatKind)
      })
  },
  read: function (req, res) {
    Chat.update(req.body.chatId, { read: true })
      .then((chat) => {
        res.ok(chat)
      })
  },
  getUnreadNum: function (req, res) {
    if (req.body.sender) {
      let sender = req.body.sender
      Chat.find({ read: false, receiver: req.session.user.id, sender: sender })
        .then(chats => {
          res.ok({ unreadNum: chats.length })
        })
        .catch((e) => {
          res.notFound()
        })
    } else {
      res.ok()
    }

  }
};

