<template>
  <div class="page">
    <page-footer>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'moment' }" v-on:click="changeView('moment')">
        <i class="fa  fa-star-o"></i>
        <!--<label>说说</label>-->
      </footer-item>
      <footer-item v-bind:class="{ 'active sky-bule' : currentView === 'emotion' }" v-on:click="changeView('emotion')">
        <i class="fa fa-venus-mars"></i>
        <span class="badge">2</span>
        <!--<label>情感</label>-->
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
import Page from '../components/page'
import { Footer, Item } from '../components/footer'
import Moment from './index-tab/Moment'
import Blog from './index-tab/Blog'
import Emotion from './index-tab/Emotion'
import Note from './index-tab/Note'
import At from './index-tab/At'

export default {
  components: {
    Page,
    'page-footer': Footer,
    'footer-item': Item,
    'moment': Moment,
    'blog': Blog,
    'emotion': Emotion,
    'note': Note,
    'at': At
  },
  data () {
    return {
      currentView: 'moment'
    }
  },
  methods: {
    changeView (view) {
      this.currentView = view
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