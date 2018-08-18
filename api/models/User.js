/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt-nodejs');
module.exports = {

    attributes: {
        name: {
            type: 'string',
            defaultsTo: require("../services/RandomNameService")
        },
        loginTimes: {
            type: 'integer',
            defaultsTo: 0,
        },
        memoName: {
            type: 'string'
        },
        isAdmin: {
            type: 'boolean',
            defaultsTo: false
        },
        email: {
            type: 'email',
            // required: true,
            unique: true
        },
        password: {
            type: 'string',
            // minLength: 6,
            // required: true
        },
        avator: {
            type: 'string'
        },
        socketId: {
            type: 'string'
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    }
    /*,
    beforeCreate: function (user, cb) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }*/
};

