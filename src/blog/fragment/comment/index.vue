<template>
  <div class="comment">
    <form class="form">
      <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
    </form>
    <div class="scroll">
      <div class="item hiv" v-for="comment in item.comments">
        <div class="portraitParent">
          <avatar :avatar="comment.user.avatar"></avatar>
        </div>
        <div class="commentInfo">
          <div class="info">
            <span class="name">{{(comment.user.name || getCommentDetails(comment))}}</span><span class="date">{{ new Date(comment.createdAt) | date}}</span>
          </div>
          <div class="content">
            {{comment.content}}
          </div>
        </div>
      </div>
      <div class="submit" @click="!submiting && submit()" :class="{'disabled':submiting}">
        确认
      </div>
    </div>
  </div>
</template>
<script>
  import Avatar from '../../components/avatar'
  export default {
    data() {
      return {
        content: "",
        submiting: false
      }
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },
      submitCb: {
        type: Function
      }
    },
    ready: function () {

    },
    components: {
      Avatar
    },
    methods: {
      submit: function () {
        var ctx = this
        this.submiting = true
        var formData = new FormData()
        formData.append("content", this.content)
        if ((!this.content || this.content == '')) {
          alert('留下点什么吧')
          this.submiting = false
          return
        }
        this.$http.post('api/comment/create/' + this.item.id, formData)
          .then((res) => {
            ctx.submitCb && ctx.submitCb()
            ctx.submiting = false
            ctx.content = ''
            ctx.item.comments.push(res.body)
          })
      },
      getCommentDetails: function (comment) {
        var ctx = this;
        this.$http.get('api/comment/' + comment.id)
          .then(function (res) {
            for (var prop in res.body) {
              comment[prop] = res.body[prop]
            }
            comment.user.avatar = '1'
          })
      }
    }
  }
</script>
<style scoped>
  body {
    overflow: auto
  }
  .form{
    position: absolute;
    width: 100%;
    background-color: #EFEFF4;
  }
  .scroll{
    height: 100%;
    padding:95px 0 0px 0;
    overflow: auto;
  }
  textarea {
    margin-top: 10px;
    max-width: 100%;
    min-width: 100%;
    padding: 0 5px;
    text-indent: 2em;
    height: 80px;
  }
  .item{
    margin: 10px 0px
  }
  .portraitParent{
    width: 56px;
  }
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px;
    overflow: hidden;
  }
  .commentInfo{
    width: 100%;
  }
  .info{
    font-size: 12px;
    overflow: hidden;
  }
  .name{
    float: left;
    min-width: 5em;
  }
  .date{
    float: left;
    margin-left: 1em;
  }
  .content{
    font-size: 13px;
  }
  .submit {
    line-height: 40px;
    text-align: center;
    width: 40%;
    margin: 20px auto;
    height: 40px;
    border-radius: 7px;
    color: #3690FF;
    border: 2px solid #3690FF;
  }
</style>