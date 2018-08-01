<template>
  <div>
  <simple-header title="Blog">
    <header-link>
      <user-icon class="userIcon"></user-icon>
    </header-link>
  </simple-header>
  <content>
    <div class="popupParent" :class="setArticalDetailPopupToFrontMost()">
      <popup :show.sync="showArticalDetail" :full="true" :show-title-bar="false">
        <div class="detail" v-html="currentItem.contentDetail">
        </div>
        <div class="replyNum">{{currentItem.comments.length}}&nbsp;回复</div>
        <div v-for="comment in currentItem.comments" :key="comment">
          <div class="comment head hiv">
            <div class="avator">
              <avator :avator="comment.user.avator"></avator>
            </div>
            <div>
              <div class="hiv">
                <div class="name">{{getUser(comment)}}</div>
                <div class="date">{{'&nbsp;&nbsp;'+($index + 1)+'楼&nbsp;'}}{{comment.createdAt | date}}</div>
              </div>
              <div class="content" v-html="comment.content"></div>
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
      <div v-for="item in list" :key="item">
        <div class="item" @click="detail(item)">
          <div class="title">{{item.title}}</div>
          <div class="content">
            <div class="icon-parent" v-if="item.icon">
               <div class="icon" :style="getImgStyle('/api/file/find/'+item.icon)"></div>
            </div>
            {{item.description}}…
          </div>
          <div class="other">
            <div class="name">YAOHAO</div>
            <div class="date">{{fromNow(item.createdAt)}}</div>
          </div>
        </div>
        <hr>
      </div>
    </scroll>
    <alert :show.sync="isShowBlogTip(alertDate)" :title="'温馨提示'" :content="alertContent" :on-ok="onOk(alertDate)"></alert>
  </content>
  </div>
</template>

<script>
import { SimpleHeader, HeaderLink } from "../../components/header";
import Content from "../../components/content";
import Scroll from "../../components/scroll";
import Popup from "../../components/popup";
import Comment from "../fragment/comment";
import Avator from "../components/avator";
import UserIcon from "../components/user-icon";
import BackBtn from "../components/back-btn";
import { Alert } from "../../components/modal";
import moment from "moment";
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
      alertDate: "2017/05/31",
      alertContent: `
        这是我的个人博客板块，我会在这里发布一些技术类的博客，欢迎前来交流学习。
        （PS：因为各种原因还没有一篇真正意义上的技术类博客诞生，下面的几篇是我测试程序是否可用的测试文章，请自觉忽略。。。）
        `
    };
  },
  ready: function() {
    this.onRefresh();
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
    submit: function() {
      var ctx = this;
      this.submiting = true;
      var formData = new FormData();
      formData.append("content", this.content);
      if (!this.content || this.content == "") {
        this.showToast("留下点什么吧");
        this.submiting = false;
        return;
      }
      this.$http
        .post("api/comment/article/" + this.currentItem.id, formData)
        .then(res => {
          ctx.submitCb && ctx.submitCb();
          ctx.submiting = false;
          ctx.content = "";
          ctx.currentItem.comments.push(res.body);
        });
    },
    fromNow(date) {
      moment.locale("zh-cn");
      return moment(date).fromNow();
    },
    getImgStyle(url) {
      return {
        backgroundSize: "cover",
        backgroundImage: `url('${url}')`
      };
    },
    onRefresh(done) {
      this.$http.get("api/article?sort=createdAt DESC&limit=10").then(
        function(res) {
          this.list = res.body;
          done && done();
        },
        function(err) {
          done && done();
        }
      );
    },
    onInfinite(done) {
      var ctx = this;
      this.$http
        .get("api/article?sort=createdAt DESC&limit=10&skip=" + ctx.list.length)
        .then(
          function(res) {
            ctx.list = ctx.list.concat(res.body);
            done();
          },
          function(err) {
            done();
          }
        );
    },
    closeAddArticlePopup() {
      var ctx = this;
      ctx.onRefresh(function() {
        ctx.showAddArticlePopup = false;
      });
    },
    closeCommentPoupu() {
      var ctx = this;
      ctx.onRefresh(function() {
        ctx.showAddArticlePopup = false;
      });
    },
    detail(item) {
      // this.$router.go({ path: 'article-detail', query: { id: item.id } })
      this.currentItem = item;
      this.$http.get("/api/article/find/" + item.id).then(res => {
        this.currentItem.contentDetail = res.body.content;
        this.showArticalDetail = true;
      });
    },
    setArticalDetailPopupToFrontMost() {
      if (this.showArticalDetail) return "frontMost";
      this.$nextTick(function() {
        setTimeout(function() {
          $(".popupParent").removeClass("frontMost");
        }, 400);
      });
      return "frontMost";
    },
    approve(item) {
      var ctx = this;
      ctx.$http
        .get("api/article/approve/" + item.id)
        .then(function(updatedItem) {
          item.approves = updatedItem.body.approves;
          item.disapproves = updatedItem.body.disapproves;
        });
    },
    disapprove(item) {
      var ctx = this;
      ctx.$http
        .get("api/article/disapprove/" + item.id)
        .then(function(updatedItem) {
          item.approves = updatedItem.body.approves;
          item.disapproves = updatedItem.body.disapproves;
        });
    },
    comment(item) {
      this.currentItem = item;
      this.showCommentPopup = true;
    },
    operated(arr) {
      return arr.indexOf(this.user.id) >= 0 ? "operated" : "";
    },
    isShowBlogTip(date) {
      if (!this.ls.hideBlogTip) return true;
      if (new Date(date).getTime() > new Date(this.ls.hideBlogTip).getTime())
        return true;
      return false;
    },
    onOk(date) {
      return function() {
        this.ls.hideBlogTip = new Date(date);
        this.saveLs(this.ls);
      };
    },
    getUser(comment) {
      if (isNaN(comment.user)) return comment.user.name;
      else {
        this.$http.get("/api/user/find/" + comment.user).then(res => {
          comment.user = res.body;
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
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

.icon-parent {
  float: right;

  .icon {
    width: 120px;
    height: 80px;
  }
}

.other {
  font-size: 10px;
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
  z-index: 9999;
}

.detail {
  padding: 5px;
}

.replyNum {
  padding: 20px 15px 5px;
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
  padding: 0 15px;
  height: 80px;
}

.submit {
  line-height: 40px;
  text-align: center;
  width: 40%;
  margin: 10px auto;
  height: 40px;
  border-radius: 7px;
  color: #3690ff;
  border: 2px solid #3690ff;
}
</style>