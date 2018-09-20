<template>
  <div class="discussion">
    <div class="scroll">
      <div class="item hiv" v-for="discussion in discussions" :key="discussion.id">
        <div class="portraitParent">
          <avator :avator="discussion.user ? discussion.user.avator :''"></avator>
        </div>
        <div class="discussionInfo">
          <div class="info">
            <span class="name">{{ discussion.user.name }}</span>
            <span class="date">{{ new Date(discussion.createdAt) | date}}</span>
          </div>
          <div class="content" v-html="discussion.content">
          </div>
        </div>
      </div>
      <form class="form">
        <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
      </form>
      <wrapper :padding="'30px'">
        <button type="light" @click="!submiting && submit()" :class="{'disabled':submiting}">确认</button>
      </wrapper>
    </div>
  </div>
</template>
<script>
import { Button } from "../../components/buttons";
import Avator from "../components/avator";
export default {
  data() {
    return {
      content: "",
      submiting: false,
      discussions: []
    };
  },
  props: {
    type: String,
    item: {
      type: Object,
      default: function() {
        return { user: {} };
      }
    },
    submitCb: {
      type: Function
    }
  },
  ready: function() {
    this.$http.get(`api/discussion/${this.type}/${this.item.id}`).then(res => {
      this.discussions = res.body.data;
    });
  },
  components: {
    Avator,
    Button
  },
  methods: {
    submit: function() {
      var ctx = this;
      this.submiting = true;
      if (!this.content || this.content == "") {
        this.showToast("留下点什么吧");
        this.submiting = false;
        return;
      }
      this.$http
        .post(`api/discussion/${this.type}/${this.item.id}`, {
          content: this.content
        })
        .then(res => {
          ctx.submitCb && ctx.submitCb();
          ctx.submiting = false;
          ctx.content = "";
          ctx.item.discussions.push(res.body.data);
          res.body.data.user = this.user;
          ctx.discussions.push(res.body.data);
        });
    }
  }
};
</script>
<style scoped>
body {
  overflow: auto;
}
.discussion {
  position: relative;
}
.form {
  width: 100%;
  background-color: #efeff4;
}
.scroll {
  height: 100%;
  overflow: auto;
}
textarea {
  margin-top: 10px;
  max-width: 100%;
  min-width: 100%;
  padding: 0 5px;
  padding-left: 10px;
  padding-right: 10px;
  height: 80px;
}
.item {
  margin: 10px 0px;
}
.portraitParent {
  width: 56px;
}
.portrait {
  border-radius: 18px;
  background-color: gray;
  height: 36px;
  width: 36px;
  margin: 0 5px;
  overflow: hidden;
}
.discussionInfo {
  width: 100%;
}
.info {
  font-size: 12px;
  overflow: hidden;
}
.name {
  float: left;
  min-width: 5em;
}
.date {
  float: left;
  margin-left: 1em;
}
.content {
  font-size: 13px;
}
</style>