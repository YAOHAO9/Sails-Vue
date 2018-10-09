<template>
  <div>
    <simple-header title="Chat">
      <header-link>
        <user-icon class="userIcon"></user-icon>
      </header-link>
    </simple-header>
    <content>
      <tab :change-item='changeTabItem' :active="active">
        <tab-item :title="session.name" :index="$index" v-for="session in sessions" :key="session">
          <scroll :on-refresh="loadHistory" class="massageScroll">
            <message :list="session.list" :index="$index"></message>
          </scroll>
        </tab-item>
      </tab>
      <div class="inputParent hiv">
        <div class="sendImg">
          <i class="fa fa-picture-o" aria-hidden="true"></i>
          <input name="image" id="selectChatImg" type="file" multiple="multiple" accept="image/*" />
        </div>
        <input v-model="content" @keyup.enter="sendMessage()" />
        <div class="btn" @click="sendMessage()">发送</div>
      </div>
      <popup :show.sync="showSelectUserPopup" :full="true" :title="'选择你要私聊的用户'" :show-title-bar="true">
        <scroll :on-refresh="getChatUserList" :on-infinite="onInfinite" class="userScroll">
          <div class="hiv userListPanent" v-for="user in userList" @click="addTabItem(user)" :key="user">
            <avator :avator="user.avator" class="avator"></avator>
            <div class="name">{{user.name}}</div>
            <div class="unreadCount">
              <span v-if="user.unreadCount != 0">{{user.unreadCount}}</span>
            </div>
          </div>
        </scroll>

      </popup>
      <add-btn class="addBtn" @click="getChatUserList()"></add-btn>
      <alert :show.sync="isShowAtTip" :title="'温馨提示'" :content="alertContent" :on-ok="onOk(alertDate)"></alert>
    </content>
  </div>
</template>

