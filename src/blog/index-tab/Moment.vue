<template>
  <simple-header title="Moment"></simple-header>
  <content>
    <div >
      <!--Item header-->
      <hav margin='3px 40px 3px 46px' center>
        <div>
          <div class="portrait"><img src="../../assets/images/blog/widget_dface.png" /></div>
        </div>
        <div class="title-parent">
          <div class="title">匿名者</div>
          <div class="date">{{ new Date() | date}}</div>
        </div>
        <div class="edit">
          <i class="fa fa-chevron-down"></i>
        </div>
      </hav>
      <hr>
      <div class="text">
        今天在Apple Store 感受了一下 TouchBar，感受一般。 1.不同类型的应用 TouchBar 有用程度良莠不齐。 2.依赖 Apple 官方应用软件支持，然而我基本一个内置应用都不用。 不过想想，如果可以只定义按钮映射到常用快捷键组合，倒是可以一用。
      </div>
      <div class="blog-content" >
        <image-grid ></image-grid>
      </div>
      <hr>
      <hev center class="item">
        <div>
          <i class="fa  fa-thumbs-down"></i>
        </div>
        <div>
          <i class="fa  fa-star-o"></i>
        </div>
        <div>
          <i class="fa  fa-thumbs-up"></i>
        </div>
      </hev>
      <hr>
    </div>
    <add-btn></add-btn>
  </content>

</template>

<script>
import { SimpleHeader } from '../../components/header'
import Content from '../../components/content'
import Hav from '../../components/hav'
import Hev from '../../components/hev'
import ImageGrid from '../components/image-grid'
import AddBtn from '../components/add-btn'

export default {
  data () {
    return {
      a: 1111111111111
    }
  },
  components: {
    SimpleHeader,
    Content,
    Hav,
    Hev,
    ImageGrid,
    AddBtn
  }
}
</script>
<style lang="less" scoped>
  .portrait {
    border-radius: 18px;
    background-color: gray;
    height: 36px;
    width: 36px;
    margin: 0 5px 0 5px;
    overflow: hidden;
  }
  
  img {
    width: 100%;
  }
  
  .blog-content {
    width: 70%;
    margin: 0 auto;
    background: deepskyblue;
  }
  
  .title {
    font-weight: 900;
    font-size: 15px;
    color: #333333
  }
  
  .date {
    font-size: 10px;
    color: #888888
  }
  
  .text {
    text-indent: 2em;
    font-size: 13px;
    color: #333333;
  }
  
  i {
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 33px;
    border-radius: 5px;
    color: #929292;
  }
</style>