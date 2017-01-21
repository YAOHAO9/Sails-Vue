<template>
  <simple-header title="Article">
    <header-link>
      <user-icon class="userIcon"></user-icon>
    </header-link>
  </simple-header>
  <content>
    <scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div v-for="item in list">
        <div class="item hiv" class="item" @click="detail(item)">
          <div class="iconParent">
            <avatar :avatar="item.icon"></avatar>
          </div>
          <div class="articleInfo">
            <div class="info">
              <span class="name">YAOHAO</span><span class="date">{{ formatDate(item.createdAt)}}</span>
            </div>
            <div class="content">
              {{item.title}}
            </div>
          </div>
          <div class="operate">
            operated
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
        location = '/api/article/findOne/' + item.id
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
<style  scoped>
  .item{
    padding: 5px 5px;
    background-color: white;  
  }
  .iconParent{
    width: 60px;
  }
  .portrait {
    border-radius: 10px;
    background-color: gray;
    height: 50px;
    width: 50px;
    margin: 0 5px;
    overflow: hidden;
  }
  .articleInfo{
    padding: 0 10px 0;
    width: 100%;
  }
  .info{
    color: #828282;
    overflow: hidden;
  }
  .name{
    float: left;
    font-size: 13px;
    
    min-width: 5em;
  }
  .date{
    font-size: 13px;
    float: right;
    margin-left: 1em;
  }
  .content{
    font-size: 16px;
    color: #0A0A0A;
  }
  .operate{

  }
</style>