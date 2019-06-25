<template>
  <div class="container">
    <div class="key" v-if="label">{{label}}</div>
    <div class="value">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: "nts-item",
  props: ["label"]
};
</script>

<style scoped lang="scss">
.container {
  padding: 14px 30px;
  position: relative;
  line-height: 1.2;
  display: flex;
  align-items: center;
  .key {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 0 1%;
    width: 16%;
  }
  .value {
    width: 80%;
    word-wrap: break-word;
    word-break: normal;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }
}
</style>
