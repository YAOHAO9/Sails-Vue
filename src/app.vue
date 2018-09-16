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
      this.updateUnreadMsgNum(res.body.data);
    });
  },
  sockets: {
    connect: function() {
      if (this.user) {
        this.$socket.emit("who", this.user.id);
      } else {
        this.$http.get("api/user/whoami").then(res => {
          this.saveUser(res.body.data);
          this.$socket.emit("who", res.body.data.id);
        });
      }
    }
  }
};
</script>