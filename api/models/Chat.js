/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    session: {
      type: 'string'
    },
    sender: {
      model: 'User'
    },
    receiver: {
      model: 'User'
    },
    type: {
      type: 'string',
      enum: ['text', 'image'],
      defaultsTo: 'text'
    },
    content: {
      type: 'longtext'
    },
    img: {
      type: 'string'
    },
    read: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};

