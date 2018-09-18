<template>
    <div>
        <router-view transition="slide"></router-view>
        <pre-loader :show="preLoader.show"></pre-loader>
        <toast :show="toast.show" :text="toast.text"></toast>
    </div>
</template>
<script>
import Toast from "./blog/components/toast";
import PreLoader from "./blog/components/preloader";
export default {
  components: {
    Toast,
    PreLoader
  }
};
</script>

