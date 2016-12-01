<template>
  <hiv v-for="row in rows" :width="width" class="image-grid">
    <div v-for="column in row">
      <div v-square="{padding:'2%'}">
        <div><img src="../../../assets/images/blog/long.jpg" @click="column.click && column.click()"/></div>
      </div>
    </div>
  </hiv>
</template>
<script>
import Hiv from '../../../components/hiv'

export default {
  data (){
    return {
      column:1,
      rows:[]
    }
  },
  props: {
    urls: {
      type: Array,
      default: function(){
        return ["haha",2,3,4,5,6,7,8,9,10]
      }
    }
  },
  components:{
    Hiv
  },
  ready: function () {
    var column=1,rows=[];
    if(this.urls.length >9){
      column = 4
    }else if(this.urls.length > 4){
      column = 3
    }else if(this.urls.length > 1){
      column = 2
    }else if(this.urls.length == 1){
      column = 1
    }else{
      throw new Error('Urls is requird')
    }
    var rows
    for(var i=0 ;i <= (this.urls.length-1) / column ; i++ ){
      var row=[]
      for(var j = i * column; j < (i + 1) * column && j < this.urls.length ; j++ ){
        row.push(this.urls[j])
      }
      rows.push(row)
    }
    this.column = column
    this.rows = rows
  },
  computed: {
    width: function () {
      return 100 / this.column + '%'
    }
  }
}
</script>