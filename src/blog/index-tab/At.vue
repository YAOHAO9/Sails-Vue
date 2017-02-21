<template>
  <simple-header title="At"></simple-header>
  <content>
    <tab :change-item='changeTabItem' :active="active">
      <tab-item :title="session.name" :index="$index" v-for="session in sessions">
        <scroll :on-refresh="loadHistory" class="scroll">
          <message :list="session.list"></message>
        </scroll>
      </tab-item>
    </tab>
    <div class="inputParent hiv">
      <input v-model="content" />
      <div class="btn" @click="sendMessage()">发送</div>
    </div>
    <popup :show.sync="showSelectUserPopup" :full="true" :title="'选择你要私聊的用户'" :show-title-bar="true">
      <div class="hiv userListPanent" v-for="user in userList" @click="addTabItem(user)">
        <avatar :avatar="user.avatar"></avatar>
        <div>{{user.name}}</div>
      </div>
    </popup>
    <add-btn class="addBtn" @click="showSelectUserPopup = true"></add-btn>
  </content>
</template>

<script>
  import { SimpleHeader } from '../../components/header'
  import Content from '../../components/content'
  import { Tab, TabItem } from '../../components/tab'
  import Message from '../components/message'
  import Scroll from '../../components/scroll'
  import AddBtn from '../components/add-btn'
  import Popup from '../../components/popup'
  import Avatar from '../components/avatar'

  export default {
    data() {
      return {
        content: '',
        userList: [],
        showSelectUserPopup: false,
        defaultSession: {},
        active: 0,
        sessions: [
          {
            session: "0-0",
            name: 'WeChat',
            list: []
          }
        ]
      }
    },
    ready() {
      var ctx = this
      this.defaultSession = this.sessions[0]
      this.loadHistory()
      this.getAllUser()
      this.$socket.on('update', (chat) => {

        this.sessions.forEach((session) => {
          if (session.session == chat.session)
            session.list.push(chat)
          else if (session.session.indexOf(chat.session.replace(/(\d+)-(\d+)/, "$2-$1")) >= 0)
            session.list.push(chat)
        })

        ctx.scrollToButtom()
      })
      this.$socket.on('send', function (chats) {
        chats.sort(function () { return true })
        if (ctx.defaultSession.list.length == 0)
          ctx.defaultSession.list = chats
        else
          ctx.defaultSession.list = chats.concat(ctx.defaultSession.list)
        if (ctx.defaultSession.list.length <= 10) {
          ctx.scrollToButtom()
        }
      })
    },
    destroyed() {
      this.$socket.removeEventListener('update')
      this.$socket.removeEventListener('send')
    },
    components: {
      SimpleHeader,
      Content,
      Tab,
      TabItem,
      Message,
      Scroll,
      AddBtn,
      Popup,
      Avatar
    },
    vuex: {
      getters: {
        user: function (state) {
          return state.user
        }
      },
      actions: {
        saveUser: function (store, val) {
          store.dispatch('SAVEUSER', val);
        }
      }
    },
    methods: {
      getAllUser() {
        this.$http.get('/api/user').then(res => {
          this.userList = res.body
        })
      },
      addTabItem(user) {
        var sessionStr = this.user.id < user.id ? (this.user.id + '-' + user.id) : (user.id + '-' + this.user.id)
        var session = {
          session: sessionStr,
          name: user.name,
          list: []
        }
        this.sessions.splice(1, 0, session)
        if (this.sessions.length > 4)
          this.sessions.pop()
        this.showSelectUserPopup = false
        setTimeout(() => {
          this.$broadcast('changeItem', 1)
        }, 100)
      },
      changeTabItem(index) {
        this.defaultSession = this.sessions[index]
        if (this.defaultSession.list.length == 0)
          this.loadHistory()
      },
      sendMessage() {
        var ctx = this
        if (!this.content) {
          alert('请说些什么吧！')
          return
        }
        this.$socket.emit('submit', { content: this.content, session: this.defaultSession.session, user: this.user.id })
        this.content = ''
      },
      loadHistory(done) {
        var ctx = this
        this.$socket.emit('find', { session: this.defaultSession.session, skip: this.defaultSession.list.length, limit: 10, sort: 'createdAt DESC' })
        setTimeout(function () {
          done && done()
        }, 500);
      },
      scrollToButtom() {
        setTimeout(() => {
          var messages = document.getElementsByClassName('scroll')
          for (var i = 0; i < messages.length; i++) {
            var message = messages[i]
            message.scrollTop = 10000000000
          }
        }, 100);
      },
      clickTabItem() {

      }
    }
  }

</script>
<style lang="less" scoped>
  .scroll {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 40px;
    overflow: auto;
  }
  
  .inputParent {
    height: 40px;
    position: absolute;
    bottom: 0;
    width: 100%;
    input {
      width: 100%;
      margin: 3px;
      border-radius: 5px;
      padding-left: 8px;
    }
    .btn {
      width: 100px;
      margin: 3px;
      border-radius: 5px;
      line-height: 36px;
      text-align: center;
      background-color: #61CDE7;
      font-size: 15px;
    }
  }
  
  .addBtn {
    margin-bottom: 40px;
    margin-right: 40px;
  }
  
  .userListPanent {
    padding: 5px 15px;
    line-height: 36px;
  }
</style>