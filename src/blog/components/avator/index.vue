<template>
  <div class="portrait">
    <img v-if="!avator" src="../../../assets/images/blog/widget_dface.png" />
    <div v-if="avator" class="avator" :style="getImgStyle('/api/archive/'+avator)"></div>
  </div>
</template>
<script>
export default {
  props: {
    avator: {
      type: String | Number,
      default: null
    }
  },
  methods: {
    getImgStyle(url) {
      return {
        backgroundSize: "cover",
        backgroundImage: `url('${url}')`,
        backgroundPosition: "center"
      };
    }
  }
};
</script>
<style  lang='less' scoped>
.portrait {
  border-radius: 18px;
  background-color: gray;
  height: 36px;
  width: 36px;
  margin: 0 5px;
  overflow: hidden;

  .avator {
    height: 36px;
    width: 36px;
  }
}
</style>