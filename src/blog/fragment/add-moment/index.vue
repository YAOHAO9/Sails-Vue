<template>
  <div>
    <form>
      <textarea placeholder="这一刻的想法..." v-model="content"></textarea>
    </form>
    <div class="image-grid-parent">
      <hev v-for="row in rows" class="image-grid" :key="row">
        <div v-for="column in row" :key="column">
          <div v-square="{padding:'2%'}" class="selectImageParent">
            <div>
              <img :style="'display:'+column.display" src="../../../assets/images/add.png" :name="column.name" />
              <input :style="'display:'+column.display" :name="column.name" type="file" multiple="multiple" accept="image/*" />
            </div>
          </div>
        </div>
      </hev>
    </div>
    <wrapper :padding="'30px'">
      <button type="light" @click="!submiting && submit()" :class="{'disabled':submiting}">确认</button>
    </wrapper>
  </div>
</template>
<script>
import ImageGrid from "../../components/image-grid";
import { Button } from "../../../components/buttons";

import Lrz from "lrz";

export default {
  data() {
    return {
      rows: (function() {
        var rows = [];
        var nameIndex = 0;
        for (var i = 0; i < 3; i++) {
          var row = [];
          for (var j = 0; j < 3; j++) {
            (function(name) {
              row.push({ display: "none", name: name });
            })("image" + nameIndex++);
          }
          rows.push(row);
        }
        rows[0][0].display = "block";
        return rows;
      })(),
      content: "",
      submiting: false,
      loadImging: false
    };
  },
  props: {
    submitCb: {
      type: Function
    }
  },
  ready: function() {
    var ctx = this;
    for (var i = 0; i < 3; i++) {
      var row = this.rows[i];
      for (var j = 0; j < 3; j++) {
        (function(column) {
          $("input[name=" + column.name + "]")[0].addEventListener(
            "change",
            function() {
              ctx.loadImging = true;
              lrz(this.files[0], { width: 1000 })
                .then(function(rst) {
                  // 处理成功会执行
                  // document.getElementById('HeadIcon').src= rst.base64;
                  // formData.append('ImgUrlImage',rst.file);
                  column.compressPicture = rst;
                  var img = $("img[name=" + column.name + "]")[0];
                  img.src = column.compressPicture.base64;
                  ctx.refresh();
                })
                .catch(err => {
                  // 处理失败会执行
                  this.showToast("处理失败");
                })
                .always(function() {
                  // 不管是成功失败，都会执行
                  ctx.loadImging = false;
                });
            }
          );
        })(row[j]);
      }
    }
  },
  components: {
    ImageGrid,
    Button,
    Lrz
  },
  methods: {
    isLoadImging: function() {
      if (this.loadImging) {
        this.showToast("请稍等，正在加载上一张图片...");
        return false;
      }
      return true;
    },
    submit: function() {
      this.submiting = true;
      var formData = new FormData();
      var compressPictures = [];
      _.each(this.rows, function(row) {
        _.each(row, function(column) {
          if (column.compressPicture) {
            compressPictures.push(column.compressPicture);
            column.compressPicture = false;
            column.display = "node";
          }
        });
      });
      if (
        (!this.content || this.content == "") &&
        compressPictures.length == 0
      ) {
        this.showToast("留下点什么吧");
        this.submiting = false;
        return;
      }
      formData.append("content", this.content);
      _.each(compressPictures, function(compressPicture) {
        formData.append("images", compressPicture.file);
      });
      this.$http.post("/api/moment/create", formData).then(response => {
        this.submitCb && this.submitCb();
        this.submiting = false;
      });
    },
    refresh: function() {
      var compressPictures = [];
      _.each(this.rows, function(row) {
        _.each(row, function(column) {
          if (column.compressPicture) {
            compressPictures.push(column.compressPicture);
            column.compressPicture = false;
            column.display = "node";
          }
        });
      });
      var index = 0;
      _.each(this.rows, function(row) {
        _.each(row, function(column) {
          if (index < compressPictures.length) {
            column.compressPicture = compressPictures[index++];
            var img = $("img[name=" + column.name + "]")[0];
            img.src = column.compressPicture.base64;
            column.display = "block";
          } else if (index++ == compressPictures.length) {
            column.display = "block";
          }
        });
      });
    }
  }
};
</script>
<style scoped>
body {
  overflow: auto;
}

textarea {
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  max-width: 100%;
  min-width: 100%;
  padding: 0 5px;
  height: 80px;
}

.image-grid-parent {
  width: 55%;
  margin: 5px 20px;
}

.selectImageParent {
  position: relative;
}

.selectImageParent input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>