<template>
    <div :class="{'component-row':true,'default-flex':isDefaultFlex}">
        <slot></slot>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isDefaultFlex: true
    };
  },
  props: {
    height: String,
    width: String,
    margin: String,
    padding: String,
    border: String,
    flex: {
      type: Number,
      default: 0
    },
    justifyContent: String,
    alignItems: String
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
    if (this.flex === -1) {
      this.isDefaultFlex = false;
    } else if (this.flex) {
      this.$el.style.flex = this.flex;
    }
    if (this.justifyContent) {
      this.$el.style.justifyContent = this.justifyContent;
    }
    if (this.alignItems) {
      this.$el.style.alignItems = this.alignItems;
    }
  }
};
</script>
<style lang="less" scoped>
.component-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  &.default-flex {
    flex: 1;
  }
}
</style>


