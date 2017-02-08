<template>
  <simple-header title="At"></simple-header>
  <content>
    <tab>
      <tab-item title="WeChat">
        <message :data-and-operater="dataAndOperater"></message>
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

  export default {
    data() {
      return {
        content: '',
        dataAndOperater: {
          list: [],
          scrollToButtom: function () { }
        }
      }
    },
    ready: function () {
      this.loadHistory()
    },
    components: {
      SimpleHeader,
      Content,
      Tab,
      TabItem,
      Message
    },
    methods: {
      sendMessage() {
        var ctx = this
        var formData = new FormData()
        formData.append('content', this.content)
        formData.append('session', '0-0')
        this.$http.post('/api/chat/create', formData)
          .then(function (res) {
            ctx.dataAndOperater.list.push(res.body)
            ctx.scrollToButtom()
          })
          .catch(function (e) {
            alert('Error' + e)
          })
      },
      loadHistory(done) {
        var ctx = this
        this.$http.get('api/chat?sort=createdAt DESC&limit=10')
          .then(function (res) {
            res.body.sort(function(){return true})
            ctx.dataAndOperater.list = res.body
            ctx.scrollToButtom()
            done && done()
          }, function (err) {
            done && done()
          })
      },
      scrollToButtom() {
        var ctx = this
        setTimeout(function () {
          ctx.dataAndOperater.scrollToButtom()
        }, 100);
      }
    }
  }

</script>
<style lang="less" scoped>
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