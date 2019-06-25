<template>
  <header class="container">
   <div class="headerBox">
     <div class="logo">
       <nts-logo/>
       <div class="history">
         <span><i class="iconfont icon-qianjinmoren" @click="back"></i></span>
         <span><i class="iconfont icon-qianjinmoren" @click="forward"></i></span>
       </div>
       <router-link v-if="isDev" style="margin-left: 10px" tag="button" to="/test">test</router-link>
     </div>
     <div class="curAccount" v-if="curAccount.name">
       <el-dropdown @command="changeAccount">
         <p>
           <avatar class="avatar" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"/>
           <span>{{curAccount.name}}</span>
           <i class="el-icon-caret-bottom"></i>
         </p>
         <el-dropdown-menu slot="dropdown">
           <el-dropdown-item :command="idx" v-for="(i, idx) in accounts" :key="idx">
             <div class="dropdown-item">
               <avatar class="avatar" size="small" :color="i.color" :identity="i.role.identity" :active="i.role.active" />
               <span>{{ i.name }}</span>
             </div>
           </el-dropdown-item>
         </el-dropdown-menu>
       </el-dropdown>
     </div>
   </div>

  </header>
</template>

<script>
import logo from "./logo";
import avatar from "../avatar";
import vuexData from "../../mixins/vuexData";
import { identity } from "../../const/account";
import { ipcRenderer } from "electron";
import { Message } from "element-ui";
const langType = { "zh-CN": 0, en: 1, fr: 2, "zh-TW": 3 };
export default {
  name: "nts-header",
  components: {
    [logo.name]: logo,
    [avatar.name]: avatar
  },
  data() {
    return {
      isWitnessing: false,
      selectAccountDialog: false,
      accountForm: {
        curAccountIdx: 0
      },
      isDev: process.env.NODE_ENV === "development"
    };
  },
  mixins: [vuexData],
  methods: {
    openSelectAccountDialog() {
      this.selectAccountDialog = true;
    },
    changeAccount(idx) {
      this.$store.commit("account/set_account_idx", idx);
      console.log(idx);
      Message.success(this.$t("account.changeAccount"));
    },
    back() {
      window.history.back();
    },
    forward() {
      window.history.forward();
    },
    getIdentityClass(i) {
      return {
        identity: true,
        userWitness: i === identity.userWitness,
        sysWitness: i === identity.sysWitness,
        council: i === identity.council
      };
    }
  },
  created() {
    let lang = window.localStorage.getItem("curLang");
    if (lang) {
      this.$i18n.locale = lang;
      ipcRenderer.send("langType", langType[lang]);
    } else {
      window.localStorage.setItem("curLang", this.$i18n.locale);
    }
  },
  mounted() {
    ipcRenderer.on("changeLanguage", (event, arg) => {
      ipcRenderer.send("langType", langType[arg]);
      this.$i18n.locale = arg;
      window.localStorage.setItem("curLang", arg);
    });
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/index";
.el-dropdown-menu.el-popper {
  overflow-y: scroll;
  max-height: 350px;
  &::-webkit-scrollbar {
    width: 6px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    background-color: #fff; /*滚动条的背景颜色*/
  }
  &::-webkit-scrollbar-thumb {
    height: 150px;

    border-radius: 10px; /*滚动条的圆角*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
    background-color: #d9d9d9; /*滚动条的背景颜色*/
  }
}
.container {
  padding: 0 30px 0 30px;
  background: #fff;
  position: relative;
  left: 0;
  top: 0;
  > div {
    display: flex;
    align-items: center;
    &:nth-child(2) {
      flex: 1;
    }
  }
}

.avatar {
  margin-right: 6px;
}

.headerBox {
  display: flex;
  height: 80px;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
}
.dialogFooter {
  position: relative;
  top: -20px;
}

.select {
  width: 100%;
}

.curAccount {
  padding: 4px 8px;
  line-height: 20px;
  position: relative;
  p {
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.3s;
    &:hover {
      color: $themeColor;
    }
  }

  span {
    padding: 0 4px;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  .avatar {
    margin-right: 8px;
  }
}

.history {
  margin-left: 20px;
  user-select: none;
  span {
    display: inline-block;
    &:first-child {
      transform: rotateY(180deg);
      margin-right: 6px;
    }
  }
  i {
    font-size: 18px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: #f68d27;
    }
  }
}
</style>
