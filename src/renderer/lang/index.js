import en from "./en";
import cn from "./cn";
import cnHant from "./zh-Hant";
import fr from "./fr";

import Vue from "vue";
import VueI18n from "vue-i18n";
import ElementLocale from "element-ui/lib/locale";

//element组件的语言包
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import frLocale from "element-ui/lib/locale/lang/fr";
import twLocale from "element-ui/lib/locale/lang/zh-TW";

Vue.use(VueI18n);
const messages = {
  en: {
    ...en,
    ...enLocale
  },
  "zh-CN": {
    ...cn,
    ...zhLocale
  },
  fr: {
    ...fr,
    ...frLocale
  },
  "zh-TW": {
    ...cnHant,
    ...twLocale
  }
};

const i18n = new VueI18n({
  locale: window.localStorage.getItem("curLang") || "en",
  messages,
  silentTranslationWarn: true
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
