<template>
  <p class="container" v-if="!haveSyncDone">
    <i class="iconfont icon-loading"></i>
    {{$t('system.synchronizing')}}
  </p>
</template>

<script>
export default {
  name: "tip",
  computed: {
    timeStamp() {
      return this.$store.state.system.lastBlockTimeStamp;
    },
    haveSyncDone() {
      return Date.now() - this.timeStamp / 1e6 < 120 * 1000;
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 8px 0;
  text-align: center;
  font-size: 14px;
  background: rgba(240, 127, 17, 0.8);
  z-index: 9999;
  color: #ffffff;
}

.icon-loading {
  font-size: 18px;
  position: relative;
  top: 1px;
  margin-right: 4px;
  animation: rotate 3s linear infinite;
  transform: rotate(0);
  display: inline-block;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
