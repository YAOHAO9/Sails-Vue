<template>
  <div class="tab-container">
    <div class="hiv" :class="{
      'buttons-tab' : style === 'default',
      'buttons-group' : style === 'button' || style === 'button-bordered',
      'button-bordered' : style === 'button-bordered',
      'button-small': size === 'small',
      'button-large': size === 'large'
      }">
      <m-button 
         v-for="item in items" 
         :active="$index === active"
         v-on:click="onClick($index,item)"
         >{{item.title}}</m-button>
    </div>
    <div class="tabs">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Button } from '../buttons'

export default {
  props: {
    active: {
      type: Number,
      default: 0
    },
    style: {
      type: String,
      default: 'default' // default, button, button-bordered
    },
    size: {
      type: String,
      default: 'default'
    },
    changeItem:{
      type:Function,
      default:function(){}
    }
  },
  components: {
    'm-button': Button
  },
  data () {
    return {
      items: []
    }
  },
  events: {
    'changeItem': function (active) {
      this.active = active
      this.$children[active].show = true
      this.$broadcast('change', active)
      this.changeItem(active)
    }
  },
  methods: {
    onClick (active,item) {
      this.active = active
      this.$children[active].show = true
      this.$broadcast('change', active)
      this.changeItem(active)
    }
  }
}
</script>

<style lang="less">
@import 'tabs.less';
</style>
