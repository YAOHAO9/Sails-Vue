import moment from 'moment';
moment.locale('zh-cn');
function date(date) {
  return moment(date).fromNow();
}

export default
  {
    install(Vue) {
      Vue.filter('date', date)
    }
  }
