<template>
  <div>
    <router-view transition="slide"></router-view>
    <pre-loader :show="preLoader.show"></pre-loader>
    <toast :show="toast.show" :text="toast.text"></toast>
  </div>
</template>
<script>
import store from "./vuex/store";
import Toast from "./blog/components/toast";
import PreLoader from "./blog/components/preloader";
import Vue from "vue";
export default {
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
          this.showToast({ text: JSON.stringify(res.body) });
        }
        return res;
      });
    });
  },
  ready() {
    this.$http.get("api/chat/allUnreadMsgNum").then(res => {
      this.updateUnreadMsgNum(res.body.unreadMsgNum);
    });
  },
  sockets: {
    connect: function() {
      if (this.user) {
        this.$socket.emit("who", this.user.id);
      } else {
        this.$http.get("api/user/get").then(res => {
          this.saveUser(res.body);
          this.$socket.emit("who", res.body.id);
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
            this.updateUnreadMsgNum(this.unreadMsgNum + 1);
          return true;
        }
        return false;
      });
      if (!foundSession) {
        var session = {
          session: chat.session,
          name: chat.sender.name,
          receiver: chat.sender.id,
          list: []
        };
        this.sessions.splice(1, 0, session);
        if (this.sessions.length > 4) this.sessions.pop();
        this.showSelectUserPopup = false;
        this.$nextTick(() => {
          this.$broadcast("changeItem", 1);
        });
      }
      this.$broadcast("scrollToButtom");
    },
    initSessions: function(sessions) {
      this.saveSessions([this.sessions[0], ...sessions]);
    },
    initSession: function(chats) {
      chats = _.sortBy(chats, function(chat, index) {
        return -index;
      });
      _.each(this.sessions, session => {
        if (chats && chats.length > 0 && session.session == chats[0].session) {
          if (session.list.length < 10) session.list = chats;
          else session.list = chats.concat(session.list);
          if (session.list.length <= 10) {
            this.$broadcast("scrollToButtom");
          }
        }
      });
    }
  }
};
</script>