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
        <scroll :on-refresh="getAllUser" :on-infinite="onInfinite" class="userScroll">
          <div class="hiv userListPanent" v-for="user in userList" @click="addTabItem(user)" :key="user">
            <avator :avator="user.avator" class="avator"></avator>
            <div class="name">{{user.name}}</div>
            <div class="unreadNum">
              <span v-if="getUnreadNum(user)">{{user.unreadNum}}</span>
            </div>
          </div>
        </scroll>

      </popup>
      <add-btn class="addBtn" @click="getAllUser()"></add-btn>
      <alert :show.sync="isShowAtTip(alertDate)" :title="'温馨提示'" :content="alertContent" :on-ok="onOk(alertDate)"></alert>
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

export default {
  data() {
    return {
      content: "",
      userList: [],
      showSelectUserPopup: false,
      defaultSession: {},
      active: 0,
      alertDate: "2017/05/31",
      alertContent: `这是一个聊天板块，在这里没人知道你是谁，来自哪里，该去往何处。
      如果你有一些技术上的问题或者伤心难过的事情，我想我是一个不错的免费答疑加陪聊机器人。`
    };
  },
  ready() {
    var ctx = this;
    this.defaultSession = this.sessions[0];
    this.loadHistory();
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
  },
  events: {
    scrollToButtom: function() {
      this.$nextTick(() => {
        var messages = document.getElementsByClassName("massageScroll");
        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
          message.scrollTop = 10000000000;
        }
      });
    }
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
  methods: {
    showPopup(type) {
      this[type] = true;
    },
    getAllUser(done) {
      let receiverIds = [];
      _.map(this.sessions, session => {
        if (session.receiverId) {
          receiverIds.push(session.receiver);
        }
      });
      this.$http
        .put(
          "/api/user/getOtherUser?count=20&offset=0&t=" + new Date().getTime(),
          { exclude: receiverIds }
        )
        .then(res => {
          this.userList = _.map(res.body.data, user => {
            user.unreadNum = 0;
            return user;
          });
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
          receiverIds.push(session.receiver);
        }
      });
      this.$http
        .put(
          "/api/user/getOtherUser?count=20&offset=" +
            this.userList.length +
            "&t=" +
            new Date().getTime(),
          { exclude: receiverIds }
        )
        .then(
          res => {
            let infiniteUsers = _.map(res.body.data, user => {
              user.unreadNum = 0;
              return user;
            });
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
      var ctx = this;
      let skip = 0;
      if (this.defaultSession.list.length >= 10)
        skip = this.defaultSession.list.length;
      this.$socket.emit("find", {
        session: this.defaultSession.session,
        skip: skip,
        limit: 10,
        sort: "createdAt DESC"
      });
      this.$nextTick(function() {
        done && done();
      });
    },
    clickTabItem() {},
    getUnreadNum(sender) {
      if (sender.unreadNum) return true;
      this.$http
        .put("/api/chat/getUnreadNum", { senderId: sender.id })
        .then(res => {
          sender.unreadNum = res.body.data.unreadNum;
        });
      return false;
    },
    isShowAtTip(date) {
      if (!this.ls.hideAtTip) return true;
      if (new Date(date).getTime() > new Date(this.ls.hideAtTip).getTime())
        return true;
      return false;
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
.userIcon {
  margin-top: 4px;
}

.massageScroll {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 40px;
  overflow: auto;
}

.userScroll {
  position: absolute;
  top: 40px;
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

.unreadNum {
  min-width: 40px;
  float: right;
  span {
    font-size: 12px;
    background-color: gray;
    border-radius: 20px;
    padding: 2px 5px;
  }
}
</style>