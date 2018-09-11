// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../.tmp/public/index.html'),
    assetsRoot: path.resolve(__dirname, '../../.tmp/public'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8088,
    proxyTable: {
      '/api/archive': 'http://127.0.0.1:3000',
      '/api/moment': 'http://127.0.0.1:3000',
      '/api/article': 'http://127.0.0.1:3000',
      '/api': 'http://127.0.0.1:1337',
      '/socket.io': 'http://127.0.0.1:1337'
    }
  }
}
