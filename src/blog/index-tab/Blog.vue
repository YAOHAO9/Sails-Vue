<template>
  <simple-header title="Article">
    <header-link>
      <user-icon class="userIcon"></user-icon>
    </header-link>
  </simple-header>
  <content>
    <scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div v-for="item in list">
        <div class="item" @click="detail(item)">
          <div class="title">{{item.title}}</div>
          <div class="content hiv">
            <div class="description">{{item.description}}…</div>
            <div class="icon" hidden>
              <img src="/static/imgs/mm.jpg"><img>
            </div>
          </div>
          <div class="other">
            <div class="name">YAOHAO </div>
            <div class="date">{{formatDate(item.createdAt)}}</div>
          </div>
        </div>
        <hr>
      </div>
    </scroll>

  </content>

</template>

<script>
  import { SimpleHeader, HeaderLink } from '../../components/header'
  import Content from '../../components/content'
  import Hav from '../../components/hav'
  import ImageGrid from '../components/image-grid'
  import Scroll from '../../components/scroll'
  import Popup from '../../components/popup'
  import Comment from '../fragment/comment'
  import Avatar from '../components/avatar'
  import UserIcon from '../components/user-icon'

  export default {
    data() {
      return {
        list: [],
        showAddArticlePopup: false,
        showCommentPopup: false,
        currentItem: {}
      }
    },
    ready: function () {
      this.onRefresh()
    },
    components: {
      HeaderLink,
      SimpleHeader,
      Content,
      Hav,
      ImageGrid,
      Scroll,
      Popup,
      Comment,
      Avatar,
      UserIcon
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
        this.$router.go({ path: 'article-detail', query: { id: item.id } })
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
      }
    }
  }
</script>
<style scoped>
  .item{
    padding: 5px 5px;
    background-color: white;  
  }
  .title{
    font-size: 15px;
    color: black;
  }
  .description{
    font-size: 13px;
    color: gray;
    width: 100%;
    overflow: hidden;
  }
  .icon{
    width:150px;
    max-height: 70px;
    overflow: hidden;
  }
  .other{
    font-size: 12px;
    color: gray;
    overflow: hidden;
  }
  .name{
    float: left;
  }
  .date{
    float: right;
  }
</style>