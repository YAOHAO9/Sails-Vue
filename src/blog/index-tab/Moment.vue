<template>
  <simple-header title="Moment"></simple-header>
  <content>
    <scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div v-for="item in list" class="item">
        <!--header-->
        <hav margin='3px 40px 3px 46px' center>
          <div>
            <avatar :avatar="item.user.avatar"></avatar>
          </div>
          <div class="title-parent">
            <div class="title">{{item.user.name}}</div>
            <div class="date">{{ new Date(item.createdAt) | date}}</div>
          </div>
          <div class="edit">
            <i class="fa fa-chevron-down"></i>
          </div>
        </hav>
        <!--content-->
        <div class="text">
          {{item.content}}
        </div>
        <!--image-->
        <div class="blog-content" @click="detail(item)">
          <image-grid :urls="item.images"></image-grid>
        </div>
        <hr>
        <!--footer-->
        <hev center>
          <div class="btn" @click="disapprove(item)">
            <i class="fa fa-thumbs-down">{{item.disapproves && item.disapproves.length}}</i>
          </div>
          <div class="btn" @click="comment(item)">
            <i class="fa fa-commenting">{{item.comments && item.comments.length}}</i>
          </div>
          <div class="btn" @click="approve(item)">
            <i class="fa fa-thumbs-up">{{item.approves && item.approves.length}}</i>
          </div>
        </hev>
        <hr>
      </div>
    </scroll>
    <add-btn @click="showAddMomentPopup = true"></add-btn>
    <popup :show.sync="showAddMomentPopup" :full="true" :title="''" :show-title-bar="true">
      <add-moment :submit-cb='closeAddMomentPopup'></add-moment>
    </popup>
    <popup :show.sync="showCommentPopup" :full="true" :title="''" :show-title-bar="true">
      <comment :item="currentItem"></comment>
    </popup>
  </content>

</template>

<script>
  import { SimpleHeader } from '../../components/header'
  import Content from '../../components/content'
  import Hav from '../../components/hav'
  import ImageGrid from '../components/image-grid'
  import AddBtn from '../components/add-btn'
  import Scroll from '../../components/scroll'
  import Popup from '../../components/popup'
  import AddMoment from '../fragment/add-moment'
  import Comment from '../fragment/comment'
  import Avatar from '../components/avatar'

  export default {
    data() {
      return {
        list: [],
        showAddMomentPopup: false,
        showCommentPopup: false,
        currentItem: {}
      }
    },
    ready: function () {
      this.onRefresh()
    },
    components: {
      SimpleHeader,
      Content,
      Hav,
      ImageGrid,
      AddBtn,
      Scroll,
      Popup,
      AddMoment,
      Comment,
      Avatar
    },
    methods: {
      onRefresh(done) {
        this.$http.get('api/moment?sort=createdAt DESC&limit=3')
          .then
          (function (res) {
            this.list = res.body
            done && done()
          }, function (err) {
            done && done()
          })
      },
      onInfinite(done) {
        var ctx = this
        this.$http.get('api/moment?sort=createdAt DESC&limit=10&skip=' + ctx.list.length)
          .then(
          function (res) {
            ctx.list = ctx.list.concat(res.body)
            done()
          },
          function (err) {
            done()
          })
      },
      closeAddMomentPopup() {
        var ctx = this
        ctx.onRefresh(function () {
          ctx.showAddMomentPopup = false
        })
      },
      closeCommentPoupu() {
        var ctx = this
        ctx.onRefresh(function () {
          ctx.showAddMomentPopup = false
        })
      },
      detail(item) {
        if (item.images && item.images.length > 0) {
          this.$router.go({ name: 'Detail', query: { item: JSON.stringify(item) } })
          return
        }
      },
      approve(item) {
        var ctx = this
        ctx.$http.get('api/moment/approve/' + item.id)
          .then(function (updatedItem) {
            item.approves = updatedItem.body.approves
            item.disapproves = updatedItem.body.disapproves
          })
      },
      disapprove(item) {
        var ctx = this
        ctx.$http.get('api/moment/disapprove/' + item.id)
          .then(function (updatedItem) {
            item.approves = updatedItem.body.approves
            item.disapproves = updatedItem.body.disapproves
          })
      },
      comment(item) {
        this.currentItem = item
        this.showCommentPopup = true;
      }
    }
  }
</script>
<style lang="less" scoped>
  .item{
    margin-top: 8px;
    padding-top: 2px; 
    background-color: white;
  }
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px 0 5px;
    overflow: hidden;
  }
  
  img {
    width: 100%;
  }
  .blog-content {
    width: 70%;
    margin: 0 auto;
  }
  
  .title {
    font-weight: 900;
    font-size: 13px;
    color: #333333
  }
  
  .date {
    font-size: 8px;
    color: #888888
  }
  
  .text {
    text-indent: 2em;
    font-size: 13px;
    color: #333333;
    margin: 3px 0px;
  }
  
  i {
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 5px;
    color: #929292;
  }
</style>