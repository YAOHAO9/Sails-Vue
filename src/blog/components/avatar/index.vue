<template>
  <div class="portrait" @click="">
    <img v-if="!avatar" src="../../../assets/images/blog/widget_dface.png" />
    <img v-if="avatar" :src="'api/file/find/'+avatar" />
  </div>
</template>
<script>
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
      editUserInfo: function () {
        var ctx = this
        if (ctx.getUser()) {
          ctx.$http.get('api/user/get')
            .then(res => {
              ctx.saveUser(res.body)
            })
        } else {
          if
        }
      }
    },
    vuex: {
      getters: {
        getUser: function (state) {
          return state.user
        }
      },
      actions: {
        saveUser: function (store, val) {
          store.dispatch('SAVEUSER', val);
        }
      }
    }
  }
</script>
<style scoped>
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px;
    overflow: hidden;
  }
</style>