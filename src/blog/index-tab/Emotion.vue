<template>
  <div>
    <simple-header title="Emotion"></simple-header>
    <content>
      <image-grid ></image-grid>
    </content>
  </div>
</template>

<script>
import { SimpleHeader } from '../../components/header'
import Content from '../../components/content'
import ImageGrid from '../components/image-grid'

export default {
  components: {
    SimpleHeader,
    Content,
    ImageGrid
  }
}
</script>
