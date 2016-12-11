/**
 * Moment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    images: {
      type: 'array'
    },
    content: {
      type: 'longtext'
    },
    comment: {
      type: 'array'
    },
    approve: {
      type: 'array'
    },
    disapprove: {
      type: 'array',
      agreement: {
        version: "string",
      }
    }
  }
};

