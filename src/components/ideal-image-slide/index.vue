<template>
  <div class="sliderParent">
    <div id="slider">
      <img :src="url" v-for="url in urls" @load="urls.length <= 1 && imgLoad()">
    </div>
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
        if (slider.children[0].offsetHeight > document.body.offsetHeight) {
          slider.style.position = 'relative';
        } else {
          slider.style.position = 'absolute';
        }
      }
    }
  }
</script>
<style>
@import "./ideal-image-slider.css";
@import "./default.css";
.sliderParent{
  position: relative;
  height: 100vh;
}
#slider{
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>