<template>
  <ul :class="$style.container">
    <slot></slot>
  </ul>
</template>

<script>
import emitter from "../../mixins/emitter";
export default {
  name: "nts-menu",
  mixins: [emitter],
  props: {
    activeName: {
      type: [String, Number]
    }
  },
  data() {
    return {
      curActiveName: this.activeName
    };
  },
  methods: {
    updateActiveName() {
      this.broadcast("on-update-active-name", this.curActiveName);
    },
    initEvent() {
      this.$on("on-menu-item-select", name => {
        this.curActiveName = name;
        this.$emit("on-select", name);
      });
    }
  },
  watch: {
    activeName(val) {
      this.curActiveName = val;
    },
    curActiveName() {
      this.updateActiveName();
    }
  },
  mounted() {
    this.updateActiveName();
    this.initEvent();
  }
};
</script>

<style module lang="scss">
.container {
  width: 66px;
  background: #272b38;
}
</style>
