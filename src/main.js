import Vue from 'vue'
import Router from 'vue-router'
import FastClick from 'fastclick'
import VueResource from 'vue-resource'
import Vum from './vum.js'
// demos
import Index from './demos/Index'
import Page from './demos/Page'
import Buttons from './demos/Buttons'
import Column from './demos/Column'
import Grid from './demos/Grid'
import Modal from './demos/Modal'
import List from './demos/List'
import Contacts from './demos/Contacts'
import Form from './demos/Form'
import Icons from './demos/Icons'
import Tab from './demos/Tab'
import Scroll from './demos/Scroll'
import Popup from './demos/Popup'
import PopWindow from './demos/PopWindow'
import Preloader from './demos/Preloader'
import Actions from './demos/Actions'
import Toast from './demos/Toast'
import Searchbar from './demos/Searchbar'
import Calendar from './demos/Calendar'
import Result from './demos/Result'
import Slide from './demos/Slide'
import SidePanel from './demos/SidePanel'
import Menu from './demos/Menu'
import Stars from './demos/Stars'
import CircleProgress from './demos/CircleProgress'

// filter
import Filters from './filter'
import $ from 'jquery'

// blog
import BlogIndex from './blog/Index'
import ImageGridDetail from './blog/page/image-grid-detail'
import PersonalCenter from './blog/page/personal-center'
import ArticleDetail from './blog/page/article-detail'
import VueSocketio from 'vue-socket.io';
import vuex from './vuex/vuex'
Vue.config.debug = true

Vue.mixin({vuex})
Vue.use(Router)
Vue.use(VueResource)
Vue.use(Vum)
Vue.use(Filters)
Vue.use(VueSocketio, location.origin)

let router = new Router()

router.map({
  '/': {
    component: BlogIndex
  },
  '/blog': {
    component: BlogIndex
  },
  '/image-grid-detail': {
    name: 'Detail',
    component: ImageGridDetail
  },
  '/personal-center': {
    name: 'Personal center',
    component: PersonalCenter
  },
  '/article-detail': {
    name: 'Article detail',
    component: ArticleDetail
  },
  '/index': {
    name: 'index',
    component: Index
  },
  '/page': {
    component: Page
  },
  '/buttons': {
    component: Buttons
  },
  '/column': {
    component: Column
  },
  '/grid': {
    component: Grid
  },
  '/modal': {
    component: Modal
  },
  '/list': {
    component: List
  },
  '/contacts': {
    component: Contacts
  },
  '/form': {
    component: Form
  },
  '/icons': {
    name: 'icons',
    component: Icons
  },
  '/tab': {
    component: Tab
  },
  '/scroll': {
    component: Scroll
  },
  '/popup': {
    component: Popup
  },
  '/popwindow': {
    component: PopWindow
  },
  '/preloader': {
    component: Preloader
  },
  '/toast': {
    name: 'toast',
    component: Toast
  },
  '/actions': {
    component: Actions
  },
  '/searchbar': {
    component: Searchbar
  },
  '/calendar': {
    component: Calendar
  },
  '/result': {
    name: 'result',
    component: Result
  },
  '/slide': {
    name: 'slide',
    component: Slide
  },
  '/side-panel': {
    name: 'side-panel',
    component: SidePanel
  },
  '/menu': {
    name: 'menu',
    component: Menu
  },
  '/stars': {
    name: 'stars',
    component: Stars
  },
  '/circle': {
    name: 'circle',
    component: CircleProgress
  }
})
import App from './app'
router.start(App, '#app')

Vum.router(router)

FastClick.attach(document.body)
