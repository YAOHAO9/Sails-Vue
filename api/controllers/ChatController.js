/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    Chat.create({
      session: req.body.session,
      user: req.session.user,
      content: req.body.content,
      type: 'text'
    })
      .then(chat => {
        return Chat.findOne(chat.id).populate('user')
      })
      .then(chat=>{
        return res.json(chat)
      })
  }
};

