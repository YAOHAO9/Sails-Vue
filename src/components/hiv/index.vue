<template>
  <div class="hiv">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    center: {
      type: Boolean,
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
    },
    width:{
      type:String,
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
    this.$el.style['text-align'] = 'center'
    this.top ? (this.$el.style['margin-top'] = this.top) : 0
    this.left ? (this.$el.style['margin-left'] = this.left) : 0
    this.right ? (this.$el.style['margin-right'] = this.right) : 0
    this.bottom ? (this.$el.style['margin-bottom'] = this.bottom) : 0
    let childElementCount = this.$el.childElementCount
    for (var i = 0; i < this.$el.childElementCount; i++) {
      if(this.width){
        this.$el.children[i].style.width = this.width
      }else{
        this.$el.children[i].style.width = 100 / childElementCount + '%'
      }
    }
  }
}
</script>