/**
 * Service
 */
/*
var mongodbServer = sails.config.connections.someMongodbServer
var mongodbUri = require('mongodb-uri').format(mongodbServer)
var skipperGridfs = require('skipper-gridfs')
*/
'use strict'
module.exports = function (req, uploadFileName, fileType) {
  if (!fileType)
    fileType = "FileId"
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
      if (fileType == 'FileInfo') {
        Promise.all(tasks)
          .then(files => {
            resolve(files)
          })
      } else if (fileType == 'FileId') {
        Promise.all(tasks)
          .then(files => {
            return files.map(file => {
              return file.id
            })
          })
          .then(fileIds => {
            resolve(fileIds)
          })
      } else if (fileType == 'FileUrl') {
        Promise.all(tasks)
          .then(files => {
            return files.map(file => {
              return "/api/file/find/" + file.id
            })
          })
          .then(urls => {
            resolve(urls)
          })
      }
    });
  })
}
