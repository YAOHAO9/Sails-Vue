<template>
  <div>
    <router-view transition="slide"></router-view>
  </div>
</template>
<script>
  import store from './vuex/store'
  export default {
    store
  }
</script>