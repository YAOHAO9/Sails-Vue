<template>
  <div>
    <router-view transition="slide"></router-view>
  </div>
</template>
<script>
  import store from './vuex/store'
  import vuex from './vuex/vuex'
  export default {
    store,
    vuex,
    sockets: {
      connect: function () {
        if (this.user) {
          this.$socket.emit('who', this.user.id)
        } else {
          this.$http.get('api/user/get')
            .then(res => {
              this.saveUser(res.body)
              this.$socket.emit('who', res.body.id)
            })
        }
      },
      update: function (chat) {
        let foundSession = this.sessions.find((session) => {
          if (session.session == chat.session) {
            session.list.push(chat)
            return true
          }
          return false
        })
        if (!foundSession) {
          var session = {
            session: chat.session,
            name: chat.sender.name,
            list: []
          }
          this.sessions.splice(1, 0, session)
          if (this.sessions.length > 4)
            this.sessions.pop()
          this.showSelectUserPopup = false
          this.$nextTick(() => {
            this.$broadcast('changeItem', 1)
          })
        }
        this.$broadcast('scrollToButtom')
      },
      initSessions: function (sessions) {
        this.saveSessions([this.sessions[0], ...sessions])
      },
      initSession: function (chats) {
        chats.sort(function () { return true })
        this.sessions.forEach((session) => {
          if (chats && chats.length > 0 && session.session == chats[0].session) {
            if (session.list.length == 0)
              session.list = chats
            else
              session.list = chats.concat(session.list)
            if (session.list.length <= 10) {
              this.$broadcast('scrollToButtom')
            }
          }
        })
      }
    }
  }

</script>