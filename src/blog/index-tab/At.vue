<template>
  <simple-header title="Note"></simple-header>
  <content>
    <tab>
      <tab-item title="WeChat">
        <h1 class="demos-title">Boys</h1>
      </tab-item>
      <tab-item title="YAOHAO">
        <h1 class="demos-title">Girls</h1>
      </tab-item>
    </tab>
  </content>
</template>

<script>
  import { SimpleHeader } from '../../components/header'
  import Content from '../../components/content'
  import { Tab, TabItem } from '../../components/tab'

  export default {
    components: {
      SimpleHeader,
      Content,
      Tab,
      TabItem
    }
  }
</script>