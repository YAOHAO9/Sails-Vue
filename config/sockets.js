/**
 * WebSocket Server Settings
 * (sails.config.sockets)
 *
 * These settings provide transparent access to the options for Sails'
 * encapsulated WebSocket server, as well as some additional Sails-specific
 * configuration layered on top.
 *
 * For more information on sockets configuration, including advanced config options, see:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.sockets.html
 */
let nodemailer = require('nodemailer')
let emailConfig = require('./Email')
let transporter = nodemailer.createTransport(emailConfig.SMTP_SETTINGS);

module.exports.sockets = {


  /***************************************************************************
  *                                                                          *
  * Node.js (and consequently Sails.js) apps scale horizontally. It's a      *
  * powerful, efficient approach, but it involves a tiny bit of planning. At *
  * scale, you'll want to be able to copy your app onto multiple Sails.js    *
  * servers and throw them behind a load balancer.                           *
  *                                                                          *
  * One of the big challenges of scaling an application is that these sorts  *
  * of clustered deployments cannot share memory, since they are on          *
  * physically different machines. On top of that, there is no guarantee     *
  * that a user will "stick" with the same server between requests (whether  *
  * HTTP or sockets), since the load balancer will route each request to the *
  * Sails server with the most available resources. However that means that  *
  * all room/pubsub/socket processing and shared memory has to be offloaded  *
  * to a shared, remote messaging queue (usually Redis)                      *
  *                                                                          *
  * Luckily, Socket.io (and consequently Sails.js) apps support Redis for    *
  * sockets by default. To enable a remote redis pubsub server, uncomment    *
  * the config below.                                                        *
  *                                                                          *
  * Worth mentioning is that, if `adapter` config is `redis`, but host/port  *
  * is left unset, Sails will try to connect to redis running on localhost   *
  * via port 6379                                                            *
  *                                                                          *
  ***************************************************************************/
  // adapter: 'memory',

  //
  // -OR-
  //

  adapter: 'socket.io-redis',
  host: '127.0.0.1',
  port: 6379,
  // db: 0,
  // pass: '<redis auth password>',



  /***************************************************************************
   *                                                                          *
   * Whether to expose a 'get /__getcookie' route with CORS support that sets *
   * a cookie (this is used by the sails.io.js socket client to get access to *
   * a 3rd party cookie and to enable sessions).                              *
   *                                                                          *
   * Warning: Currently in this scenario, CORS settings apply to interpreted  *
   * requests sent via a socket.io connection that used this cookie to        *
   * connect, even for non-browser clients! (e.g. iOS apps, toasters, node.js *
   * unit tests)                                                              *
   *                                                                          *
   ***************************************************************************/

  // grant3rdPartyCookie: true,



  /***************************************************************************
  *                                                                          *
  * `beforeConnect`                                                          *
  *                                                                          *
  * This custom beforeConnect function will be run each time BEFORE a new    *
  * socket is allowed to connect, when the initial socket.io handshake is    *
  * performed with the server.                                               *
  *                                                                          *
  * By default, when a socket tries to connect, Sails allows it, every time. *
  * (much in the same way any HTTP request is allowed to reach your routes.  *
  * If no valid cookie was sent, a temporary session will be created for the *
  * connecting socket.                                                       *
  *                                                                          *
  * If the cookie sent as part of the connection request doesn't match any   *
  * known user session, a new user session is created for it.                *
  *                                                                          *
  * In most cases, the user would already have a cookie since they loaded    *
  * the socket.io client and the initial HTML page you're building.         *
  *                                                                          *
  * However, in the case of cross-domain requests, it is possible to receive *
  * a connection upgrade request WITHOUT A COOKIE (for certain transports)   *
  * In this case, there is no way to keep track of the requesting user       *
  * between requests, since there is no identifying information to link      *
  * him/her with a session. The sails.io.js client solves this by connecting *
  * to a CORS/jsonp endpoint first to get a 3rd party cookie(fortunately this*
  * works, even in Safari), then opening the connection.                     *
  *                                                                          *
  * You can also pass along a ?cookie query parameter to the upgrade url,    *
  * which Sails will use in the absence of a proper cookie e.g. (when        *
  * connecting from the client):                                             *
  * io.sails.connect('http://localhost:1337?cookie=smokeybear')              *
  *                                                                          *
  * Finally note that the user's cookie is NOT (and will never be) accessible*
  * from client-side javascript. Using HTTP-only cookies is crucial for your *
  * app's security.                                                          *
  *                                                                          *
  ***************************************************************************/
  // beforeConnect: function(handshake, cb) {
  //   // `true` allows the connection
  //   return cb(null, true);
  //
  //   // (`false` would reject the connection)
  // },


  /***************************************************************************
  *                                                                          *
  * `afterDisconnect`                                                        *
  *                                                                          *
  * This custom afterDisconnect function will be run each time a socket      *
  * disconnects                                                              *
  *                                                                          *
  ***************************************************************************/
  // afterDisconnect: function(session, socket, cb) {
  //   // By default: do nothing.
  //   return cb();
  // },

  /***************************************************************************
  *                                                                          *
  * `transports`                                                             *
  *                                                                          *
  * A array of allowed transport methods which the clients will try to use.  *
  * On server environments that don't support sticky sessions, the "polling" *
  * transport should be disabled.                                            *
  *                                                                          *
  ***************************************************************************/
  // transports: ["polling", "websocket"]
  onConnect: function (requestSession, socket) {

    sails.sockets.join(socket, '0-0')
    let Chat = sails.models.chat
    let User = sails.models.user
    /*listen*/
    socket.on('who', (id) => {
      if (process.env.NODE_ENV !== 'development') {
        Promise.all([User.update({ id: id }, { socketId: socket.id }), User.findOne({ isAdmin: true, email: { '!': null } })])
          .spread((results, admin) => {
            let user = results[0]
            user.loginTimes++
            user.save();
            if (!results || results.length == 0 || !admin)
              return
            if (user.isAdmin || !admin.email)
              return
            // setup e-mail data with unicode symbols
            let mailOptions = {
              from: emailConfig.SMTP_SETTINGS.sendmailFrom, // sender address
              to: admin.email, // list of receivers
              subject: "YaoHao's Mibile Blog",
            };
            mailOptions.html = `${user.name}，上线了！</br>
            ${JSON.stringify(user, null, 2)}`

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: ' + info.response);
            });
          })
      }
      /*Init sessions*/
      Chat.find({ or: [{ sender: id, session: { '!': '0-0' } }, { receiver: id, session: { '!': '0-0' } }] })
        .groupBy('session')
        .max('createdAt')
        .limit(3)
        .sort('createdAt DESC')
        .then(sessions => {
          let tasks = sessions.map(session => {
            let users = session.session.split('-')
            let receiver = users.find(user => {
              return user != id
            })
            return User.findOne(receiver)
              .then(receiver => {
                session.name = receiver.name
                session.receiver = receiver.id
                session.list = []
                return session
              })
          })
          return Promise.all(tasks)
        })
        .then(sessions => {
          socket.emit('initSessions', sessions)
        })
    })
    socket.on('find', (cond) => {
      cond = cond || {}
      let findCond = { session: cond.session }
      let query = Chat.find(findCond)
      cond.skip && query.skip(cond.skip)
      cond.limit && query.limit(cond.limit)
      cond.sort && query.sort(cond.sort)
      query.populate('sender').populate('receiver')
      query.then(chats => {
        socket.emit('initSession', chats)
      })
    })
    socket.on('submit', chat => {
      sails.sockets.join(socket, chat.session)
      Chat.create(chat)
        .then(chat => {
          return Chat.findOne(chat.id).populate('sender').populate('receiver')
        })
        .then(chat => {
          if (chat.session == '0-0') {
            sails.sockets.broadcast(chat.session, 'update', chat.toJSON());
          } else {
            User.findOne(chat.receiver.id)
              .then(user => {
                if (user.socketId) {
                  sails.sockets.join(user.socketId, chat.session)
                }
                sails.sockets.broadcast(chat.session, 'update', chat.toJSON());
              })
          }
        })

    })
  },
  afterDisconnect: function (session, socket) {
    Promise.all([User.update({ socketId: socket.id }, { socketId: null }), User.findOne({ isAdmin: true, email: { '!': null } })])
      .spread((results, admin) => {
        if (!results || results.length == 0 || !admin)
          return
        let user = results[0]
        if (user.isAdmin || !admin.email)
          return
        // setup e-mail data with unicode symbols
        let mailOptions = {
          from: emailConfig.SMTP_SETTINGS.sendmailFrom, // sender address
          to: admin.email, // list of receivers
          subject: "YaoHao's Mibile Blog",
        };
        mailOptions.html = `${user.name}，下线了！</br>
            ${JSON.stringify(user)}`
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });
      })
  }
};
