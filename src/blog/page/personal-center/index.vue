<template>
  <div class="page">
    <page-header>
      <header-link :left="true" @click="goHome()">返回</header-link>
      <header-title>同步</header-title>
    </page-header>
    <content>
      <div class="avator">
        <img v-if="(user || getUser()) && !user.avator" name="avator" src="../../../assets/images/blog/widget_dface.png" />
        <img v-if="user && user.avator" name="avator" :src="'/api/archive/'+user.avator" />
        <input class="avatorInput" name="avator" type="file" multiple="multiple" accept="image/*" />
      </div>
      <div class="hiv">
        <span>name:</span> <input v-model="form.name" :value="user && user.name" placeholder="请输入你的名字" />
      </div>
      <hr />
      <!--<div class="hiv">
      <span>email:</span> <input v-model="user.email" placeholder="请输入你的邮箱地址" />
    </div>
    <hr/>-->
      <wrapper :padding="'30px'">
        <button type="light" @click="!submiting && submit()" :class="{'disabled':submiting}">确认</button>
      </wrapper>
    </content>
  </div>
</template>
<script>
import { Button } from "../../../components/buttons";
import { Header, HeaderLink, HeaderTitle } from "../../../components/header";
import Content from "../../../components/content";
import IdealImageSlide from "../../../components/ideal-image-slide";
import Lrz from "lrz";

export default {
  data() {
    return {
      form: {
        name: ""
      }
    };
  },
  ready: function() {
    var ctx = this;
    $("input[name=avator]")[0].addEventListener("change", function() {
      ctx.loadImging = true;
      lrz(this.files[0], { width: 1000 })
        .then(function(rst) {
          ctx.form.file = rst.file;
          var img = $("img[name=avator]")[0];
          img.src = rst.base64;
        })
        .catch(err => {
          this.showToast("处理失败");
        })
        .always(function() {
          ctx.loadImging = false;
        });
    });
  },
  components: {
    "page-header": Header,
    HeaderLink,
    HeaderTitle,
    Content,
    IdealImageSlide,
    Lrz,
    Button
  },
  methods: {
    goHome() {
      this.$router.go({ path: "/" });
    },
    selectHeder: function(name) {
      $("input[name=" + name + "]");
      $("input[name=" + name + "]").trigger("click");
    },
    getUser: function() {
      var ctx = this;
      ctx.$http.get("/api/user/whoami").then(res => {
        ctx.saveUser(res.body.data);
      });
    },
    showUser: function() {
      this.showToast(JSON.stringify(this.user));
    },
    submit: function() {
      var ctx = this;
      if (!ctx.form.name) this.showToast("请输入你的名字!");
      var formData = new FormData();
      formData.append("name", ctx.form.name);
      if (ctx.form.file) formData.append("avator", ctx.form.file);
      this.$http.post("/api/user/update/" + ctx.user.id, formData).then(res => {
        ctx.saveUser(res.body.data);
        this.showToast("保存成功！");
        history.go(-1);
      });
    }
  }
};
</script>
<style scoped>
.avator {
  width: 100px;
  height: 100px;
  margin: 70px auto;
  overflow: hidden;
  border-radius: 50px;
  position: relative;
}
.avatorInput {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
span {
  height: 35px;
  line-height: 35px;
  width: 5em;
  text-align: right;
}
input {
  width: 100%;
  height: 35px;
  background-color: #f2f2f2;
  text-indent: 1em;
}
</style>
