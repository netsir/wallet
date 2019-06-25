<template>

  <nts-menu :active-name="curRoutePath" @on-select="changeRouter">
    <nts-menu-item name="/" icon="icon-yonghu" :label="$t('account.accountUser')"/>
    <nts-menu-item name="/sendTransaction" icon="icon-send" :label="$t('transaction.transfer')"/>
    <nts-menu-item name="/transactionList" icon="icon-jiaoyi" :label="$t('extended.record')"/>
    <nts-menu-item name="/create_page" icon="icon-jihualiebiao" :label="$t('contract.contractTo')"/>
    <nts-menu-item name="/proposal/list" icon="icon-shenpi" :label="$t('extended.proposal')"/>
    <!--<nts-menu-item name="/index_setting" icon="icon-shezhi" label="设置"/>-->
  </nts-menu>
</template>

<script>
import Menu from "./menu";
import MenuItem from "./menu-item";

export default {
  name: "nav-menu",
  components: {
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem
  },
  data() {
    return {
      curRoutePath: "/"
    };
  },
  watch: {
    $route(r) {
      this.curRoutePath = r.path;
    }
  },
  methods: {
    changeRouter(name) {
      this.$router.push(name);
    }
  },
  created() {
    this.curRoutePath = this.$route.path;
  }
};
</script>

<style scoped lang="scss">
</style>
