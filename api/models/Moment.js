/**
 * Moment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'User'
    },
    images: {
      type: 'array'
    },
    content: {
      type: 'longtext'
    },
    comments: {
      collection: 'Comment',
      via: 'moment'
    },
    city: {
      type: 'string'
    },
    ip: {
      type: 'string'
    },
    approves: {
      type: 'array'
    },
    disapproves: {
      type: 'array'
    }
  }
};

