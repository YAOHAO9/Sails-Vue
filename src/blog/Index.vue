<template>
  <div class="page">
    <page-footer>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'moment' }" v-on:click="changeView('moment')">
        <i class="fa  fa-star-o"></i>
        <label>Moment</label>
      </footer-item>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'blog' }" v-on:click="changeView('blog')">
        <i class="fa fa-sticky-note-o"></i>
        <label>Blog</label>
      </footer-item>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'at' }" v-on:click="changeView('at')">
        <i class="fa fa-at"></i>
        <span class="badge" v-show="unreadMsgNum">{{unreadMsgNum}}</span>
        <label>Chat</label>
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
    }
  }
</script>

<style lang="less" scoped>
  i {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
    /*background-color: #8E8E93;*/
  }
  
  i::before {
    zoom: 0.8;
    font-size: 30px;
  }
  label{
    font-size:13px;
    line-height:13px;
  }
</style>