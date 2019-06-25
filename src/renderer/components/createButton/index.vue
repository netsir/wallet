<template>
  <div :class="$style.container" @click="$emit('click')">
    <div :class="$style.flex">
      <span :class="$style.icon"><i class="el-icon-plus"></i></span>
      <p :class="$style.text">{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "nts-create-button",
  props: ["text"]
};
</script>

<style module lang="scss">
.container {
  display: inline-block;
  cursor: pointer;
  transition: 0.3s;
  padding: 5px;
}
.flex {
  display: flex;
  align-items: center;
}
.icon {
  width: 55px;
  height: 80px;
  background: #272b38;
  color: #bcbcbc;
  font-size: 30px;
  text-align: center;
  line-height: 80px;
}
.text {
  font-size: 18px;
  font-weight: bold;
  margin-left: 24px;
}
</style>
