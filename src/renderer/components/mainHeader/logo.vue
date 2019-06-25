<template>
  <div :class="$style.container">
    <img src="./logo.png" alt="">
  </div>
</template>

<script>
export default {
  name: "nts-logo"
};
</script>

<style module lang="scss">
.container {
  img {
    display: block;
  }
}
</style>
