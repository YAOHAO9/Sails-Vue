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
  ]
}

const mutations = {
  SAVEUSER(state, val) {
    state.user = val;
  },
  SAVECURRENTVIEW(state, val) {
    state.indexView = val;
  },
  SAVESESSIONS(state, val) {
    state.indexView = val
  }
}

export default new Vuex.Store({
  state,
  mutations
})


