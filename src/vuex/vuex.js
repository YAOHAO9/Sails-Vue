export default {
  getters: {
    user: function (state) {
      return state.user
    },
    indexView: function (state) {
      return state.indexView
    },
    sessions: function (state) {
      return state.sessions
    }
  },
  actions: {
    saveUser: function (store, val) {
      store.dispatch('SAVEUSER', val);
    },
    saveCurrentView: function (store, val) {
      store.dispatch('SAVECURRENTVIEW', val);
    },
    saveSessions:function(store,val){
      store.dispatch('SAVESESSIONS',val)
    }
  }
}