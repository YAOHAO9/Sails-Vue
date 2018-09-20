<template>
  <div class="page">
    <page-header>
      <header-link :left="true" @click="goHome()">返回</header-link>
      <header-title>同步</header-title>
    </page-header>
    <content>
      <column :height="'100%'" :justify-content="'center'">
        <div class="tip-text">
          您好{{user.name}}，请选择您要进行的操作。
        </div>
        <wrapper :padding="'30px'">
          <button type="light" @click="!submiting && phoneToPc()" :class="{'disabled':submiting}">同步账号{{user.name}}到二维码</button>
        </wrapper>
        <wrapper :padding="'0 30px'">
          <button type="light" @click="!submiting && pcToPhone()">使用二维码账号{{qrcodeUser.name}}登录</button>
        </wrapper>
      </column>
    </content>
  </div>
</template>
<script>
import { Button } from "../../components/buttons";
import { Header, HeaderLink, HeaderTitle } from "../../components/header";
import Content from "../../components/content";

export default {
  data() {
    return { submiting: false, qrcodeUser: {} };
  },
  ready() {
    this.$http
      .get(`api/user/encryptedUser?encrypted=${this.$route.query.encrypted}`)
      .then(res => {
        this.qrcodeUser = res.body.data;
      });
  },
  methods: {
    goHome() {
      this.$router.go({ path: "/" });
    },
    phoneToPc() {
      this.submiting = true;
      this.$http
        .get(`api/user/synchronizeToPc?socketId=${this.$route.query.socketId}`)
        .then(() => {
          this.submiting = false;
          this.goHome();
        });
    },
    pcToPhone() {
      location.href = `/api/user/redirect?encrypted=${
        this.$route.query.encrypted
      }&redirect=${location.origin}`;
    }
  },
  components: {
    "page-header": Header,
    HeaderLink,
    HeaderTitle,
    Content,
    Button
  }
};
</script>
<style lang="less" scoped>
.tip-text {
  padding: 0 30px 30px;
  text-align: center;
}
</style>

