import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

const state = {
  user: null,
  indexView: 'moment',
  sessions: [
    {
      session: "0-0",
      name: 'WeChat',
      list: []
    }
  ],
  global: {
    toast: {
      show: false,
      text: '',
      type: ''
    },
    preLoader: {
      show: false
    }
  },
  localStoage: false
}

const mutations = {
  SAVEUSER(state, val) {
    state.user = val;
  },
  SAVECURRENTVIEW(state, val) {
    state.indexView = val;
  },
  SAVESESSIONS(state, val) {
    state.sessions = val
  },
  SHOWTOAST(state, val) {
    for (var prop in val) {
      state.global.toast[prop] = val[prop]
    }
  },
  SHOWPRELOADER(state, val) {
    state.global.preLoader.show = val
  },
  SAVELOCALSTORAGE(state, val) {
    state.localStoage = val
    for(var prop in val){
      localStorage[prop]=JSON.stringify(val[prop])
    }
    localStorage.clear()
  }
}

export default new Vuex.Store({
  state,
  mutations
})


