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