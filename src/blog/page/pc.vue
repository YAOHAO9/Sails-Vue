<template>
  <div>
    <row>
      <wrapper :padding="'20px 100px'" class="wrapper">
        <div class="bg-parent">
          <div class="bg">
            <div class="inner">
              <wap></wap>
            </div>
          </div>
        </div>
      </wrapper>
      <column :padding="'0 100px 0 0'" class="font">
        <div class="description" v-if="!isPrintFinish">
          {{description}}
        </div>
        <div class="description" v-else>
          {{preDescription + user.name + postDescription}}
        </div>
        <row>
          <img style="width:160px" :src="qrcode" />
          <column :padding="'30px'">
            <div>手机扫码体验</div>
            <wrapper :width="'100px'" :padding="'20px 0 0'">
              <button type="light" @click="!submiting && reset()" :class="{'disabled':submiting}">重置账号</button>
            </wrapper>
          </column>
          <img style="width:160px" :src="apkDownloadQrcode" />
          <column :padding="'30px'">
            <div>ReactNative</div>
            <wrapper :padding="'20px 0 0'">
              <div>Android版本下载</div>
            </wrapper>
          </column>
        </row>
      </column>
    </row>
    <div class="copyright">
      ©2014-2018 YAOHAO 版权所有 闽ICP备 15000277号-1
    </div>
  </div>
</template>
<script>
import { Button } from "../../components/buttons";
import store from "../../vuex/store";
import Toast from "../../blog/components/toast";
import PreLoader from "../../blog/components/preloader";
import Wap from "./wap";
import Vue from "vue";
export default {
  data: () => {
    return {
      qrcode: "",
      apkDownloadQrcode: "",
      preDescription: `欢迎来到YAOHAO的个人网站，在这里您暂时叫"`,
      postDescription: `”，您可以点击头像，进入个人信息编辑界面，编辑您的头像和姓名。在这里您可以分享你的所见所闻，也可以直接跟我小主一对一聊天。我也会第一时间通知小主， 有时可能不会那么及时，希望您能耐心等待，或者休息一会，再来逛逛。`,
      description: "",
      isPrintFinish: false,
      submiting: false
    };
  },
  components: { Wap, Button },
  ready() {
    this.$http.get(`/api/user/qrcode?origin=${location.origin}`).then(res => {
      this.qrcode = res.body.data;
    });
    this.$http
      .get(
        `/api/archive/customQrcode?origin=${
          location.origin
        }&url=${"/mobileblog.apk"}`
      )
      .then(res => {
        this.apkDownloadQrcode = res.body.data;
      });
    this.$http.get("/api/user/whoami").then(res => {
      this.saveUser(res.body.data);
      const user = res.body.data;
      const description = `${this.preDescription}${user.name}${
        this.postDescription
      }`;
      description.split("").forEach((c, i) => {
        setTimeout(() => {
          this.description = description.slice(0, i + 1);
          if (this.description === description) {
            this.isPrintFinish = true;
          }
        }, i * 50);
      });
    });
  },
  methods: {
    reset() {
      location.href = "/api/user/reset";
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
    background-image: url("../../assets/images/phone_bg.png");
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

.font {
  font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
    "Hiragino Sans GB", "WenQuanYi Micro Hei", "Microsoft Yahei", sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
}
.copyright {
  font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, "PingFang SC",
    "Hiragino Sans GB", "WenQuanYi Micro Hei", "Microsoft Yahei", sans-serif;
  -webkit-font-smoothing: antialiased;
  margin: 20px;
  text-align: center;
  font-size: 13px;
  color: #888;
  line-height: 1.6;
}
</style>
