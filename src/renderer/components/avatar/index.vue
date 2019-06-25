<template>
  <div class="avatar" :class="[shape, size, {noPadding}]" :style="{backgroundColor}">
    <i :class="identityClass"></i>
  </div>
</template>

<script>
import { identity } from "../../const/account";

export default {
  name: "avatar",
  props: {
    size: {
      type: String,
      default: "small",
      validator(value) {
        return ["small", "middle", "large", "largest"].includes(value);
      }
    },
    color: {
      type: String,
      default: "inherit"
    },
    shape: {
      type: String,
      validator(value) {
        return ["circle", "square"].includes(value);
      },
      default: "circle"
    },
    identity: {
      type: Number,
      default: identity.normal
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    identityClass() {
      return {
        identity: true,
        userWitness: this.identity === identity.userWitness && this.active,
        sysWitness: this.identity === identity.sysWitness && this.active,
        council: this.identity === identity.council && this.active,
        system: this.identity === identity.system,
        contract: this.identity === identity.contract,
        anonymity: this.identity === identity.anonymity
      };
    },
    backgroundColor() {
      let needRenderIdentities = [
        identity.normal,
        identity.userWitness,
        identity.sysWitness,
        identity.council
      ];
      return needRenderIdentities.includes(this.identity)
        ? this.color
        : this.identity === identity.anonymity
          ? "#999"
          : "";
    },
    noPadding() {
      return (
        this.identity === identity.system || this.identity === identity.contract
      );
    }
  }
};
</script>

<style scoped lang="scss">
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.small {
  width: 22px;
  height: 22px;
  padding: 5px;
}

.middle {
  width: 34px;
  height: 34px;
  padding: 8px;
}

.large {
  width: 42px;
  height: 42px;
  padding: 10px;
}

.largest {
  width: 64px;
  height: 64px;
  padding: 16px;
}

.noPadding {
  padding: 0;
}

.circle {
  border-radius: 50%;
}

.identity {
  background-repeat: no-repeat;
  background-size: contain;
  flex: 1;
  height: 100%;
}

.userWitness {
  background-image: url("./imgs/userWitness.png");
}

.sysWitness {
  background-image: url("./imgs/sysWitness.png");
  background-position: 0 3px;
}

.council {
  background-image: url("./imgs/council.png");
}

.contract {
  background-image: url("./imgs/system.png");
}

.system {
  background-image: url("./imgs/system.png");
}

.anonymity {
  background-image: url("./imgs/anonymity.png");
}
</style>
