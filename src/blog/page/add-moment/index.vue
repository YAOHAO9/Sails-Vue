<template>
  <div>
    <form>
      <textarea placeholder="这一刻的想法..." :value="form.text"></textarea>
      <input v-for="row in rows" :name="row.name"  hidden type="file" multiple="multiple" accept="image/*"/>
    </form>
    <div class="image-grid-parent">
      <image-grid :urls="rows"></image-grid>
    </div>

  </div>

</template>
<script>

import  ImageGrid  from '../../components/image-grid'

export default {
  data (){
    return {
      rows: (function () {
          var rows =[]
          for(var i=0;i< 9;i++){
            var name = "image"+i
            rows.push({
              name:name,
              click:function(name){
                return function(){ 
                  $('input[name='+name+']').click() 
                }
              }(name)
            })
          }
          return rows
      })(),
      form:{text:"这一刻的想法..."}
    }
  },
  components:{
    ImageGrid
  }
}
</script>
<style scoped>
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
</style>