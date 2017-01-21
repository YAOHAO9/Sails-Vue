/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'User'
    },
    icon: {
      type: 'integer'
    },
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    content: {
      model: 'ArticleContent'
    },
    comments: {
      collection: 'Comment',
      via: 'article'
    },
    approves: {
      type: 'array'
    },
    disapproves: {
      type: 'array'
    }
  }
};

