<template>
  <simple-header title="Blog">
    <header-link>
      <user-icon class="userIcon"></user-icon>
    </header-link>
  </simple-header>
  <content>
    <div class="popupParent" :class="setArticalDetailPopupToFrontMost()">
      <popup :show.sync="showArticalDetail" :full="true" :show-title-bar="false">
        <div class="detail">
          {{{currentItem.contentDetail}}}
        </div>
        <div class="replyNum">{{currentItem.comments.length}}&nbsp;回复</div>
        <div v-for="comment in currentItem.comments">
          <div class="comment head hiv">
            <div class="avator">
              <avator :avator="comment.user.avator"></avator>
            </div>
            <div>
              <div class="hiv">
                <div class="name">{{getUser(comment)}}</div>
                <div class="date">{{'&nbsp;&nbsp;'+($index + 1)+'楼&nbsp;'}}{{comment.createdAt | date}}</div>
              </div>
              <div class="content">{{{comment.content}}}</div>
            </div>
          </div>
          <hr>
        </div>
        <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
        <div class="submit" @click="!submiting && submit()" :class="{'disabled':submiting}">
          确认
        </div>
        <back-btn class="backBtn" @click="showArticalDetail = false"></back-btn>
      </popup>
  
    </div>
    <scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div v-for="item in list">
        <div class="item" @click="detail(item)">
          <div class="title">{{item.title}}</div>
          <div class="content">
            <div class="icon" v-if="item.icon">
              <img :src="'/api/file/find/'+item.icon"><img>
            </div>
            {{item.description}}…
          </div>
          <div class="other">
            <div class="name">YAOHAO </div>
            <div class="date">{{formatDate(item.createdAt)}}</div>
          </div>
        </div>
        <hr>
      </div>
    </scroll>
    <alert :show.sync="!ls.hideBlogTip" :title="'温馨提示'" :content="alertContent" :on-ok="onOk"></alert>
  </content>
</template>

<script>
import { SimpleHeader, HeaderLink } from '../../components/header'
import Content from '../../components/content'
import Scroll from '../../components/scroll'
import Popup from '../../components/popup'
import Comment from '../fragment/comment'
import Avator from '../components/avator'
import UserIcon from '../components/user-icon'
import BackBtn from '../components/back-btn'
import { Alert } from '../../components/modal'

