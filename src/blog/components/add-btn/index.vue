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
    border-radius: 22px;
    width: 44px;
    height: 44px;
    padding: 5px;
    z-index: 1;
  }
  
  #AddBtn>div {
    width: 34px;
    padding: 7px;
    border-radius: 17px;
    height: 34px;
    background: #61CDE7;
  }
  
  #AddBtn>div>div {
    width: 20px;
    height: 20px;
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