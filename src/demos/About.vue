<template>
  <div>
    <simple-header title="About"></simple-header>
    <content>
      <div class="content-padded">
        <p>An UI Framework for build mobile web app with vue.js</p>
        <p>Source Code:
          <a href="https://github.com/lihongxun945/vum" target="_blank">https://github.com/lihongxun945/vum</a>
        </p>
        <p>Docs will come out soon</p>
        <p>
          @2016/06/30 by 言川
        </p>
      </div>
    </content>
  </div>
</template>

<script>
import Content from "../components/content";
import { SimpleHeader } from "../components/header";

export default {
  components: {
    SimpleHeader,
    Content
  }
};
</script>
