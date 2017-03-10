<template>
  <div class="preloader-modal" v-show="show" transition="preloader-modal">
    <span class="preloader preloader-white"></span>
  </div>
  
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    }
  }
}
</script>

<style lang="less">

.preloader-modal {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.2);
  z-index: 2000;
  transition: opacity .3s;
  
  &.preloader-modal-transition {
    opacity: 1;
  }

  &.preloader-modal-enter,
  &.preloader-modal-leave {
    opacity: 0;
  }

  .preloader {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      margin-top: -14px;
      margin-left: -14px;
      width: 28px;
      height: 28px;
  }
}

</style>
