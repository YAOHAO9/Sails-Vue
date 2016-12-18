<template>
  <div>
    <form>
      <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
    </form>
    <div v-for="row in rows" class="image-grid">
      <div v-for="column in row">
        <input :name="column.name" hidden type="file" multiple="multiple" accept="image/*" />
      </div>
    </div>
    <div class="image-grid-parent">
      <hiv v-for="row in rows" class="image-grid">
        <div v-for="column in row">
          <div v-square="{padding:'2%'}">
            <div><img src="../../../assets/images/add.png" :style="'display:'+column.display" @click="column.click && column.click()"
                :name="column.name" /></div>
          </div>
        </div>
      </hiv>
    </div>
    <div class="submit btn" @click="submit()">
      确认
    </div>
  </div>

</template>
<script>

import ImageGrid from '../../components/image-grid'
import Hiv from '../../../components/hiv'
import Lrz from 'lrz'

export default {
  data (){
    return {
      rows: (function () {
         var rows=[]
         var nameIndex=0;
         for(var i=0;i<3;i++){
           var row=[]
           for(var j=0;j<3;j++){
             (function(name){
                row.push({display:'none',name:name,click:function(){$('input[name='+name+']').click()}})
             })("image" + nameIndex++)
           }
           rows.push(row)
         }
         rows[0][0].display='block'
         return rows
      })(),
     content:"这一刻的想法..."
    }
  },
  ready:function(){
    var ctx=this;
    for(var i=0;i<3;i++){
      var row=this.rows[i]
      for(var j=0;j<3;j++){
        (function(column){
          $('input[name='+column.name+']')[0].addEventListener('change', function () {
            lrz(this.files[0],{width:400})
                .then(function (rst) {
                    // 处理成功会执行
                    // document.getElementById('HeadIcon').src= rst.base64;
                    // formData.append('ImgUrlImage',rst.file);
                    column.compressPicture=rst
                    var img=$('img[name='+column.name+']')[0]
                    img.src=  column.compressPicture.base64;
                    ctx.refresh()
                })
                .catch(function (err) {
                    // 处理失败会执行
                  alert("处理失败");
                })
                .always(function () {
                    // 不管是成功失败，都会执行
                });
          });
        })(row[j])
      }
    }
  },
  components:{
    ImageGrid,
    Hiv,
    Lrz
  },
  methods: {
    submit:function(){
      var formData = new FormData()
      var compressPictures=[]
      this.rows.forEach(function(row){
        row.forEach(function(column){
          if(column.compressPicture){
            compressPictures.push(column.compressPicture)
            column.compressPicture=false
            column.display = 'node'
          }
        })
      })
      compressPictures.forEach(function(compressPicture){
        formData.append("images",compressPicture.file)
      })
      formData.append("content",this.content)
      this.$http.post('api/moment/create', formData)
				.then((response) => {
					console.log(response)
				})
    },
    refresh:function(){
    var compressPictures=[]
     this.rows.forEach(function(row){
       row.forEach(function(column){
         if(column.compressPicture){
           compressPictures.push(column.compressPicture)
           column.compressPicture=false
           column.display = 'node'
         }
       })
     })
     var index=0;
     this.rows.forEach(function(row){
       row.forEach(function(column){
         if(index < compressPictures.length){
           column.compressPicture = compressPictures[index++]
           var img=$('img[name='+column.name+']')[0]
           img.src=  column.compressPicture.base64;
           column.display = 'block'
         }else if (index++ == compressPictures.length) {
           column.display = 'block'
         }
       })
     })
    }
  }
}
</script>
<style>
  body {
    overflow: auto
  }
  
  textarea {
    margin-top: 40px;
    max-width: 100%;
    min-width: 100%;
    padding: 0 5px;
    text-indent: 2em;
    height: 100px;
  }
  
  .image-grid-parent {
    width: 55%;
    margin: 10px 20px;
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