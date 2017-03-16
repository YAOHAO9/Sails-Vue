<template>
  <div class="portrait">
    <img v-if="!avator" src="../../../assets/images/blog/widget_dface.png" />
    <img v-if="avator" :src="'api/file/find/'+avator" />
  </div>
</template>
<script>
  export default {
    props: {
      avator: {
        type: String,
        default: null
      }
    }
  }
</script>
<style scoped>
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px;
    overflow: hidden;
  }
</style>