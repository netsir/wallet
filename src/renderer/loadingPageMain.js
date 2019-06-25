import Vue from "vue";
import "web3";
// import "./styles/loadingpage.scss"
import "element-ui/lib/theme-chalk/index.css";

import "./styles/reset.scss";

import loadingPage from "./loadingPage";
import i18n from "./lang/index";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  i18n,
  components: { loadingPage },
  template: "<loading-page/>"
}).$mount("#init");
