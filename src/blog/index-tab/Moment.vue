<template>
  <simple-header title="树洞">
    <header-link>
      <user-icon class="userIcon"></user-icon>
    </header-link>
  </simple-header>
  <content>
    <actions :show.sync="showActions">
      <action-group>
        <action-button class="color-danger" @click="del()">Delete</action-button>
      </action-group>
    </actions>
    <popup :show.sync="showAddMomentPopup" :full="true" :title="''" :show-title-bar="true">
      <add-moment :submit-cb='closeAddMomentPopup'></add-moment>
    </popup>
    <popup :show.sync="showCommentPopup" :full="true" :title="''" :show-title-bar="true">
      <comment :item="currentItem"></comment>
    </popup>
    <div class="popupParent" :class="setImageGridDetailPopupToFrontMost()">
      <popup :show.sync="showImageGridDetail" :full="true" :show-title-bar="false">
        <image-grid-detail :item="currentItem" :close="closeImageGridDetailPopup"></image-grid-detail>
      </popup>
    </div>
    <scroll :on-refresh="onRefresh" :on-infinite="onInfinite" class="scroll">
      <div v-for="item in list" class="item">
        <!--header-->
        <hav margin='3px 40px 3px 46px' :height="'36px'">
          <div>
            <avator :avator="item.user.avator"></avator>
          </div>
          <div class="title-parent">
            <div class="title">{{item.user.name}}</div>
            <div class="date">{{ new Date(item.createdAt) | date}}</div>
          </div>
          <div class="edit">
            <i v-if="user && (user.id == item.user.id || user.email == '986403268@qq.com')" class="fa fa-chevron-down" @click="showActionsFn(item)"></i>
          </div>
        </hav>
        <hr>
        <!--content-->
        <div class="text">
          {{item.content}}
        </div>
        <!--image-->
        <div class="blog-content" @click="showImageGridDetailPopup(item)">
          <image-grid :urls="item.images"></image-grid>
        </div>
        <hr>
        <!--footer-->
        <hev center>
          <div class="btn" :class="operated(item.disapproves)" @click="disapprove(item)">
            <i class="fa fa-thumbs-down">{{item.disapproves && item.disapproves.length}}</i>
          </div>
          <div class="btn" @click="comment(item)">
            <i class="fa fa-commenting">{{item.comments && item.comments.length}}</i>
          </div>
          <div class="btn" :class="operated(item.approves)" @click="approve(item)">
            <i class="fa fa-thumbs-up">{{item.approves && item.approves.length}}</i>
          </div>
        </hev>
        <hr>
      </div>
    </scroll>
    <alert :show.sync="!ls.hideMomentTip" :title="'温馨提示'" :content="alertContent" :on-ok="onOk"></alert>
    <add-btn class="addBtn" @click="showAddMomentPopup = true"></add-btn>

  </content>

</template>

<script>
  import { SimpleHeader, HeaderLink } from '../../components/header'
  import Content from '../../components/content'
  import Hav from '../../components/hav'
  import ImageGrid from '../components/image-grid'
  import AddBtn from '../components/add-btn'
  import Scroll from '../../components/scroll'
  import Popup from '../../components/popup'
  import AddMoment from '../fragment/add-moment'
  import Comment from '../fragment/comment'
  import ImageGridDetail from '../fragment/image-grid-detail'
  import Avator from '../components/avator'
  import UserIcon from '../components/user-icon'
  import { Actions, ActionButton, ActionGroup } from '../../components/actions'
  import { Alert } from '../../components/modal'

  export default {
    data() {
      return {
        list: [],
        showActions: false,
        showAddMomentPopup: false,
        showCommentPopup: false,
        showImageGridDetail: false,
        currentItem: {},
        alertContent:`
        您好！欢迎来到YAOHAO的秘密花园，我会这这里发布一些个人动态。
        如果你有什么好玩的、有趣的也可以在这里给我分享
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
      Hav,
      ImageGrid,
      AddBtn,
      Scroll,
      Popup,
      AddMoment,
      Comment,
      Avator,
      UserIcon,
      ImageGridDetail,
      Actions,
      ActionButton,
      ActionGroup,
      Alert
    },
    methods: {
      onRefresh(done) {
        this.$http.get('api/moment?sort=createdAt DESC&limit=10')
          .then(function (res) {
            this.list = res.body
            done && done()
          }, function (err) {
            done && done()
          })
      },
      onInfinite(done) {
        var ctx = this
        this.$http.get('api/moment?sort=createdAt DESC&limit=10&skip=' + ctx.list.length)
          .then(function (res) {
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
      showActionsFn(item) {
        this.currentItem = item
        this.showActions = true
      },
      showImageGridDetailPopup(item) {
        this.currentItem = item
        this.showImageGridDetail = true
      },
      closeImageGridDetailPopup() {
        this.showImageGridDetail = false
      },
      setImageGridDetailPopupToFrontMost() {
        if (this.showImageGridDetail)
          return 'frontMost'
        this.$nextTick(function () {
          setTimeout(function(){
            $('.popupParent').removeClass('frontMost')
          },400)
        })
        return 'frontMost'
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
      },
      operated(arr) {
        if (this.user)
          return arr.indexOf(this.user.id) >= 0 ? 'operated' : ''
        else
          return false
      },
      del() {
        this.showActions = false
        this.$http.delete('api/moment/delete/' + this.currentItem.id)
          .then(res => {
            let delMoment = res.body
            let delMomentIndex = 0
            let found = this.list.some((moment, index) => {
              delMomentIndex = index
              return moment.id == delMoment.id
            })
            if (found)
              this.list.splice(delMomentIndex, 1)
          })
      },
      edit() {
        this.showActions = false
      },
      onOk(){
        this.ls.hideMomentTip=true
        this.saveLs(this.ls)
      }
    }
  }

</script>
<style lang="less" scoped>
  .userIcon {
    margin-top: 4px;
  }
  
  .item {
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
  
  .operated>i {
    color: #61CDE7;
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
  .addBtn{
    margin-bottom: 50px;
  }
</style>