function date (value) {
  var year = value.getFullYear()
  var month = (value.getMonth() + 1).toString().replace(/^(\d)$/, '0\$1')
  var day = value.getDate().toString().replace(/^(\d)$/, '0\$1')
  var h = value.getHours().toString().replace(/^(\d)$/, '0\$1')
  var m = value.getMinutes().toString().replace(/^(\d)$/, '0\$1')
  return year + '-' + month + '-' + day + ' ' + h + ':' + m
}

export default
  {
    install(Vue) {
      Vue.filter('date', date)
    }
  }
