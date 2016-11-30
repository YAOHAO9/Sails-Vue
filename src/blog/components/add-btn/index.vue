<template>
  <a id="AddLost" v-link="{ path: 'add-moment' }">
    <div>
      <div></div>
    </div>
  </a>
</template>
<script>
</script>
<style>
  #AddLost {
    position: fixed;
    bottom: 70px;
    right: 20px;
    background: #BBE9FF;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    padding: 5px;
    z-index: 1;
  }
  
  #AddLost>div {
    width: 50px;
    padding: 10px;
    border-radius: 25px;
    height: 50px;
    background: #61CDE7;
  }
  
  #AddLost>div>div {
    width: 30px;
    height: 30px;
    position: relative;
  }
  
  #AddLost>div>div::before {
    content: '';
    width: 100%;
    height: 4px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 0;
    margin: -2px 0 0 0;
  }
  
  #AddLost>div>div::after {
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