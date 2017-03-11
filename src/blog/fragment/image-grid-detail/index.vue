<template>
  <div>
    <ideal-image-slide :urls="getImageUrls()"></ideal-image-slide>
  </div>
  <back-btn class="backBtn" @click="close()"></back-btn>
</template>
<script>

  import IdealImageSlide from '../../../components/ideal-image-slide'
  import BackBtn from '../../components/back-btn'

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
      IdealImageSlide,
      BackBtn
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
  .backBtn{
    margin-bottom: 20px;
    margin-right: 20px;
  }
</style>