export default {
  data() {
    return {
      content: "",
      submiting: false,
      list: [],
      showArticalDetail: false,
      showAddArticlePopup: false,
      showCommentPopup: false,
      currentItem: {},
      alertContent: `
        这个是我的个人博客板块，我会在这发布一些关于Nodejs全栈相关的文章，欢迎常来学习，探讨。
        `
    }
  },
  ready: function () {
    this.onRefresh()
  },
  components: {
    HeaderLink,
    SimpleHeader,
    Content,
    Scroll,
    Popup,
    Comment,
    Avator,
    UserIcon,
    BackBtn,
    Alert
  },
  methods: {
    submit: function () {
      var ctx = this
      this.submiting = true
      var formData = new FormData()
      formData.append("content", this.content)
      if ((!this.content || this.content == '')) {
        this.showToast('留下点什么吧')
        this.submiting = false
        return
      }
      this.$http.post('api/comment/article/' + this.currentItem.id, formData)
        .then((res) => {
          ctx.submitCb && ctx.submitCb()
          ctx.submiting = false
          ctx.content = ''
          ctx.currentItem.comments.push(res.body)
        })
    },
    onRefresh(done) {
      this.$http.get('api/article?sort=createdAt DESC&limit=10')
        .then(function (res) {
          this.list = res.body
          done && done()
        }, function (err) {
          done && done()
        })
    },
    onInfinite(done) {
      var ctx = this
      this.$http.get('api/article?sort=createdAt DESC&limit=10&skip=' + ctx.list.length)
        .then(function (res) {
          ctx.list = ctx.list.concat(res.body)
          done()
        },
        function (err) {
          done()
        })
    },
    closeAddArticlePopup() {
      var ctx = this
      ctx.onRefresh(function () {
        ctx.showAddArticlePopup = false
      })
    },
    closeCommentPoupu() {
      var ctx = this
      ctx.onRefresh(function () {
        ctx.showAddArticlePopup = false
      })
    },
    detail(item) {
      // this.$router.go({ path: 'article-detail', query: { id: item.id } })
      this.currentItem = item
      this.$http.get('/api/article/find/' + item.id)
        .then(res => {
          this.currentItem.contentDetail = res.body.content
          this.showArticalDetail = true
        })
    },
    setArticalDetailPopupToFrontMost() {
      if (this.showArticalDetail)
        return 'frontMost'
      this.$nextTick(function () {
        setTimeout(function () {
          $('.popupParent').removeClass('frontMost')
        }, 400)
      })
      return 'frontMost'
    },
    approve(item) {
      var ctx = this
      ctx.$http.get('api/article/approve/' + item.id)
        .then(function (updatedItem) {
          item.approves = updatedItem.body.approves
          item.disapproves = updatedItem.body.disapproves
        })
    },
    disapprove(item) {
      var ctx = this
      ctx.$http.get('api/article/disapprove/' + item.id)
        .then(function (updatedItem) {
          item.approves = updatedItem.body.approves
          item.disapproves = updatedItem.body.disapproves
        })
    },
    comment(item) {
      this.currentItem = item
      this.showCommentPopup = true;
    },
    formatDate(date) {
      date = new Date(date)
      var year = date.getFullYear()
      var month = (date.getMonth() + 1).toString().replace(/^(\d)$/, '0\$1')
      var day = date.getDate().toString().replace(/^(\d)$/, '0\$1')
      return year == (new Date).getFullYear() ? (month + '-' + day) : (year + '-' + month + '-' + day)
    },
    operated(arr) {
      return arr.indexOf(this.user.id) >= 0 ? 'operated' : ''
    },
    onOk() {
      this.ls.hideBlogTip = true
      this.saveLs(this.ls)
    },
    getUser(comment) {
      if (isNaN(comment.user))
        return comment.user.name
      else {
        this.$http.get('/api/user/find/' + comment.user)
          .then(res => {
            comment.user = res.body
          })
      }
    }
  }
}
</script>
<style scoped>
.userIcon {
  margin-top: 4px;
}

.item {
  padding: 5px 5px;
  background-color: white;
}

.title {
  font-size: 15px;
  color: black;
}

.content {
  font-size: 13px;
  color: gray;
  width: 100%;
  overflow: hidden;
}

.icon {
  width: 120px;
  max-height: 80px;
  overflow: hidden;
  float: right;
}

.other {
  font-size: 12px;
  color: gray;
  overflow: hidden;
}

.name {
  float: left;
}

.date {
  float: right;
}

.popupParent {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.frontMost {
  z-index: 9999
}
.detail{
  padding: 5px 
}
.replyNum {
  padding:20px 15px 5px;
  font-size: 14px;
  color: #444444;
  background-color: #f6f6f6;
}

.comment {
  margin-top: 5px;
  margin-bottom: 5px;
}

.comment .avator {
  width: 46px;
}

.comment .name {
  color: #666;
  font-size: 12px;
}

.comment .date {
  color: #0088cc;
  font-size: 12px;
}

.comment .content {
  padding-top: 5px;
  font-size: 13px;
  padding-right: 5px;
}

hr {
  width: 80%;
  margin: 0 auto;
}

.backBtn {
  margin-bottom: 40px;
}

textarea {
  margin-top: 10px;
  max-width: 100%;
  min-width: 100%;
  padding: 0 5px;
  text-indent: 2em;
  height: 80px;
}

.submit {
  line-height: 40px;
  text-align: center;
  width: 40%;
  margin: 10px auto;
  height: 40px;
  border-radius: 7px;
  color: #3690FF;
  border: 2px solid #3690FF;
}
</style>