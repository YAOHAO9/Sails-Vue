<template>
  <div v-html="article.content">
  </div>
</template>
<script>
export default {
  data() {
    return {
      article: {}
    };
  },
  ready: function() {
    var ctx = this;
    if (this.$route.query.id) {
      this.$http.get("/api/article/find/" + this.$route.query.id).then(res => {
        ctx.article = res.body.data;
      });
    }
  },
  components: {},
  methods: {}
};
</script>
<style scoped>
.avator {
  width: 100px;
  height: 100px;
  margin: 70px auto;
  overflow: hidden;
  border-radius: 50px;
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