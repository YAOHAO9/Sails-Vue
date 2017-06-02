/**
 * AccessRecord.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'User'
    },
    ip: 'string',
    url: 'string',
    method: 'string',
    params: 'string',
    body: 'string',
    location:'string',
    date:'date'
  }
};

