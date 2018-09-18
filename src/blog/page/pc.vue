<template>
    <div>
        <row>
            <wrapper :padding="'20px 100px'" class="wrapper">
                <div class="bg-parent">
                    <div class="bg">
                        <div class="inner">
                            <router-view transition="slide"></router-view>
                            <pre-loader :show="preLoader.show"></pre-loader>
                            <toast :show="toast.show" :text="toast.text"></toast>
                        </div>
                    </div>
                </div>
            </wrapper>
            <column :padding="'0 100px 0 0'">
                <div class="description">
                    欢迎来到YAOHAO的个人网站，在这里您暂时叫“{{user.name}}”，您可以点击头像，进入个人信息编辑界面，编辑您的头像和姓名。在这里您可以分享你的所见所闻，也可以直接跟我小主一对一聊天。我也会第一时间通知小主， 有时可能不会那么及时，希望您能耐心等待，或者休息一会，再来逛逛。(PS:在这里没人知道您的真实身份，希望您可以畅所欲言)
                </div>
                <row>
                    <img style="width:200px" :src="qrcode" />
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机扫码体验</div>
                </row>
            </column>
        </row>
        <div class="copyright">
            © 2014-2018 YAOHAO 版权所有 闽ICP备 15000277号-1
        </div>
    </div>
</template>
<script>
import store from "./vuex/store";
import Toast from "./blog/components/toast";
import PreLoader from "./blog/components/preloader";

import Vue from "vue";
export default {
  data: () => {
    return {
      qrcode: ""
    };
  },
  store,
  components: {
    Toast,
    PreLoader
  },
  created() {
    if (!this.ls) {
      let ls = {};
      for (var prop in localStorage) {
        try {
          ls[prop] = JSON.parse(localStorage[prop]);
        } catch (e) {}
      }
      this.saveLs(ls);
    }
    Vue.http.interceptors.push((request, next) => {
      if (!~request.url.indexOf("api/accessrecord")) {
        let formData = new FormData();
        formData.append("url", request.url);
        formData.append("method", request.method);
        if (request.params)
          formData.append("params", JSON.stringify(request.params));
        if (request.body) {
          let body = {};
          if (request.body.forEach) {
            request.body.forEach(function(value, key) {
              body[key] = JSON.stringify(value);
            });
          } else {
            body = request.body;
          }
          formData.append("body", JSON.stringify(body));
        }
        this.$http.post("api/accessrecord/create", formData).then(res => {});
      }
      next(res => {
        if (!res.ok) {
          this.showToast({ text: JSON.stringify(res.body.data) });
        }
        return res;
      });
    });
  },
  ready() {
    this.$http.get("api/user/whoami").then(res => {
      this.saveUser(res.body.data);
    });
    this.$http.get("api/chat/allUnreadMsgCount").then(res => {
      this.updateUnreadMsgCount(res.body.data);
    });
    this.$http.get(`api/user/qrcode?origin=${location.origin}`).then(res => {
      this.qrcode = res.body.data;
    });
  },
  sockets: {
    connect: function() {
      if (this.user) {
        this.$socket.emit("whoami", this.user.id);
      } else {
        this.$http.get("api/user/whoami").then(res => {
          this.saveUser(res.body.data);
          this.$socket.emit("whoami", res.body.data.id);
        });
      }
    },
    update: function(chat) {
      let foundSession = _.some(this.sessions, (session, index) => {
        if (session.session == chat.session) {
          session.list.push(chat);
          if (session.session == "0-0") return true;
          this.$broadcast("changeItem", index);
          if (chat.sender.id != this.user.id)
            this.updateUnreadMsgCount(this.unreadMsgCount + 1);
          return true;
        }
        return false;
      });
      if (!foundSession) {
        var session = {
          session: chat.session,
          name: chat.sender.name,
          receiverId: chat.sender.id,
          list: []
        };
        this.sessions.splice(1, 0, session);
        if (this.sessions.length > 4) this.sessions.pop();
        this.showSelectUserPopup = false;
        this.$nextTick(() => {
          this.$broadcast("changeItem", 1);
        });
      }
      this.$broadcast("chatListScrollToButtom");
    }
  }
};
</script>

<style lang="less" scoped>
.bg-parent {
  border-radius: 36px;
  width: 323px;
  height: 677px;
  overflow: hidden;
  .bg {
    background-image: url("./assets/images/phone_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 325px;
    height: 678px;
    padding: 35px 10px;
    .inner {
      width: 305px;
      height: 608px;
      background-color: #eee;
      overflow: auto;
      position: relative;
      border-radius: 10px;
    }
  }
}
.description {
  text-indent: 2em;
  margin-bottom: 50px;
}
.copyright {
  margin: 20px;
  text-align: center;
  font-size: 13px;
  color: #888;
  line-height: 1.6;
}
</style>
