<template>
  <div id="slider">
    <img :src="url" v-for="url in urls">
  </div>
</template>

<script>
import IdealImageSlider from "./ideal-image-slider.js"
import Short from "../../assets/images/blog/short.png"
import Long from "../../assets/images/blog/long.jpg"
export default {
  props: {
    urls: {
      type: Array,
      default: function(){
        return [Short,Long]
      }
    }
  },
  ready () {
    new IdealImageSlider.Slider('#slider');
  }
}
</script>
<style>
@import "./ideal-image-slider.css";
@import "./default.css"
</style>