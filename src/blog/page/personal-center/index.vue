<template>
  <div>
    <div class="avator">
      <img v-if="(user || getUser()) && !user.avator" name="avator" src="../../../assets/images/blog/widget_dface.png" />
      <img v-if="user && user.avator" name="avator" :src="'api/archive/'+user.avator" />
      <input class="avatorInput" name="avator" type="file" multiple="multiple" accept="image/*" />
    </div>
    <div class="hiv">
      <span>name:</span> <input v-model="form.name" :value="user && user.name" placeholder="请输入你的名字" />
    </div>
    <hr/>
    <!--<div class="hiv">
      <span>email:</span> <input v-model="user.email" placeholder="请输入你的邮箱地址" />
    </div>
    <hr/>-->
    <div class="submit" @click="!submiting && submit()" :class="{'disabled':submiting}">
      确认
    </div>
  </div>
</template>
<script>
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
    IdealImageSlide,
    Lrz
  },
  methods: {
    selectHeder: function(name) {
      $("input[name=" + name + "]");
      $("input[name=" + name + "]").trigger("click");
    },
    getUser: function() {
      var ctx = this;
      ctx.$http.get("api/user/get").then(res => {
        ctx.saveUser(res.body);
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
      this.$http.post("api/user/update/" + ctx.user.id, formData).then(res => {
        ctx.saveUser(res.body);
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
.submit {
  line-height: 40px;
  text-align: center;
  width: 40%;
  margin: 100px auto;
  height: 40px;
  border-radius: 7px;
  color: #3690ff;
  border: 2px solid #3690ff;
}
</style>
