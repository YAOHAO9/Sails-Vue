/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var UploadService = require("../services/UploadService")

module.exports = {
  sendImage: function (req, res) {
    UploadService(req, "image")
      .then(uploadedFiles => {
        if (uploadedFiles && uploadedFiles.length > 0) {
          let data = Object.assign({}, req.body, { type: 'image', img: uploadedFiles[0] + '' })
          if (data.session == '0-0')
            delete data.receiver
          delete data.content
          return Chat.create(data)
        }
        throw new Error('Send image error')
      })
      .then(chat => {
        return Chat.findOne(chat.id).populate('receiver').populate('sender')
      })
      .then(chat => {
        res.ok(chat)
        if (chat.session == '0-0')
          return sails.sockets.broadcast('0-0', 'update', chat.toJSON());
        if (chat.receiver && chat.receiver.socketId) {
          sails.sockets.broadcast(chat.receiver.socketId, 'update', chat.toJSON());
        }
      })
      .catch(e => {
        res.serverError(e.message)
      })
  },
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
      .catch(e => {
        res.serverError(e.message)
      })
  },
  read: function (req, res) {
    Chat.update(req.body.chatId, { read: true })
      .then((chats) => {
        if (chats && chats.length == 1)
          return res.ok(chats[0])
        res.ok({})
      })
      .catch(e => {
        res.serverError(e.message)
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
  },
  allUnreadMsgNum: function (req, res) {
    Chat.find({ read: false, receiver: req.session.user.id })
      .then(chats => {
        res.ok({ unreadMsgNum: chats.length })
      })
      .catch((e) => {
        res.notFound()
      })
  }
};

