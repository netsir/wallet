<template>
  <div id="app">
    <div class="layoutSide">
      <nav-menu/>
      <ul class="chain-height">
        <li>
          <i class="iconfont icon-cf-c"></i>
          <p class="accountChainHeight">{{accountChainHeight}}</p>
        </li>
        <li>
          <i class="iconfont icon-gaoduceng"></i>
          <p>{{sysChainHeight}}</p>
        </li>
      </ul>
    </div>
    <div class="layoutContainer" v-if="isInit">
      <nts-header/>
      <div class="layoutMain">
        <div class="layoutMainContainer" ref="layoutMainContainer">
          <router-view/>
        </div>
      </div>
        <smallTip v-if="smallTip" class="smallTip"/>
      <tip class="tip"/>
    </div>

    <el-dialog :title="$t('riskTips.importAccount')" :visible.sync="importMnemonicsDialogVisible" width="500px" center :close-on-click-modal="false">
      <h4 class="p1">{{$t('riskTips.importMnemonics')}}</h4>
      <el-form>
        <el-form-item class="mnemonics" >
          <el-input type="textarea" resize="none" class="fz12"  :placeholder="$t('riskTips.spaceMnemonics')" v-model="wordsForm.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input :placeholder="$t('riskTips.pwdLength')" class="fz12" type="password" v-model="wordsForm.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input :placeholder="$t('riskTips.repeatPwd')" class="fz12"  type="password"  v-model="wordsForm.repeatPassword"></el-input>
        </el-form-item>
        <div class="dialogFooter mt30">
          <el-button class="btnThemeColor"  @click="importFromWords">{{$t('riskTips.import')}}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('account.keystoreImport')" :visible.sync="importKeystoreDialogVisible" width="500px" center :close-on-click-modal="false">
      <el-form>
        <el-form-item label="keystore">
          <el-input type="textarea" :rows="4" class="fz12" placeholder="keystore" v-model="keystoreForm.text"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.originalPsw')" style="margin-top: -16px">
          <el-input :placeholder="$t('account.originalPswTip')" class="fz12" type="password" v-model="keystoreForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.newPsw')" style="margin-top: -16px">
          <el-input :placeholder="$t('account.newPswTip')" class="fz12"  type="password"  v-model="keystoreForm.newPassword"></el-input>
        </el-form-item>
        <div class="dialogFooter mt30" style="margin-top: 30px">
          <el-button class="btnThemeColor" @click="importKeystore" :loading="loading">{{$t('riskTips.import')}}</el-button>
        </div>
        <div class="select-file">
          <el-tooltip :content="$t('account.keystoreFromFile')" effect="light" placement="top">
            <el-button class="button" icon="el-icon-download" size="small" circle  @click="openFileDialog"></el-button>
          </el-tooltip>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import navMenu from "./components/navMenu";
