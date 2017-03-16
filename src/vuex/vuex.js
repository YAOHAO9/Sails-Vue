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
    },
    toast: function (state) {
      return state.global.toast
    },
    preLoader: function (state) {
      return state.global.preLoader
    },
    currentView: function (state) {
      return state.indexView
    },
    ls: function (state) {
      return state.localStoage
    },
    unreadMsgNum: function (state) {
      return state.unreadMsgNum
    }
  },
  actions: {
    saveUser: function (store, val) {
      store.dispatch('SAVEUSER', val);
    },
    saveCurrentView: function (store, val) {
      store.dispatch('SAVECURRENTVIEW', val);
    },
    saveSessions: function (store, val) {
      store.dispatch('SAVESESSIONS', val)
    },
    showToast: function (store, val) {
      if (!(val instanceof Object)) {
        val = { text: val }
      }
      if (!val.show)
        val.show = true

      store.dispatch('SHOWTOAST', val)
      setTimeout(() => {
        val.show = false
        store.dispatch('SHOWTOAST', val)
      }, 2000)
    },
    showPreLoader: function (store, val) {
      store.dispatch('SHOWPRELOADER', val)
    },
    saveLs: function (store, val) {
      store.dispatch('SAVELOCALSTORAGE', val)
    },
    updateUnreadMsgNum: function (store, val) {
      store.dispatch('SAVEUNREADMSGNUM', val)
    }
  }
}