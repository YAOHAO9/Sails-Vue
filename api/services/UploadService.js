/**
 * Service
 */
/*
var mongodbServer = sails.config.connections.someMongodbServer
var mongodbUri = require('mongodb-uri').format(mongodbServer)
var skipperGridfs = require('skipper-gridfs')
*/

module.exports = function (req, uploadFileName) {
  /*
   gridfs 
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
   })*/
  /* skipper disk*/
  return new Promise((resolve, reject) => {
    req.file(uploadFileName).upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    }, function (err, filesUploaded) {
      if (err)
        reject(err)

      let tasks = filesUploaded.map(file => {
        return File.create(file)
      })
      Promise.all(tasks)
        .then(files => {
          return files.map(file => {
            return file.id
          })
        })
        .then(fileIds => {
          resolve(fileIds)
        })
    });
  })
}

