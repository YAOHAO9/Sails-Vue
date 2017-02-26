<template>
  <div @click="goPersonalCenter()">
    <avatar :avatar="user && user.avatar "></avatar>
  </div>
</template>
<script>
  import Avatar from '../avatar'

  export default {
    methods: {
      goPersonalCenter: function () {
        this.$router.go({ path: 'personal-center' })
      }
    },
    vuex: {
      getters: {
        user: function (state) {
          return state.user
        }
      }
    },
    components: {
      Avatar
    }
  }
</script>
<style scoped>
 
</style>