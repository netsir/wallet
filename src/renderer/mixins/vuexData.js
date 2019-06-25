import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapGetters(["accounts", "curAccount"]),
    ...mapState("system", {
      sysChainAddress: state => state.sysChainAddress,
      sysChainHeight: state => state.sysChainHeight
    }),
    ...mapState("account", {
      accountAddresses: state => state.accountAddresses,
      curAccountIdx: state => state.curAccountIdx,
      accountChainHeight: state => state.accountChainHeight
    })
  }
};
