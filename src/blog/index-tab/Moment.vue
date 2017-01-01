<template>
  <simple-header title="Moment"></simple-header>
  <content>
    <scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div v-for="item in list" class="item">
        <!--Item header-->
        <hav margin='3px 40px 3px 46px' center>
          <div>
            <div class="portrait"><img src="../../assets/images/blog/widget_dface.png" /></div>
          </div>
          <div class="title-parent">
            <div class="title">{{item.user.name}}</div>
            <div class="date">{{ new Date(item.createdAt) | date}}</div>
          </div>
          <div class="edit">
            <i class="fa fa-chevron-down"></i>
          </div>
        </hav>
        <div class="text">
          {{item.content}}
        </div>
        <div class="blog-content">
          <image-grid :urls="item.images"></image-grid>
        </div>
        <hr>
        <hev center>
          <div>
            <i class="fa btn fa-thumbs-down"></i>
          </div>
          <div>
            <i class="fa btn fa-commenting"></i>
          </div>
          <div>
            <i class="fa btn fa-thumbs-up"></i>
          </div>
        </hev>
        <hr>
      </div>
    </scroll>
    <add-btn @click="showFull = true"></add-btn>
    <popup :show.sync="showFull" :full="true" :title="''" :show-title-bar="true" >
      <add-moment :submit-cb='closePopup'></add-moment>
    </popup>
  </content>

</template>

<script>
  import { SimpleHeader } from '../../components/header'
  import Content from '../../components/content'
  import Hav from '../../components/hav'
  import Hev from '../../components/hev'
  import ImageGrid from '../components/image-grid'
  import AddBtn from '../components/add-btn'
  import Scroll from '../../components/scroll'
  import Popup from '../../components/popup'
  import AddMoment from '../page/add-moment'

  export default {
    data() {
      return {
        list: [],
        showFull: false,
      }
    },
    ready: function () {
      this.onRefresh()
    },
    components: {
      SimpleHeader,
      Content,
      Hav,
      Hev,
      ImageGrid,
      AddBtn,
      Scroll,
      Popup,
      AddMoment
    },
    methods: {
      onRefresh(done) {
        this.$http.get('api/moment?sort=createdAt DESC&limit=10')
          .then
          (function (res) {
            this.list = res.body
            done && done()
          }, function (err) {
            alert(err)
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
            alert(err)
            done()
          })
      },
      closePopup() {
        var ctx = this
        ctx.onRefresh(function () {
          ctx.showFull = false
        })
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
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 33px;
    border-radius: 5px;
    color: #929292;
  }
</style>