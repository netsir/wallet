<template>
  <li :class="itemClass" @click.stop="handleClick">
    <div class="inner">
      <i class="iconfont" :class="icon"></i>
      <p class="label">{{label}}</p>
    </div>
  </li>
</template>

<script>
import emitter from "../../mixins/emitter";

export default {
  name: "nts-menu-item",
  mixins: [emitter],
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String
    },
    label: {
      type: String
    }
  },
  data() {
    return {
      curActiveName: ""
    };
  },
  computed: {
    isActive() {
      return this.name === this.curActiveName;
    },
    itemClass() {
      return {
        "item-active": this.isActive,
        item: true
      };
    }
  },
  methods: {
    handleClick() {
      this.dispatch("on-menu-item-select", this.name);
    },
    initEvent() {
      this.$on("on-update-active-name", name => {
        this.curActiveName = name;
      });
    }
  },
  mounted() {
    this.initEvent();
  }
};
</script>

<style scoped lang="scss">
.item {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  color: #fff;
  &:hover {
    background: #f07f11;
    .iconfont {
      top: -8px;
    }
    .label {
      opacity: 1;
    }
  }
}

.item-active {
  background: #f07f11;
}

.iconfont {
  font-size: 24px;
  position: relative;
  transition: 0.2s;
  top: 0;
  &.icon-zhuanzhang {
    font-size: 28px;
  }
  &.icon-wenjian {
    font-size: 28px;
  }
  &.icon-jihualiebiao {
    font-size: 24px;
  }
  &.icon-shezhi {
    font-size: 26px;
  }
  .icon-iconfont56 {
    font-size: 26px;
  }
}

.inner {
  text-align: center;
  position: relative;
  .label {
    transition: 0.2s;
    font-size: 12px;
    opacity: 0;
  }
}
</style>
