<template>
  <a id="BackBtn">
    <div>
      <i class="fa fa-reply"></i>
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
  #BackBtn {
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
  
  #BackBtn>div {
    width: 50px;
    padding: 5px;
    border-radius: 25px;
    height: 50px;
    background: #61CDE7;
  }
  
  #BackBtn>div>i {
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 22px;
    color: white;
  }
</style>