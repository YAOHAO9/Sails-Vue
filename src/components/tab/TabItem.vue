<template>
  <div class="tab" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    index:{
      type:Number
    },
    onShow: {
      type: Function,
      required: false
    }
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    this.show = this.$parent.active === this.index
    this.$parent.items.push({
      title: this.title
    })
  },
  events: {
    'change': function (active) {
      this.show = this.$parent.active === this.index
      this.$parent.items[this.index].title=this.title
    }
  },
  watch: {
    show (v, ov) {
      if (v === true && this.onShow) {
        this.onShow.call()
      }
    },
    title(v,ov){
      this.$parent.items[this.index].title=this.title
    }
  },
  beforeDestroy () {
    this.$parent.items.splice(this.index, 1)
  }
}
</script>
