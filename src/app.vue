<template>
  <div>
    <pc v-if="isPc()"></pc>
    <wap v-else></wap>
  </div>
</template>
<script>
import store from "./vuex/store";
import Toast from "./blog/components/toast";
import PreLoader from "./blog/components/preloader";
import Vue from "vue";
import Pc from "./blog/page/pc";
import Wap from "./blog/page/wap";
export default {
  store,
  components: {
    Toast,
    PreLoader,
    Pc,
    Wap
  },
  methods: {
    isPc() {
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return false;
      } else {
        return true;
      }
    }
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
      if (!~request.url.indexOf("/api/accessrecord")) {
        let formData = {};
        formData.url = request.url;
        formData.method = request.method;
        if (request.params) {
          formData.params = request.params;
        }
        if (request.body) {
          let body = {};
          if (request.body.forEach) {
            request.body.forEach(function(value, key) {
              body[key] = JSON.stringify(value);
            });
          } else {
            body = request.body;
          }
          formData.body = JSON.stringify(body);
        }
        this.$http.post("/api/accessrecord/create", formData).then(res => {});
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
    this.$http.get("/api/user/whoami").then(res => {
      this.saveUser(res.body.data);
    });
    this.$http.get("/api/chat/allUnreadMsgCount").then(res => {
      this.updateUnreadMsgCount(res.body.data);
    });
  },
  sockets: {
    connect: function() {
      this.$http.get("/api/user/whoami").then(res => {
        this.saveUser(res.body.data);
        this.$socket.emit("whoami", {
          userId: res.body.data.id,
          accessOrigin: location.origin
        });
      });
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
    },
    synchronize: function(data) {
      location.href = `/api/web/changeLoginUser?encrypted=${
        data.encrypted
      }&redirect=${location.origin}`;
    }
  }
};
</script>

