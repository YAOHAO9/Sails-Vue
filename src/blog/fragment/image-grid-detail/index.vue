<template>
  <div>
    <div>
      <ideal-image-slide :urls="getImageUrls()"></ideal-image-slide>
    </div>
    <back-btn class="backBtn" @click="close()"></back-btn>
  </div>
</template>
<script>
import IdealImageSlide from "../../../components/ideal-image-slide";
import BackBtn from "../../components/back-btn";

export default {
  data() {
    return {
      urls: []
    };
  },
  props: ["item", "close"],
  ready: function() {},
  components: {
    IdealImageSlide,
    BackBtn
  },
  methods: {
    getImageUrls: function() {
      this.urls = _.map(this.item.images, function(image) {
        return "/api/archive/" + image;
      });
      return this.urls;
    }
  }
};
</script>
<style>
.backBtn {
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>