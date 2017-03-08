<template>
  <span :class="type" v-show="show" transition="fade">{{text}}</span>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'warning'
      },
      text: {
        required: true
      },
      delay: {
        type: Number,
        default: 2000
      }
    }
  }
</script>

<style scoped>
  span{
    position: fixed;
    bottom: 150px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: rgba(0, 0, 0, 0.4);
    height:20px;
    line-height: 20px;
    font-size: 14px;
    padding: 0 5px;
    border-radius: 5px;
    overflow: hidden;
  }
  .fade-transition{
    transition: opacity 0.5s  
  }
  .fade-enter, .fade-leave {
    opacity: 0
  }
</style>