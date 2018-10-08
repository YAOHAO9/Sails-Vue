<template>
  <div>
    <simple-header title="Note"></simple-header>
    <content>
      <ideal-image-slide></ideal-image-slide>
    </content>
  </div>
</template>

<script>
import { SimpleHeader } from "../../components/header";
import Content from "../../components/content";
import IdealImageSlide from "../../components/ideal-image-slide";

export default {
  components: {
    SimpleHeader,
    Content,
    IdealImageSlide
  }
};
</script>
