<template>
  <div class="smallTip">
    <img src="./tt.png" alt="">
    <span class="words">POW计算中<span class="dotting"></span></span>
  </div>
</template>

<script>
export default {
  name: "smallTip"
};
</script>

<style scoped>
img {
  width: 30px;
  height: 30px;
  animation: rotate 15s linear infinite;
  transform: rotate(0);
  background-color: #f68d27;
  border-radius: 50%;
  /*opacity: .6;*/
  vertical-align: middle;
  top: 6px;
  border: 1px solid #ccc;
}
.words {
  width: 105px;
  color: #555;
  padding-left: 7px;
  display: inline-block;
  height: 25px;
  border-radius: 15px 15px;
  line-height: 30px;
  position: relative;
  z-index: 998;
  left: -10px;
  top: 2px;
  box-shadow: 1px 2px 1px 1px rgba(84, 115, 254, 0.16);
}

.smallTip {
  align-items: center;
  height: 40px;
  width: 160px;
  border-radius: 10px;
}

.dotting {
  display: inline-block;
  min-width: 2px;
  min-height: 2px;
  box-shadow: 2px 0 currentColor, 6px 0 currentColor, 10px 0 currentColor; /* for IE9+, ..., 3个点 */
  animation: dot 2s infinite step-start both; /* for IE10+, ... */
}

@keyframes dot {
  25% {
    box-shadow: none;
  }
  /* 0个点 */
  50% {
    box-shadow: 2px 0 currentColor;
  }
  /* 1个点 */
  75% {
    box-shadow: 2px 0 currentColor, 6px 0 currentColor; /* 2个点 */
  }
}
</style>
