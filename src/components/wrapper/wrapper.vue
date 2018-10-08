<template>
    <div>
        <slot>
        </slot>
    </div>
</template>
<script>
export default {
  name: "Wrapper",
  components: {},
  props: {
    height: String,
    width: String,
    margin: String,
    padding: String,
    border: String,
    flex: String
  },
  ready() {
    if (this.height) {
      this.$el.style.height = this.height;
    }
    if (this.width) {
      this.$el.style.width = this.width;
    }
    if (this.margin) {
      this.$el.style.margin = this.margin;
    }
    if (this.padding) {
      this.$el.style.padding = this.padding;
    }
    if (this.border) {
      this.$el.style.border = this.border;
    }
  }
};
</script>
