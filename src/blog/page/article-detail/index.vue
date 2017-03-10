<template>
  <div>
    {{{article.content}}}
  </div>
</template>
<script>


  export default {
    data() {
      return {
        article: {}
      }
    },
    ready: function () {
      var ctx = this
      if (this.$route.query.id) {
        this.$http.get('/api/article/find/' + this.$route.query.id)
          .then(res => {
            ctx.article = res.body
          })
      }
    },
    components: {
    },
    methods: {

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