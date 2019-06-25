<template>
  <div class="container" @click="$emit('click')">
    <div class="sign">
      <avatar size="large" :color="account.color" :identity="account.role.identity" :active="account.role.active"/>
    </div>
    <div class="detail">
      <p class="name"><span class="noWarp">{{account.name }}</span></p>
      <p class="balance"><span class="num">{{account.balance | toNts}}</span><span class="unit">NTS</span></p>
      <p class="address">{{account.address | ellipsis}}</p>
    </div>
  </div>
</template>

<script>
import { identity } from "../../const/account";
import avatar from "../avatar";
export default {
  name: "accountItem",
  props: ["account"],
  components: {
    [avatar.name]: avatar
  },
  computed: {
    identityClass() {
      return {
        identity: true,
        userWitness:
          this.account.role.identity === identity.userWitness &&
          this.account.role.active,
        sysWitness:
          this.account.role.identity === identity.sysWitness &&
          this.account.role.active,
        council:
          this.account.role.identity === identity.council &&
          this.account.role.active
      };
    }
  }
};
</script>

<style scoped lang="scss">
.noWarp {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.container {
  display: flex;
  transition: 0.4s;
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.detail {
  margin-left: 10px;
}
.sign {
  display: flex;
  align-items: center;
}
.name {
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  span:first-child {
    width: 120px;
  }
}
.balance {
  font-weight: bold;
  line-height: 1.5;
  width: 120px;
  display: flex;
  align-items: center;
}
.num {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unit {
  font-size: 10px;
  margin-left: 6px;
  font-weight: normal;
  position: relative;
  top: 1px;
}
.address {
  margin-top: 4px;
  font-size: 12px;
  width: 120px;
}
</style>
