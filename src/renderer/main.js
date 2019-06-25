import Vue from "vue";
import "web3";
import App from "./App";
import router from "./router";
import store from "./store";
import Setting from "../modules/setting";
import net from "net";
import init from "./initApp";
import "./styles/index.scss";
import i18n from "./lang/index.js";
global.web3 = Web3;
const v = new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: "<App/>"
});

init().then(() => {
  v.$mount("#app");
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
export const web3 = new Web3(Setting.ipcPath, net);
