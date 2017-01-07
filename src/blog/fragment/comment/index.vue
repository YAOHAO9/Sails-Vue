<template>
  <div>
    <form>
      <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
    </form>
    <div>
      <div class="item hiv">
        <div class="portraitParent">
          <div class="portrait"><img src="../../../assets/images/blog/widget_dface.png" /></div>
        </div>
        <div>
          <div class="commentInfo ">
            <span class="name">item.user.name</span>
            <span class="date"> new Date(item.createdAt) | date</span>
            <span class="date"> new Date(item.createdAt) | date</span>
            <span class="date"> new Date(item.createdAt) | date</span>
            <span class="date"> new Date(item.createdAt) | date</span>
          </div>
          <div class="commentContent"></div>
        </div>
      </div>
      <div class="item hiv">
        <div class="portraitParent">
          <div class="portrait"><img src="../../../assets/images/blog/widget_dface.png" /></div>
        </div>
        <div>
          <div class="commentInfo ">
            <span class="name">item.user.name</span>
            <span class="date"> new Date(item.createdAt) | date</span>
          </div>
          <div class="commentContent"></div>
        </div>
      </div>
    </div>
    <div class="submit" @click="!submiting && submit()" :class="{'disabled':submiting}">
      确认
    </div>
  </div>

</template>
<script>

  import ImageGrid from '../../components/image-grid'
  import Lrz from 'lrz'

  export default {
    data() {
      return {
        rows: (function () {
          var rows = []
          var nameIndex = 0;
          for (var i = 0; i < 3; i++) {
            var row = []
            for (var j = 0; j < 3; j++) {
              (function (name) {
                row.push({ display: 'none', name: name, click: function () { $('input[name=' + name + ']').click() } })
              })("image" + nameIndex++)
            }
            rows.push(row)
          }
          rows[0][0].display = 'block'
          return rows
        })(),
        content: "",
        submiting: false,
        loadImging: false
      }
    },
    props: {
      submitCb: {
        type: Function
      }
    },
    ready: function () {
      var ctx = this;
      for (var i = 0; i < 3; i++) {
        var row = this.rows[i]
        for (var j = 0; j < 3; j++) {
          (function (column) {
            $('input[name=' + column.name + ']')[0].addEventListener('change', function () {
              ctx.loadImging = true
              lrz(this.files[0], { width: 1000 })
                .then(function (rst) {
                  // 处理成功会执行
                  // document.getElementById('HeadIcon').src= rst.base64;
                  // formData.append('ImgUrlImage',rst.file);
                  column.compressPicture = rst
                  var img = $('img[name=' + column.name + ']')[0]
                  img.src = column.compressPicture.base64;
                  ctx.refresh()
                })
                .catch(function (err) {
                  // 处理失败会执行
                  alert("处理失败");
                })
                .always(function () {
                  // 不管是成功失败，都会执行
                  ctx.loadImging = false
                });
            });
          })(row[j])
        }
      }
    },
    components: {
      ImageGrid,
      Lrz
    },
    methods: {
      isLoadImging: function () {
        if (this.loadImging) {
          alert('请稍等，正在加载上一张图片...')
          return false
        }
        return true
      },
      submit: function () {
        this.submiting = true
        var formData = new FormData()
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
        compressPictures.forEach(function (compressPicture) {
          formData.append("images", compressPicture.file)
        })
        formData.append("content", this.content)
        if ((!this.content || this.content == '') && compressPictures.length == 0) {
          alert('留下点什么吧')
          return
        }
        this.$http.post('api/moment/create', formData)
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
  .portraitParent{
    width: 46px;
  }
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px;
    overflow: hidden;
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