import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {}
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