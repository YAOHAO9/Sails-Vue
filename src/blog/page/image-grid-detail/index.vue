<template>
  <div>
    <ideal-image-slide :urls="getImageUrls()"></ideal-image-slide>
  </div>
</template>
<script>
import IdealImageSlide from "../../../components/ideal-image-slide";

export default {
  data() {
    return {
      urls: []
    };
  },
  props: {},
  ready: function() {},
  components: {
    IdealImageSlide
  },
  methods: {
    getImageUrls: function() {
      if (this.$route.query.item) {
        var item = JSON.parse(this.$route.query.item);
      } else {
        return;
      }
      this.urls = _.map(item.images, function(image) {
        return "/api/archive/" + image;
      });
      return this.urls;
    }
  }
};
</script>
<style scoped>
.image-grid-parent {
  width: 55%;
  margin: 10px 20px;
}
</style>