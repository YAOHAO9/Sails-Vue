<template>
  <div class="page">
    <simple-header title="Contacts" :back-link="true"></simple-header>
    <second-header>
      <searchbar :input.sync="input"></searchbar>
    </second-header>
    <content>
      <list style="margin-top: 0;">
        <template v-for="p in filtedList">
          <li class="list-group-title" v-if="p.title">{{p.name}}</li>
          <list-item v-if="!p.title">
            <div class="item-media"><img src="../assets/images/avator/1.png" width="30"></div>
            <div class="item-content">
              <div class="item-title">{{p.name}}</div>
            </div>
          </list-item>
        </template>
      </list>
    </content>
  </div>
</template>

<script>
import { SimpleHeader, SecondHeader } from '../components/header'
import Content from '../components/content'
import { List, ListItem } from '../components/list'
import Searchbar from '../components/searchbar'

export default {
  components: {
    SimpleHeader,
    SecondHeader,
    Searchbar,
    Content,
    List,
    ListItem
  },
  data() {
    return {
      input: '',
      list: [
        { title: true, name: 'A' },
        { name: 'Albert Bernard', avator: '1.png' },
        { name: 'Amy Richard', avator: '2.png' },
        { name: 'Andrew Schmidt', avator: '3.png' },
        { title: true, name: 'B' },
        { name: 'Bob Jackson', avator: '4.png' },
        { name: 'Bom', avator: '5.png' },
        { name: 'BaBa', avator: '6.png' },
        { name: 'Bilibili', avator: '7.png' },
        { title: true, name: 'L' },
        { name: 'Linus Torvalds', avator: 'torvalds.png' },
        { title: true, name: 'T' },
        { name: 'Tom Clinton', avator: '4.png' },
        { name: 'Tim Cook', avator: '5.png' },
        { name: 'Ted', avator: '6.png' },
        { name: 'Tomato', avator: '7.png' },
        { title: true, name: 'X' },
        { name: 'Xie', avator: '4.png' },
        { name: 'Xing', avator: '5.png' },
        { name: 'Xia ran', avator: '6.png' },
        { name: 'Xue dinge', avator: '7.png' },
        { title: true, name: 'Z' },
        { name: 'Zhang xiaoqi', avator: 'gf.png' }
      ]
    }
  },
  computed: {
    filtedList() {
      return _.filter(this.list, (d) => {
        if (!this.input) return true
        if (d.title) return false
        return d.name.toUpperCase().indexOf(this.input.toUpperCase()) !== -1
      })
    }
  }
}
</script>
