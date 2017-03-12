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
    background-color: gray;
    max-height: 100px;
    line-height: 20px;
    font-size: 14px;
    padding: 0 5px;
    border-radius: 5px;
    overflow: hidden;
    color: white;
  }
  .warning{

  }
  .error{

  }
  
  .fade-transition{
    transition: all 0.4s;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
    transform: translate(-50%,100px);
  }
</style>