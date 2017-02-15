<template>
  <simple-header title="At"></simple-header>
  <content>
    <tab>
      <tab-item title="WeChat">
        <scroll :on-refresh="loadHistory" class="scroll">
          <message :list="list"></message>
        </scroll>
      </tab-item>
      <tab-item title="YAOHAO">
        <h1 class="demos-title">Girls</h1>
      </tab-item>
    </tab>
    <div class="inputParent hiv">
      <input v-model="content" />
      <div class="btn" @click="sendMessage()">发送</div>
    </div>
  </content>
</template>

<script>
  import { SimpleHeader } from '../../components/header'
  import Content from '../../components/content'
  import { Tab, TabItem } from '../../components/tab'
  import Message from '../components/message'
  import Scroll from '../../components/scroll'

  export default {
    data() {
      return {
        content: '',
        list: []
      }
    },
    ready() {
      var ctx = this
      this.loadHistory()
      this.$socket.on('update', function (chat) {
        ctx.list.push(chat)
        ctx.scrollToButtom()
      })
      this.$socket.on('send', function (chats) {
        chats.sort(function () { return true })
        if (ctx.list.length == 0)
          ctx.list = chats
        else
          ctx.list = chats.concat(ctx.list)
        if (ctx.list.length <= 10) {
          ctx.scrollToButtom()
        }
      })
    },
    components: {
      SimpleHeader,
      Content,
      Tab,
      TabItem,
      Message,
      Scroll
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
      sendMessage() {
        var ctx = this
        if (!this.content) {
          alert('请说些什么吧！')
          return
        }
        this.$socket.emit('submit', { content: this.content, session: '0-0', user: this.user.id })
        this.content = ''
      },
      loadHistory(done) {
        var ctx = this
        this.$socket.emit('find', { session: '0-0', skip: 0, limit: 10, sort: 'createdAt DESC' })
        setTimeout(function () {
          done && done()
        }, 500);
      },
      scrollToButtom() {
        var ctx = this
        setTimeout(function () {
          var message = $('.scroll')[0]
          message.scrollTop = 10000000000
        }, 100);
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
</style>