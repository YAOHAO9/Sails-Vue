<template>
  <div>
    <hev v-for="row in rows" :child-width="childWidth" class="image-grid" :key="row">
      <div v-for="column in row" :key="column">
        <div v-square="{padding:'2%'}">
          <div :style="getImgStyle('api/file/find/' + column)"></div>
        </div>
      </div>
    </hev>
  </div>
</template>
<script>
export default {
  data() {
    return {
      column: 1,
      rows: []
    };
  },
  props: {
    urls: {
      type: Array,
      default: function() {
        return [1, 2, 3, 4];
      }
    }
  },
  methods: {
    getImgStyle(url) {
      return {
        backgroundSize: "cover",
        backgroundImage: `url('${url}')`
      };
    }
  },
  ready: function() {
    var column = 1,
      rows = [];
    if (this.urls.length > 9) {
      column = 4;
    } else if (this.urls.length > 4) {
      column = 3;
    } else if (this.urls.length > 1) {
      column = 2;
    } else if (this.urls.length == 1) {
      column = 1;
    }
    var rows;
    for (var i = 0; i <= (this.urls.length - 1) / column; i++) {
      var row = [];
      for (
        var j = i * column;
        j < (i + 1) * column && j < this.urls.length;
        j++
      ) {
        row.push(this.urls[j]);
      }
      rows.push(row);
    }
    this.column = column;
    this.rows = rows;
  },
  computed: {
    childWidth: function() {
      return 100 / this.column + "%";
    }
  }
};
</script>
