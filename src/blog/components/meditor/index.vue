<template>
  <textarea id="editor">
  </textarea>
</template>
<script>
import './js/mditor.js'
export default {
  props: {
    removeItems: {
      type: Array,
      default: function () {
        return ['help', 'toggleSplit']
      }
    }
  },
  ready: function () {
    setTimeout(() => {
      this.$nextTick(() => {
        var textarea = document.getElementById('editor');
        var mditor = Mditor.fromTextarea(textarea);
        mditor.on('ready', () => {
          this.removeItems.forEach((item) => {
            mditor.toolbar.removeItem(item)
          })
        })
      })
    }, 500)
  }
}
</script>
<style lang="less" scoped>
@import './css/mditor.css';
</style>