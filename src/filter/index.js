function date(value) {
  if (!(value instanceof Date))
    value = new Date(value)
  var year = value.getFullYear()
  var month = (value.getMonth() + 1).toString().replace(/^(\d)$/, '0\$1')
  var day = value.getDate().toString().replace(/^(\d)$/, '0\$1')
  var h = value.getHours().toString().replace(/^(\d)$/, '0\$1')
  var m = value.getMinutes().toString().replace(/^(\d)$/, '0\$1')
  var now = new Date
  var time = h + ':' + m
  var date = month + '-' + day
  if (now.getFullYear == value.getFullYear)
    if (now.getMonth() == value.getMonth() && now.getDate() == value.getDate())
      return time
    else
      return date + ' ' + time
  else
    return year + '-' + date + ' ' + itme
}

export default
  {
    install(Vue) {
      Vue.filter('date', date)
    }
  }
