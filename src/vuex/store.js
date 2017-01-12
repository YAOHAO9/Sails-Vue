import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

const state = {
  user: 123
}

const mutations = {
  SAVEUSER(state, val) {
    state.user = val;
  }
}

export default new Vuex.Store({
  state,
  mutations
})