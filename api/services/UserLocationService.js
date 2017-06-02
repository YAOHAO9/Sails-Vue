
function getClientIp(req) {
  // console.log("req.headers['x-forwarded-for']:" + req.headers && req.headers['x-forwarded-for'])
  // console.log("req.connection.remoteAddress:" + req.connection && req.connection.remoteAddress)
  // console.log("req.socket.remoteAddress:" + req.socket && req.socket.remoteAddress)
  // console.log("req.connection.socket.remoteAddress:" + req.connection && req.connection.socket && req.connection.socket.remoteAddress)
  let ip = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(':')
  return ip[ip.length - 1]
};
module.exports = {
  getClientIp
}