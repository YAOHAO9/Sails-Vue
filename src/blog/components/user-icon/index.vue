<template>
  <div @click="goPersonalCenter()">
    <avator :avator="user && user.avator "></avator>
  </div>
</template>
<script>
  import Avator from '../avator'

  export default {
    methods: {
      goPersonalCenter: function () {
        this.$router.go({ path: 'personal-center' })
      }
    },
    components: {
      Avator
    }
  }
</script>
<style scoped>
 
</style>