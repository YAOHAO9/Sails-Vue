<template>
  <div @click="showUser()">
    <avatar :avatar="user.avatar || getUser()"></avatar>
  </div>
</template>
<script>
  import Avatar from '../avatar'

  export default {
    props: {
      avatar: {
        type: String,
        default: null
      },
      user: {
        type: Object
      }
    },
    methods: {
      getUser: function () {
        var ctx = this
        ctx.$http.get('api/user/get')
          .then(res => {
            ctx.saveUser(res.body)
          })
      },
      showUser: function () {
        alert(JSON.stringify(this.user))
      }
    },
    vuex: {
      getters: {
        user: function (state) {
          return state.user
        }
      },
      actions: {
        saveUser: function (store, val) {
          store.dispatch('SAVEUSER', val);
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