import mainHeader from "./components/mainHeader";
import tip from "./components/tip";
import smallTip from "./components/smallTip";
import * as accountDB from "../modules/db/account";
import { initContract } from "./contract";
import { createRandomColor } from "./utils";
import * as api from "../api";
import vuexData from "./mixins/vuexData";
import { ipcRenderer } from "electron";
import { Message } from "element-ui";
import bitcoin from "bitcoinjs-lib";
import bip39 from "bip39";
import { tokenInterface } from "./const/token";
const fs = require("fs-extra");
const { dialog } = require("electron").remote;
export default {
  name: "nerthus-wallet",
  components: {
    [navMenu.name]: navMenu,
    [mainHeader.name]: mainHeader,
    [tip.name]: tip,
    [smallTip.name]: smallTip
  },
  data() {
    return {
      importMnemonicsDialogVisible: false,
      importKeystoreDialogVisible: false,
      wordsForm: {
        text: "",
        path: "m/44'/60'/0'/0/0",
        password: "",
        repeatPassword: ""
      },
      keystoreForm: {
        text: "",
        oldPassword: "",
        newPassword: ""
      },
      isInit: false,
      smallTip: false,
      positionX: 0,
      positionY: 0,

      loading: false
    };
  },
  computed: {
    isSamePwd() {
      return this.wordsForm.password === this.wordsForm.repeatPassword;
    },
    isLegalLengthPwd() {
      return this.wordsForm.password.length >= 6;
    },
    checkMnemonics() {
      let rgx = /^[A-Za-z ]{24,128}$/;
      if (!rgx.test(this.wordsForm.text)) return false;
      else
        return (
          this.wordsForm.text.replace(/\s+/g, " ").split(" ").length === 12
        );
    },
    accounts() {
      return this.$store.getters.accounts;
    }
  },
  watch: {
    importMnemonicsDialogVisible(v) {
      if (!v) {
        setTimeout(() => {
          this.wordsForm.text = "";
          this.wordsForm.password = "";
          this.wordsForm.repeatPassword = "";
        }, 300);
      }
    },
    "$i18n.locale"() {
      this.init();
    },
    "$store.getters.curAccount"() {
      if (this.$store.getters.curAccount.name) {
        this.$store.dispatch("account/getCurAccountChainHeight");
      }
    }
  },
  mixins: [vuexData],
  methods: {
    openFileDialog() {
      dialog.showOpenDialog(
        {
          properties: ["openFile"],
          message: "导入keystore"
        },
        async filePaths => {
          if (!filePaths) return;
          this.keystoreForm.text = await fs.readFile(filePaths[0], "utf8");
        }
      );
    },
    async importFromWords() {
      if (!this.isLegalLengthPwd)
        return Message.error(this.$t("account.pwdLength"));
      if (!this.isSamePwd) return Message.error(this.$t("account.pwdDiffer"));
      if (!this.checkMnemonics)
        return Message.error(this.$t("riskTips.checkSpace"));
      let words = this.wordsForm.text
        .split(" ")
        .filter(i => i !== "")
        .join(" ");
      let seed = bip39.mnemonicToSeed(words);
      let root = bitcoin.bip32.fromSeed(seed);
      let privateKey = Array.from(
        root.derivePath("m/44'/60'/0'/0/0").privateKey
      )
        .map(i => i.toString("16").padStart(2, "0"))
        .join("");
      let { code, result } = await api.importRawKey(
        privateKey,
        this.wordsForm.password
      );
      if (code === api.SUCCESS) {
        Message.success(this.$t("account.importAccountSuccess"));
        this.reloadAccount();
        this.importMnemonicsDialogVisible = false;
      } else {
        Message.error(result);
      }
    },
    async importKeystore() {
      this.loading = true;
      // 检查密码
      if (this.keystoreForm.newPassword < 6) {
        this.loading = false
        Message.error(this.$t("account.pwdLength"));
        return
      }
      // 检查keystore
      let keystore;
      try {
        keystore = JSON.stringify(JSON.parse(this.keystoreForm.text));
      } catch (e) {
        this.loading = false;
        return Message.error(this.$t("account.keystoreIllegal"));
      }
      let { code, result } = await api.importKeystore(
        keystore,
        this.keystoreForm.oldPassword,
        this.keystoreForm.newPassword
      );
      if (code === api.SUCCESS) {
        setTimeout(async () => {
          Message.success(this.$t("account.importAccountSuccess"));
          // todo 抽离姓名
          await accountDB.insert(
            result,
            result.slice(0, 8),
            createRandomColor()
          );
          this.reloadAccount();
          this.importKeystoreDialogVisible = false;
          this.loading = false;
        }, 500);
      } else {
        this.loading = false;
        Message.error(result);
      }
    },
    setTimer() {
      setTimeout(() => {
        this.$store.dispatch("account/getBalances");
        this.$store.dispatch("system/getConsensualConfig");
        this.$store.dispatch("account/getAccountStatus");
        this.$store.dispatch("system/getSysWitnessAddress");
        this.getChainHeight();
        this.setTimer();
      }, 5000);
    },
    initAccountDB(accountAddresses) {
      return new Promise(resolve => {
        if (accountAddresses.length === 0) return resolve();
        accountAddresses.forEach((address, idx) => {
          accountDB
            .insert(
              address,
              address.slice(0, 8),
              createRandomColor()
            )
            .then(() => {
              // 全部插入完成.获取全部账户的信息存储在vuex的accountsByDB中
              if (idx === accountAddresses.length - 1) {
                accountDB.getAccounts().then(accounts => {
                  this.$store.commit("account/set_accounts_by_db", accounts);
                  resolve();
                });
              }
            });
        });
      });
    },
    async getChainHeight() {
      this.$store.dispatch("system/getSystemChainHeight");
      this.$store.dispatch("account/getCurAccountChainHeight");
    },
    async initContract() {
      let { code, result } = await api.getContractInterface();
      let contractArr = JSON.parse(result).concat(tokenInterface);
      if (code === api.SUCCESS) initContract(contractArr);
      else console.error(result);
    },
    async reloadAccount() {
      this.init();
    },
    async init() {
      // accountDB.removeAll()
      let accounts = await this.$store.dispatch("account/getAccountAddresses");
      await this.initAccountDB(accounts);
      await Promise.all([
        this.$store.dispatch("system/getConsensualConfig"),
        this.$store.dispatch("system/getSysChainAddress")
      ]);
      this.initContract();
      this.$store.dispatch("account/getAccountStatus");
      this.$store.dispatch("system/getSysWitnessAddress");
      this.$store.dispatch("account/getBalances");
      this.$store.dispatch("system/getAdminDatadir");
      this.getChainHeight();
      this.isInit = true;
    },
    addIpcRendererListener() {
      ipcRenderer.on("adminDatadir", (event, type) => {
        ipcRenderer.send(type, this.$store.state.system.adminDatadir);
      });
      ipcRenderer.on("smallTip", (event, data) => {
        this.smallTip = data;
      });
      ipcRenderer.on("backupMnemonic", () => {
        this.importMnemonicsDialogVisible = true;
      });
      ipcRenderer.on("importKeystore", () => {
        this.importKeystoreDialogVisible = true;
        this.keystoreForm.text = "";
        this.keystoreForm.oldPassword = "";
        this.keystoreForm.newPassword = "";
      });
    }
  },
  async mounted() {
    await this.init();
    this.setTimer();
    this.addIpcRendererListener()
  }
};
</script>

