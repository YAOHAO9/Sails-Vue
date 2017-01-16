<template>
  <div>
    <div class="avatar" @click="selectHeder('avatar')">
      <img v-if="(user || getUser()) && !user.avatar" name="avatar" src="../../../assets/images/blog/widget_dface.png" />
      <img v-if="user && user.avatar" name="avatar" :src="'api/file/find/'+user.avatar" />
    </div>
    <input name="avatar" hidden type="file" multiple="multiple" accept="image/*" />
    <div class="hiv">
      <span>name:</span> <input v-model="form.name" :value="user && user.name" placeholder="请输入你的名字" />
    </div>
    <hr/>
    <!--<div class="hiv">
      <span>email:</span> <input v-model="user.email" placeholder="请输入你的邮箱地址" />
    </div>
    <hr/>-->
    <div class="submit" @click="!submiting && submit()" :class="{'disabled':submiting}">
      确认
    </div>
  </div>
</template>
<script>

  import IdealImageSlide from '../../../components/ideal-image-slide'
  import Lrz from 'lrz'

  export default {
    data() {
      return {
        form: {
          name: ''
        }
      }
    },
    ready: function () {
      var ctx = this
      $('input[name=avatar]')[0].addEventListener('change', function () {
        ctx.loadImging = true
        lrz(this.files[0], { width: 1000 })
          .then(function (rst) {
            ctx.form.file = rst.file;
            var img = $('img[name=avatar]')[0]
            img.src = rst.base64;
          })
          .catch(function (err) {
            alert("处理失败");
          })
          .always(function () {
            ctx.loadImging = false
          });
      });
    },
    components: {
      IdealImageSlide
    },
    methods: {
      selectHeder: function (name) {
        $('input[name=' + name + ']').click()
      },
      getUser: function () {
        var ctx = this
        ctx.$http.get('api/user/get')
          .then(res => {
            ctx.saveUser(res.body)
          })
      },
      showUser: function () {
        alert(JSON.stringify(this.user))
      },
      submit: function () {
        var ctx = this
        if (!ctx.form.name)
          alert('请输入你的名字!')
        var formData = new FormData()
        formData.append('name', ctx.form.name)
        if (ctx.form.file)
          formData.append("avatar", ctx.form.file)
        this.$http.post('api/user/update/' + ctx.user.id, formData)
          .then((res) => {
            ctx.saveUser(res.body)
            alert('保存成功！')
          })
      }
    },
    components: {
      Lrz
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
    }
  }
</script>
<style scoped>
 .avatar{
   width: 100px;
   height: 100px;
   margin: 70px auto;
   overflow: hidden;
   border-radius: 50px;
 }
 span{
   height: 35px;
   line-height: 35px;
   width: 5em;
   text-align: right;
 }
 input{
   width:100%;
   height: 35px;
   background-color: #F2F2F2;
   text-indent: 1em;
 }
 .submit {
    line-height: 40px;
    text-align: center;
    width: 40%;
    margin: 100px auto;
    height: 40px;
    border-radius: 7px;
    color: #3690FF;
    border: 2px solid #3690FF;
  }
</style>