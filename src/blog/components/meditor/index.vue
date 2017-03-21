<template>
  <textarea id="editor">
  </textarea>
</template>
<script>
import './js/mditor.js'
export default {
  props: {
    // ["bold", "italic", "underline", "strikethrough", "header", "quote", "code", "list-ol", "list-ul", "link", "table", "line", "image", "help", "toggleFullScreen", "togglePreview", "toggleSplit"]
    removeItems: {
      type: Array,
      default: function () {
        return ['help', 'toggleSplit', 'togglePreview']
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
    }, 350)
  }
}
</script>
<style lang="less" scoped>
@import './css/mditor.css';
</style>