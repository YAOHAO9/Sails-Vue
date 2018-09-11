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
        return "api/archive/" + image;
      });
      return this.urls;
    }
  }
};
</script>
<style scoped>
body {
  overflow: auto;
}

textarea {
  margin-top: 15px;
  max-width: 100%;
  min-width: 100%;
  padding: 0 15px;
  height: 100px;
}

.image-grid-parent {
  width: 55%;
  margin: 10px 20px;
}

.submit {
  line-height: 40px;
  text-align: center;
  width: 40%;
  margin: 20px auto;
  height: 40px;
  border-radius: 7px;
  color: #3690ff;
  border: 2px solid #3690ff;
}
</style>