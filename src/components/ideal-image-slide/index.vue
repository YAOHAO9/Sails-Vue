<template>
  <div id="slider">
    <img :src="url" v-for="url in urls" @load="urls.length <= 1 && imgLoad()">
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
        default: function () {
          return [Short, Long]
        }
      }
    },
    ready() {
      new IdealImageSlider.Slider('#slider');
    },
    methods: {
      imgLoad: function () {
        var slider = document.getElementById("slider")
        slider.style.height = slider.children[0].offsetHeight + 'px'
      }
    }
  }
</script>
<style>
@import "./ideal-image-slider.css";
@import "./default.css"
</style>