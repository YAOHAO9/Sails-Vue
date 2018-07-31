let superagent = require("superagent");
let request = superagent
  .get("https://segmentfault.com/u/yaohao/notes")
  // .set('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
  // .set('accept-encoding','gzip, deflate, br')
  .set('user-agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36')
  // .set('referer','https://segmentfault.com/u/yaohao/notes')
  .set("cookie", `sf_remember=1a54cd757ea26cb81e04e0c89449ca3a`)
  .end((e, res) => {
    if (e) {
      return console.error(e);
    }
    console.log(res.text);
  })