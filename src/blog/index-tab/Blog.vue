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
          <div class="article-title">{{currentItem.title}}</div>
          <div class="detail" v-html="currentItem.contentDetail"></div>
          <div class="replyNum">{{currentItem.discussions.length}}&nbsp;回复</div>
          <discussion :item="currentItem" :type="'article'"></discussion>
          <back-btn class="backBtn" @click="showArticalDetail = false"></back-btn>
        </popup>

      </div>
      <scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
        <div v-for="item in list" :key="item">
          <div class="item" @click="detail(item)">
            <div class="content">
              <div class="icon-parent" v-if="item.icon">
                <div class="icon" :style="getImgStyle('/api/archive/'+item.icon)"></div>
              </div>
              <div class="title">{{item.title}}</div>
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
      <alert :show.sync="isShowBlogTip" :title="'温馨提示'" :content="alertContent" :on-ok="onOk(alertDate)"></alert>
    </content>
  </div>
</template>

<script>
import { SimpleHeader, HeaderLink } from "../../components/header";
import Content from "../../components/content";
import Scroll from "../../components/scroll";
import Popup from "../../components/popup";
import Discussion from "../fragment/discussion";
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
      showDiscussionPopup: false,
      currentItem: {},
      alertDate: "2017/05/31",
      isShowBlogTip: false,
      alertContent: `
        这是我的个人博客板块，我会在这里发布一些技术类的博客，欢迎前来交流学习。
        `
    };
  },
  ready: function() {
    this.onRefresh();
    this.isShowBlogTip = (() => {
      if (!this.ls.hideBlogTip) return true;
      return new Date(this.alertDate).getTime() >
        new Date(this.ls.hideBlogTip).getTime()
        ? true
        : false;
    })();
  },
  components: {
    HeaderLink,
    SimpleHeader,
    Content,
    Scroll,
    Popup,
    Discussion,
    Avator,
    UserIcon,
    BackBtn,
    Alert
  },
  methods: {
    submit: function() {
      var ctx = this;
      this.submiting = true;
      if (!this.content || this.content == "") {
        this.showToast("留下点什么吧");
        this.submiting = false;
        return;
      }
      this.$http
        .post("api/discussion/article/" + this.currentItem.id, {
          content: this.content
        })
        .then(res => {
          ctx.submitCb && ctx.submitCb();
          ctx.submiting = false;
          ctx.content = "";
          res.body.data.user = this.user;
          ctx.currentItem.discussions.push(res.body.data);
        });
    },
    fromNow(date) {
      moment.locale("zh-cn");
      return moment(date).fromNow();
    },
    getImgStyle(url) {
      return {
        backgroundSize: "cover",
        backgroundImage: `url('${url}')`,
        backgroundPosition: "center"
      };
    },
    onRefresh(done) {
      this.$http.get("api/article?sort=-createdAt&count=10").then(
        function(res) {
          this.list = res.body.data;
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
        .get("api/article?sort=-createdAt&count=10&offset=" + ctx.list.length)
        .then(
          function(res) {
            ctx.list = ctx.list.concat(res.body.data);
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
    closeDiscussionPoupu() {
      var ctx = this;
      ctx.onRefresh(function() {
        ctx.showAddArticlePopup = false;
      });
    },
    detail(item) {
      // this.$router.go({ path: 'article-detail', query: { id: item.id } })
      this.currentItem = item;
      this.$http.get("/api/article/" + item.id).then(res => {
        this.currentItem.contentDetail = res.body.data.content.content;
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
        .put("api/article/approve/" + item.id)
        .then(function(updatedItem) {
          item.approves = updatedItem.body.data.approves;
          item.disapproves = updatedItem.body.data.disapproves;
        });
    },
    disapprove(item) {
      var ctx = this;
      ctx.$http
        .put("api/article/disapprove/" + item.id)
        .then(function(updatedItem) {
          item.approves = updatedItem.body.data.approves;
          item.disapproves = updatedItem.body.data.disapproves;
        });
    },
    discussion(item) {
      this.currentItem = item;
      this.showDiscussionPopup = true;
    },
    operated(arr) {
      return arr.indexOf(this.user.id) >= 0 ? "operated" : "";
    },
    onOk(date) {
      return function() {
        this.ls.hideBlogTip = new Date(date);
        this.saveLs(this.ls);
      };
    },
    getUser(discussion) {
      if (discussion.user && discussion.user.avator)
        return discussion.user.name;
      else {
        this.$http.get("/api/user/" + discussion.userId).then(res => {
          discussion.user = res.body.data;
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
.article-title {
  margin: 0 auto;
  font-size: 20px;
  text-align: center;
  margin: 20px;
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

.discussion {
  margin-top: 5px;
  margin-bottom: 5px;
}

.discussion .avator {
  width: 46px;
}

.discussion .name {
  color: #666;
  font-size: 12px;
}

.discussion .date {
  color: #0088cc;
  font-size: 12px;
}

.discussion .content {
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
</style>