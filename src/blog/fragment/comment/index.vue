<template>
  <div>
    <form>
      <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
    </form>
    <div>
      <div class="item hiv" v-for="row in rows">
        <div class="portraitParent">
          <div class="portrait"><img src="../../../assets/images/blog/widget_dface.png" /></div>
        </div>
        <div class="comment">
          <div class="info">
            <span class="name">周星驰</span><span class="date">2017-01-02 01:18</span>
          </div>
          <div class="content">
            暴打的视频
          </div>
        </div>
      </div>
      <div class="item hiv">
        <div class="portraitParent">
          <div class="portrait"><img src="../../../assets/images/blog/widget_dface.png" /></div>
        </div>
        <div class="comment">
          <div class="info">
            <span class="name">李湘</span><span class="date">2017-01-02 01:18</span>
          </div>
          <div class="content">
            暴打的视频
          </div>
        </div>
      </div>
    </div>
    <div class="submit" @click="!submiting && submit()" :class="{'disabled':submiting}">
      确认
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        rows: (function () {
          var rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
          return rows
        })(),
        content: "",
        submiting: false
      }
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },
      submitCb: {
        type: Function
      }
    },
    ready: function () {
      var ctx = this;
    },
    components: {
    },
    methods: {
      submit: function () {
        this.submiting = true
        var formData = new FormData()
        formData.append("content", this.content)
        if ((!this.content || this.content == '')) {
          alert('留下点什么吧')
          this.submiting = false
          return
        }
        this.$http.post('api/comment/create/' + this.item.id, formData)
          .then((response) => {
            this.submitCb && this.submitCb()
            this.submiting = false
          })
      },
      refresh: function () {
        var compressPictures = []
        this.rows.forEach(function (row) {
          row.forEach(function (column) {
            if (column.compressPicture) {
              compressPictures.push(column.compressPicture)
              column.compressPicture = false
              column.display = 'node'
            }
          })
        })
        var index = 0;
        this.rows.forEach(function (row) {
          row.forEach(function (column) {
            if (index < compressPictures.length) {
              column.compressPicture = compressPictures[index++]
              var img = $('img[name=' + column.name + ']')[0]
              img.src = column.compressPicture.base64;
              column.display = 'block'
            } else if (index++ == compressPictures.length) {
              column.display = 'block'
            }
          })
        })
      }
    }
  }
</script>
<style scoped>
  body {
    overflow: auto
  }
  textarea {
    margin-top: 10px;
    max-width: 100%;
    min-width: 100%;
    padding: 0 5px;
    text-indent: 2em;
    height: 80px;
  }
  .item{
    margin: 10px 0px
  }
  .portraitParent{
    width: 56px;
  }
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px;
    overflow: hidden;
  }
  .comment{
    width: 100%;
  }
  .info{
    font-size: 12px;
    overflow: hidden;
  }
  .name{
    float: left;
    min-width: 5em;
  }
  .date{
    float: left;
    margin-left: 1em;
  }
  .content{
    font-size: 13px;
  }
  .submit {
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