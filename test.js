let cheerio = require('cheerio')
let request = require('request')
let fs = require('fs')
let path = require('path')
let md5 = require('md5')
let content = `
      <section class="96wx-bgpic 96wx-bdc 96wx-chbg" style="width: 160px; border-radius: 50%; margin-top: -120px; text-align: center; box-sizing: border-box; margin-bottom: 0px; color: inherit; display: inline-block; overflow: hidden; border: 5px solid rgb(254, 254, 254); height: 160px !important; background-image: url(http://newcdn.96weixin.com/pic/mb2017022401.jpg); background-size: 105%; background-position: 0% 0%; background-repeat: no-repeat;" wcdn.96weixin.com/pic/mb2017022401.jpg); background-size: 105%; background-position: 0% 0%; background-repeat: no-repeat;" data-="" wxsrc="https://mmbiz.qlogo.cn/mmbiz_jpg/p6Vlqvia1UicwZCW3E18s45ibBId9UAt5icSb52XQOkg58NlHobr6rlQDWiau4pib39QnpC8dbkw7pWykk0qaVdMtRNA/0?wx_fmt=jpeg"></section>
    `
let urls = content.match(/url\([^\)]*\)/g)
  .map(url => {
    return url.replace('url(', '').replace(')', '')
  })
urls.map((url) => {
  if (url.indexOf('http') < 0)
    return
  let fileFd = path.join('.tmp', 'uploads', md5(url))
  request(url).pipe(fs.createWriteStream(fileFd))
  return File.create({
    fd: fileFd,
    type: 'image/jpeg',
    filename: url,
    size: 0
  }).then(file => {
    content = content.replace(url, 'api/file/find/' + file.id)
  })
})
console.log(content)
