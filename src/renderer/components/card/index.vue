<template>
  <div class="card" :style="spStyle" :class="{padding: needPadding}" ref="card">
    <h2 v-if="title">{{title}}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "nts-card",
  props: {
    title: {
      type: String,
      default: ""
    },
    needPadding: {
      type: Boolean,
      default: true
    },
    spStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style scoped lang="scss">
.card {
  margin-bottom: 20px;
  position: relative;
  box-sizing: border-box;
  h2 {
    font-size: 18px;
    font-weight: bold;
    line-height: 2;
    color: rgb(51, 51, 51);
    margin-bottom: 14px;
  }
  &.min {
    min-height: 768px;
  }
}

.padding {
  padding: 20px 30px;
}
</style>
