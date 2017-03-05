<template>
  <div class="hav-component">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    left: {
      type: String,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    right: {
      type: String,
      default: false
    },
    top: {
      type: String,
      default: false
    },
    bottom: {
      type: String,
      default: false
    },
    height: {
      type: String,
      default: false
    },
    margin: {
      type: String,
      default: false
    }
  },
  ready: function () {
    if (this.margin) {
      let arr = this.margin.split(' ')
      this.top = arr[0]
      this.right = arr[1]
      this.bottom = arr[2] ? arr[2] : this.top
      this.left = arr[3] ? arr[3] : this.right
    }
    this.$el.style.height = this.height ? this.height : 'auto'
    this.top ? (this.$el.style['margin-top'] = this.top) : 0
    this.bottom ? (this.$el.style['margin-bottom'] = this.bottom) : 0
    this.$el.children[0].style.position = 'absolute'
    this.$el.children[2].style.position = 'absolute'
    this.$el.children[0].style.width = (this.left ? this.left : 0)
    this.$el.children[1].style.margin = '0 ' + (this.right ? this.right : 0) + ' 0 ' + (this.left ? this.left : 0)
    this.$el.children[2].style.width = (this.right ? this.right : 0)
    this.$el.children[0].style.left = 0
    this.$el.children[2].style.top = 0
    this.$el.children[2].style.right = 0
    // for (var i = 0; i < this.$el.childElementCount; i++) {
    //   this.$el.style.height = (this.$el.offsetHeight > this.$el.children[i].offsetHeight ? this.$el.offsetHeight : this.$el.children[i].offsetHeight) + 'px'
    // }
    // if (this.center) {
    //   for (var j = 0; j < this.$el.childElementCount; j++) {
    //     if (this.$el.children[j].offsetHeight) {
    //       this.$el.children[j].style.top = (this.$el.offsetHeight - this.$el.children[j].offsetHeight) / 2 + 'px'
    //     }
    //   }
    // }
  }
}
</script>

<style scoped>
  .hav-component {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
</style>