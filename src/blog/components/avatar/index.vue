<template>
  <div class="portrait">
    <img v-if="!avatar" src="../../../assets/images/blog/widget_dface.png" />
    <img v-if="avatar" :src="'api/file/find/'+avatar" />
  </div>
</template>
<script>
  export default {
    props: {
      avatar: {
        type: String,
        default: null
      }
    },
    methods:{
      
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