<script>
import { SimpleHeader, HeaderLink } from "../../components/header";
import Content from "../../components/content";
import { Tab, TabItem } from "../../components/tab";
import Message from "../components/message";
import Scroll from "../../components/scroll";
import AddBtn from "../components/add-btn";
import Popup from "../../components/popup";
import Avator from "../components/avator";
import UserIcon from "../components/user-icon";
import { Alert } from "../../components/modal";
const tabNum = 3;
export default {
  data() {
    return {
      content: "",
      userList: [],
      showSelectUserPopup: false,
      defaultSession: {},
      active: 0,
      alertDate: "2017/05/31",
      isShowAtTip: false,
      alertContent: `这是一个聊天板块，在这里没人知道你是谁，来自哪里，该去往何处。
      如果你有一些技术上的问题或者伤心难过的事情，我想我是一个不错的免费答疑加陪聊机器人。`
    };
  },
  ready() {
    var ctx = this;
    this.defaultSession = this.sessions[0];
    this.loadHistory();
    this.isShowAtTip = (() => {
      if (!this.ls.hideAtTip) return true;
      return new Date(this.alertDate).getTime() >
        new Date(this.ls.hideAtTip).getTime()
        ? true
        : false;
    })();
    $("#selectChatImg")[0].addEventListener("change", function() {
      lrz(this.files[0], { width: 1000 })
        .then(function(rst) {
          var formData = new FormData();
          formData.append("content", ctx.content);
          formData.append("session", ctx.defaultSession.session);
          formData.append("senderId", ctx.user.id);
          formData.append("receiverId", ctx.defaultSession.receiverId);
          formData.append("image", rst.file);

          ctx.$http.post("api/chat/sendImage", formData).then(res => {
            if (res.body.data.session != "0-0") {
              ctx.defaultSession.list.push(res.body.data);
            }
          });
        })
        .catch(err => {
          this.showToast("处理失败");
        });
    });

    this.$http
      .get(
        `/api/user/getChatUserList?count=${tabNum}&offset=0&t=${new Date().getTime()}`
      )
      .then(res => {
        const sessions = _.map(res.body.data, user => {
          var sessionStr =
            this.user.id < user.id
              ? this.user.id + "-" + user.id
              : user.id + "-" + this.user.id;
          return {
            session: sessionStr,
            name: user.name,
            receiverId: user.id,
            list: []
          };
        });
        this.saveSessions([this.sessions[0], ...sessions]);
      });
  },
  components: {
    SimpleHeader,
    HeaderLink,
    UserIcon,
    Content,
    Tab,
    TabItem,
    Message,
    Scroll,
    AddBtn,
    Popup,
    Avator,
    Alert
  },
  events: {
    chatListScrollToButtom: function() {
      this.scrollToButtom();
    }
  },
  methods: {
    scrollToButtom: function() {
      this.$nextTick(() => {
        var messages = document.getElementsByClassName("massageScroll");
        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
          message.scrollTop = 10000000000;
        }
      });
    },
    showPopup(type) {
      this[type] = true;
    },
    getChatUserList(done) {
      let receiverIds = [];
      _.map(this.sessions, session => {
        if (session.receiverId) {
          receiverIds.push(session.receiverId);
        }
      });
      this.$http
        .get(
          `/api/user/getChatUserList?count=${20}&offset=${0}&exclude=${receiverIds.join(
            ","
          )}&t=${new Date().getTime()}`
        )
        .then(res => {
          this.userList = res.body.data;
          if (done) done();
          this.$nextTick(() => {
            this.showSelectUserPopup = true;
          });
        });
    },
    onInfinite(done) {
      let receiverIds = [];
      _.map(this.sessions, session => {
        if (session.receiverId) {
          receiverIds.push(session.receiverId);
        }
      });
      this.$http
        .get(
          `/api/user/getChatUserList?count=${20}&offset=${
            this.userList.length
          }&exclude=${receiverIds.join(",")}&t=${new Date().getTime()}`
        )
        .then(
          res => {
            let infiniteUsers = res.body.data;
            this.userList = [...this.userList, ...infiniteUsers];
            done();
          },
          err => {
            done();
          }
        );
    },
    addTabItem(user) {
      var sessionStr =
        this.user.id < user.id
          ? this.user.id + "-" + user.id
          : user.id + "-" + this.user.id;
      var session = {
        session: sessionStr,
        name: user.name,
        receiverId: user.id,
        list: []
      };
      this.sessions.splice(1, 0, session);
      if (this.sessions.length > 4) this.sessions.pop();
      this.showSelectUserPopup = false;
      this.$nextTick(() => {
        this.$broadcast("changeItem", 1);
      });
    },
    changeTabItem(index) {
      this.defaultSession = this.sessions[index];
      if (this.defaultSession.list.length == 0) this.loadHistory();
    },
    sendMessage() {
      var ctx = this;
      if (!this.content) {
        this.showToast("请说些什么吧！");
        return;
      }
      this.$socket.emit("submit", {
        content: this.content,
        session: this.defaultSession.session,
        senderId: this.user.id,
        receiverId: this.defaultSession.receiverId
      });
      this.content = "";
    },
    loadHistory(done) {
      let offset = 0;
      let activeIndex = this.active;
      let currentSession = this.defaultSession;
      if (currentSession.list.length >= 10) offset = currentSession.list.length;
      this.$http
        .get(
          `/api/chat/find?offset=${offset}&count=${10}&sort=-createdAt&session=${
            currentSession.session
          }`
        )
        .then(res => {
          if (currentSession.list.length >= 10) {
            currentSession.list = res.body.data.concat(currentSession.list);
          } else {
            currentSession.list = res.body.data;
          }
          done && done();
          if (currentSession.list.length <= 10) {
            this.scrollToButtom();
          }
          // this.$broadcast("changeItem", activeIndex);
        });
    },
    onOk(date) {
      return function() {
        this.ls.hideAtTip = new Date(date);
        this.saveLs(this.ls);
      };
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../components/header/variables.less";

.userIcon {
  margin-top: 4px;
}

.massageScroll {
  position: absolute;
  top: @nav-height;
  left: 0;
  right: 0;
  bottom: 40px;
  overflow: auto;
}

.userScroll {
  position: absolute;
  top: @nav-height;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.inputParent {
  height: 40px;
  position: absolute;
  bottom: 0;
  width: 100%;
  .sendImg {
    padding: 5px;
    position: relative;
    width: 42px;
    input {
      position: absolute;
      overflow: hidden;
      opacity: 0;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: 0;
      padding: 0;
      width: 32px;
      height: 40px;
    }
  }
  .fa-picture-o {
    line-height: 30px;
    text-align: center;
    color: #61cde7;
  }
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
    background-color: #61cde7;
    font-size: 15px;
  }
}

.addBtn {
  margin-bottom: 90px; // margin-right: 40px;
}

.userListPanent {
  margin: 5px 15px;
  line-height: 36px;
}

.avator {
  min-width: 36px;
}

.name {
  width: 100%;
}

.unreadCount {
  min-width: 40px;
  float: right;
  span {
    font-size: 12px;
    background-color: red;
    border-radius: 20px;
    padding: 2px 5px;
    color: white;
  }
}
</style>