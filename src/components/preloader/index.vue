<template>
  <overlay :show.sync="show" :transparent="true"></overlay>
  <div class="preloader-modal" v-if="show" transition="preloader-modal">
    <span class="preloader preloader-white"></span>
    <toast :show="show" :text="'2134124'"></toast>
  </div>
  
</template>

<script>
import Overlay from '../overlay'
import Toast from './toast'

export default {
  components: {
    Overlay,
    Toast
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      twoWay: true,
      required: true
    }
  }
}
</script>

<style lang="less">
@import 'preloader.less';
</style>
