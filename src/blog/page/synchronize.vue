<template>
    <div class="page">
        <page-header>
            <header-link :left="true" @click="goHome()">返回</header-link>
            <header-title>同步</header-title>
        </page-header>
        <content>
            <div class="submit" @click="phoneToPc()" :class="{'disabled':submiting}">
                Pc -> Phone
            </div>
            <div class="submit" @click="pcToPhone()" :class="{'disabled':submiting}">
                Phone -> Pc
            </div>
        </content>
    </div>
</template>
<script>
import { Header, HeaderLink, HeaderTitle } from "../../components/header";
import Content from "../../components/content";

export default {
  data() {
    return { submiting: false };
  },
  methods: {
    goHome() {
      this.$router.go({ path: "/" });
    },
    phoneToPc() {
      this.$http
        .get(`api/user/synchronizeToPc?socketId=${this.$route.query.socketId}`)
        .then(() => {
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
    Content
  }
};
</script>
<style lang="less" scoped>
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

