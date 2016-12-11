/**
 * Service
 */
var mongodbServer = sails.config.connections.someMongodbServer
var mongodbUri = require('mongodb-uri').format(mongodbServer)
var skipperGridfs = require('skipper-gridfs')

module.exports = function (req, uploadFileName) {
  return new Promise((resolve, reject) => {
    req.file(uploadFileName).upload({
      adapter: skipperGridfs,
      url: mongodbUri,
      dbname: mongodbServer.database,
      host: mongodbServer.hosts[0].host,
      port: mongodbServer.hosts[0].port,
      bucket: mongodbServer.bucket,
      username: mongodbServer.username,
      password: mongodbServer.password,
    }, function (err, filesUploaded) {
      if (err)
        reject(err)
      resolve(filesUploaded)
    });
  })
}

