<template>
  <a id="AddBtn" v-link="{ path:link}">
    <div>
      <div></div>
    </div>
  </a>
</template>
<script>
  export default {
    props: {
      link: {
        type: String,
      }
    }
  }
</script>
<style>
  #AddBtn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #BBE9FF;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    padding: 5px;
    z-index: 1;
  }
  
  #AddBtn>div {
    width: 50px;
    padding: 10px;
    border-radius: 25px;
    height: 50px;
    background: #61CDE7;
  }
  
  #AddBtn>div>div {
    width: 30px;
    height: 30px;
    position: relative;
  }
  
  #AddBtn>div>div::before {
    content: '';
    width: 100%;
    height: 4px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 0;
    margin: -2px 0 0 0;
  }
  
  #AddBtn>div>div::after {
    content: '';
    width: 4px;
    height: 100%;
    background-color: white;
    left: 50%;
    top: 0;
    position: absolute;
    margin: 0 0 0 -2px;
  }
</style>