<style scoped lang="scss">
.fz12 {
  font-size: 12px;
}
.p1 {
  font-size: 16px;
  margin-bottom: 25px;
}
.mnemonics {
  box-sizing: border-box;
  height: 66px;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  /deep/ .el-form-item__content {
    width: 100%;
    textarea {
      height: 70px;
    }
  }
}
.dialogFooter {
  text-align: center;
  .el-button {
    width: 160px;
  }
}
.smallTip {
  position: fixed;
  bottom: 30px;
  right: 20px;
  z-index: 999;
  user-select: none;
}
.layoutSide {
  position: fixed;
  top: 0;
  bottom: 0;
  background: #272b38;
  padding-top: 110px;
}

.chain-height {
  position: absolute;
  left: 13px;
  bottom: 40px;
  color: #d3d3d3;
  text-align: center;
  li {
    margin-top: 16px;
  }
  .iconfont {
    font-size: 30px;
    &.icon-cf-c {
      font-size: 16px;
    }
  }
  p {
    font-size: 10px;
  }
  .accountChainHeight {
    margin-top: 8px;
  }
}

.layoutContainer {
  position: absolute;
  left: 66px;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  flex-direction: column;
  display: flex;
}

.layoutMain {
  min-width: 710px;
  background: #f3f5f6;
  padding: 30px;
  flex: 1;
  .layoutMainContainer {
    background: #fff;
    min-height: 500px;
    height: 100%;
  }
}

.tip {
  position: fixed;
  bottom: 0;
  left: 66px;
  right: 0;
}

.select-file {
  position: absolute;
  top: 88px;
  left: 84px;
  .button {
    padding: 4px;
  }
}
</style>
