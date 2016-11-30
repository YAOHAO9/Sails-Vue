<template>
  <form>
    <textarea placeholder="这一刻的想法..."></textarea>
    <input v-for="name in rows" :name="name"/>
  </form>
</template>
<script>
export default {
  data (){
    return {
      column:9,
      rows:['image1','image2','image3','image4','image5','image6','image7','image8','image9']
    }
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
</style>