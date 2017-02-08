<template>
  <simple-header title="At"></simple-header>
  <content>
    <tab>
      <tab-item title="WeChat">
        <message></message>
      </tab-item>
      <tab-item title="YAOHAO">
        <h1 class="demos-title">Girls</h1>
      </tab-item>
    </tab>
    <div class="inputParent hiv">
      <input/>
      <div class="btn">发送</div>
    </div>
  </content>
</template>

<script>
  import { SimpleHeader } from '../../components/header'
  import Content from '../../components/content'
  import { Tab, TabItem } from '../../components/tab'
  import Message from '../components/message'

  export default {
    components: {
      SimpleHeader,
      Content,
      Tab,
      TabItem,
      Message
    }
  }

</script>
<style lang="less" scoped>
  .inputParent {
    height: 40px;
    position: absolute;
    bottom: 0;
    width: 100%;

    input {
      width: 100%;
      margin: 3px;
      border-radius: 5px;
      padding-left: 8px;
    }
    
    .btn {
      width: 100px;
      margin: 3px;
      border-radius: 5px;
      line-height: 36px;
      text-align: center;
      background-color: #61CDE7;
      font-size: 15px;
    }
  }
</style>