<template>
  <div>
    <ideal-image-slide :urls="getImageUrls()"></ideal-image-slide>
  </div>
  <div @click="close()" class="btn close">
    返回
  </div>
</template>
<script>

  import IdealImageSlide from '../../../components/ideal-image-slide'

  export default {
    data() {
      return {
        urls: []
      }
    },
    props: ['item', 'close'],
    ready: function () {
    },
    components: {
      IdealImageSlide
    },
    methods: {
      getImageUrls: function () {
        this.urls = this.item.images.map(function (image) {
          return 'api/file/find/' + image
        })
        return this.urls
      }
    }
  }
</script>
<style>
  .close {
    line-height: 40px;
    text-align: center;
    width: 40%;
    margin: 20px auto;
    height: 40px;
    border-radius: 7px;
    color: #3690FF;
    border: 2px solid #3690FF;
  }
</style>