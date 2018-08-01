let fs = require('fs')
let path = require('path')
let cheerio = require('cheerio')
let request = require('request')
let md5 = require('md5')

let ParseImgSrc = (content, baseHttp) => {
  let $ = cheerio.load(content)
  let imgs = $('img')
  let tasks = []
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i]
    let src = img.attribs.src
    if (src.indexOf('http') < 0) {
      if (baseHttp && src.indexOf('/') !== -1){
        src = baseHttp + src;
      }else{
        continue;
      }
    }
    let task = new Promise((resolve, reject) => {
      let fileFd = path.join('.tmp', 'uploads', md5(src))
      let writeStream = fs.createWriteStream(fileFd)
      request(src).pipe(writeStream)
      writeStream.on('finish', function () {
        resolve(fileFd)
      })
      writeStream.on('error', function (err) {
        reject(err)
      })
    })
      .then(fileFd => {
        return File.create({
          fd: fileFd,
          type: 'image/jpeg',
          filename: src,
          size: 0
        })
      })
      .then(file => {
        $(img).attr('src', 'api/file/find/' + file.id);
        return file.id
      })
    tasks.push(task)
  }
  return Promise.all(tasks)
    .then((fileIds) => {
      return [$.html(),fileIds]
    })
}

module.exports = ParseImgSrc;