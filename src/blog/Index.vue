<template>
  <div class="page">
    <page-footer>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'moment' }" v-on:click="changeView('moment')">
        <i class="fa  fa-star-o"></i>
        <!--<label>说说</label>-->
      </footer-item>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'blog' }" v-on:click="changeView('blog')">
        <i class="fa fa-sticky-note-o"></i>
        <!--<label>日志</label>-->
      </footer-item>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'at' }" v-on:click="changeView('at')">
        <i class="fa fa-at"></i>
        <!--<label>工作</label>-->
      </footer-item>
    </page-footer>
    <component :is="currentView" keep-alive></component>
  </div>
</template>

<script>
  import { Footer, Item } from '../components/footer'
  import Moment from './index-tab/Moment'
  import Blog from './index-tab/Blog'
  import Note from './index-tab/Note'
  import At from './index-tab/At'

  export default {
    components: {
      'page-footer': Footer,
      'footer-item': Item,
      Blog,
      Moment,
      Note,
      At
    },
    data() {
      return {
      }
    },
    methods: {
      changeView(view) {
        this.saveCurrentView(view)
      }
    },
    vuex: {
      getters: {
        currentView: function (state) {
          return state.indexView
        }
      },
      actions: {
        saveCurrentView: function (store, val) {
          store.dispatch('SAVECURRENTVIEW', val);
        }
      }
    },
    created: function () {
      //在实例创建之后同步调用。此时实例已经结束解析选项，这意味着已建立：数据绑定，计算属性，方法，watcher/事件回调。
      //但是还没有开始 DOM 编译，$el 还不存在,但是实例存在,即this.a存在,可打印出来 。
      console.log("建立");
    },
    beforeCompile: function () {
      console.log("未开始编译");
    },
    compiled: function () {
      //在编译结束后调用。此时所有的指令已生效，因而数据的变化将触发 DOM 更新。但是不担保 $el 已插入文档。
      console.log("编译完成");
    },
    attached: function () {  //myVue.$appendTo(".test2")暂时触发不了,不知道怎么解决
      //在 vm.$el 插入 DOM 时调用。必须是由指令或实例方法（如 $appendTo()）插入，直接操作 vm.$el 不会 触发这个钩子。
      console.log("插入DOM成功");
    },
    detached: function () { //触发事件 myVue.$destroy(true),其中参数true控制是否删除DOM节点或者myVue.$remove()
      //在 vm.$el 从 DOM 中删除时调用。必须是由指令或实例方法删除，直接操作 vm.$el 不会 触发这个钩子。
      console.log("删除DOM成功");
    },
    beforeDestroy: function () {  //触发方式,在console里面打myVue.$destroy();
      //在开始销毁实例时调用。此时实例仍然有功能。
      console.log("销毁前");
    },
    destroyed: function () {   //触发方式,在console里面打myVue.$destroy();其中myVue.$destroy(true)是删除DOM节点,会触发detached函数,但是实例仍然存在
      //在实例被销毁之后调用。此时所有的绑定和实例的指令已经解绑，注意是解绑不是销毁,所有的子实例也已经被销毁。
      console.log("已销毁");
    }
  }
</script>

<style lang="less" scoped>
  i {
    width: 33px;
    height: 33px;
    text-align: center;
    line-height: 33px;
    border-radius: 5px;
    /*background-color: #8E8E93;*/
  }
  
  i::before {
    zoom: 0.8;
    font-size: 30px;
  }
</style>