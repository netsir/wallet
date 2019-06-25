<template>
  <div>
    <ul :class="$style.container">
      <li :class="$style.item" v-for="(item, idx) in accounts">
        <account-item :account="item" @click="handleClick(item.address, idx)"/>
      </li>
    </ul>
  </div>
</template>

<script>
import accountItem from "./accountItem";
import { mapGetters } from "vuex";
import { Message } from "element-ui";

export default {
  name: "account-list",
  components: {
    [accountItem.name]: accountItem
  },
  computed: {
    ...mapGetters(["accounts"])
  },
  methods: {
    handleClick(address, idx) {
      if (this.$store.state.account.curAccountIdx !== idx)
        Message.success(this.$t("account.changeAccount"));
      this.$store.commit("account/set_account_idx", idx);
      this.goRouterByAddress(address);
    },
    goRouterByAddress(address) {
      this.$router.push(`/account/${address}`);
    }
  }
};
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  margin-right: 18px;
  margin-top: 14px;
}
</style>
