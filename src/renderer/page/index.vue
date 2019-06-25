<template>
  <div class="bg">
    <nts-card :title="$t('transaction.totalAmount')" class="bgWhite">
      <p class="total"><span class="totalBalance">{{totalBalance}}</span> NTS</p>
      <p class="accountPreview">{{$t('account.accountPreview')}}</p>
      <account-list/>
      <nts-create-button :text="$t('account.newAccount')" @click="showDialog" class="createBtn"/>
    </nts-card>
    <nts-card :title="$t('transaction.recentTransactions')" class="paddingBt0">
      <transaction-list :list="txList"/>
    </nts-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" center :close-on-click-modal="false">
      <div class="step1" v-if="stepState==='createAccount'">
        <el-form :model="form">
          <el-form-item :label="$t('account.name')" class="elFormItem">
            <el-input v-model="form.curCreateAccountName"/>
            <p v-if="isLegalLengthAccount" class="passwordTip">{{$t('account.isLegalLengthAccount')}}</p>
          </el-form-item>
          <el-form-item :label="$t('account.password')" class="elFormItem">
            <el-input type="password" v-model="form.password" :placeholder="$t('account.pwdLength')" auto-complete="off"
                      class="elInput"/>
          </el-form-item>
          <el-form-item :label="$t('account.passwordConfirm')" class="elFormItem">
            <el-input type="password" v-model="form.repeat_password" auto-complete="off"/>
          </el-form-item>
        </el-form>
        <div class="dialogFooter mt30">
          <el-button class="btnThemeColor" :loading="loading" @click="submit">{{$t('account.yes')}}</el-button>
        </div>
      </div>

      <div class="step2" v-else-if="stepState==='preGetMnemonic'">
        <h4 class="p1">{{$t('riskTips.toCheckMnemonic')}}</h4>
        <p class="p2">{{$t('riskTips.MnemonicNote')}}</p>
        <div  style="text-align: right">
          <el-button @click="stepState='applyWitness'">{{$t('riskTips.jump')}}</el-button>
          <el-button class="btnThemeColor" :loading="loading" @click="stepState='getMnemonic'">{{$t('riskTips.checkMnemonic')}}</el-button>
        </div>
      </div>

      <div class="step3" v-else-if="stepState==='getMnemonic'">
        <h4 class="p1">{{$t('riskTips.copyMnemonic')}}</h4>
        <p class="p2">{{$t('riskTips.copyMnemonicNote')}}</p>
        <div class="mnemonics">
          <span v-for="item in mnemonics">{{item}}</span>
        </div>
        <div class="dialogFooter mt30">
          <el-button class="btnThemeColor" :loading="loading" @click="toTestMnemonics">{{$t('riskTips.next')}}</el-button>
        </div>
      </div>

      <div class="step4" v-else-if="stepState==='testMnemonic'">
        <i class="iconfont icon-fanhui back" @click="goBack"></i>
        <h4 class="p1">{{$t('riskTips.inputAccountMnemonic')}}</h4>
        <p class="p2">{{$t('riskTips.pleaseOrder')}}</p>
        <div class="mnemonics-box">
          <span v-for="i in selectedMnemonics" @click="removeSelectedMnemonics(i)">{{i}}</span>
        </div>
        <div class="select-box">
          <span class="canNotChoose" v-for="item in mnemonicsSelectOption" :class="{unselected: item.isSelected}"
                 @click="setSelectedMnemonics(item)">{{item.text}}</span>
        </div>
        <div class="dialogFooter">
          <el-button :class={btnThemeColor:canSubmit} :loading="loading" :disabled="!canSubmit" @click="checkMnemonics">
            {{$t('account.yes')}}
          </el-button>
        </div>
      </div>

      <div class="step5" v-else-if="stepState==='applyWitness'">
        <!--<h4 class="p1">{{$t('riskTips.applyWitness')}}</h4>-->
        <!--<p class="words"></p>-->
        <p class="words">{{$t('riskTips.needWitness')}}{{newAccountName}}{{$t('account.noWitnessTips')}}</p>
        <div  style="text-align: center">
          <!--<el-button @click="dialogVisible=false">{{$t('riskTips.iKnow')}}</el-button>-->
          <el-button class="btnThemeColor confirmBtn" @click="toApplyWitness">{{$t('account.toApply')}}</el-button>
          <!--<el-button class="btnThemeColor" :loading="loading" @click="stepState='toApplyWitness'">{{$t('account.yes')}}</el-button>-->
        </div>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import card from "../components/card";
import accountList from "../components/accountList";
import transactionList from "../components/transactionList";
import createButton from "../components/createButton";
import transactionDialog from "../components/dialog/transactionDialog";
import { Message } from "element-ui";
import vuexData from "../mixins/vuexData";
import * as api from "../../api";
import { createRandomColor, toNtsStr } from "../utils";
import * as accountDB from "../../modules/db/account";
import bip39 from "bip39";
import { bip32 } from "bitcoinjs-lib";
import shuffle from "lodash/shuffle";
import * as contractDB from "../../modules/db/contract";

let timer = null;
const web3 = new Web3();

export default {
  name: "index",
  components: {
    [card.name]: card,
    [accountList.name]: accountList,
    [transactionList.name]: transactionList,
    [createButton.name]: createButton,
    [transactionDialog.name]: transactionDialog
  },
  data() {
    return {
      dialogVisible: false,
      curCreateAccountName: "",
      form: {
        curCreateAccountName: "",
        password: "",
        repeat_password: ""
      },
      createdAccountAddress: "",
      // passwordTips: true,
      accountNameTips: false,
      txList: [],
      loading: false,
      newAccountName: "",
      stepState: "createAccount",
      mnemonics: [],
      selectedMnemonics: [],
      mnemonicsSelectOption: [],
      contracts: []
    };
  },
  mixins: [vuexData],

  computed: {
    dialogTitle() {
      switch (this.stepState) {
        case "preGetMnemonic":
          return this.$t("riskTips.checkMnemonic");
        case "getMnemonic":
          return this.$t("riskTips.createMnemonic");
        case "testMnemonic":
          return this.$t("riskTips.inputMnemonic");
        case "applyWitness":
          return this.$t("riskTips.goToApplyWitness");
        default:
          return this.$t("account.newAccount");
      }
    },
    canSubmit() {
      return this.mnemonics.length === this.selectedMnemonics.length;
    },
    accounts() {
      return this.$store.getters.accounts;
    },
    totalBalance() {
      let amount = this.accounts.reduce((sum, cur) => {
        return sum + Number(cur.balance);
      }, 0);
      return isNaN(amount)
        ? this.$t("system.calculateMoney")
        : toNtsStr(amount);
    },
    isSamePwd() {
      return this.form.password === this.form.repeat_password;
    },
    isLegalLengthPwd() {
      return this.form.password.length >= 6;
    },
    isLegalLengthAccount() {
      return this.form.curCreateAccountName.length > 15;
    },
    pwdErrorMsg() {
      let strategies = [
        {
          condition: this.form.curCreateAccountName.trim() === "",
          errorMsg: this.$t("account.mustAccountName")
        },
        {
          condition: this.isLegalLengthAccount,
          errorMsg: this.$t("account.isLegalLengthAccount")
        },
        {
          condition: !this.isLegalLengthPwd,
          errorMsg: this.$t("account.pwdLength")
        },
        {
          condition: !this.isSamePwd,
          errorMsg: this.$t("account.pwdDiffer")
        }
      ];
      let errStrategy = strategies.filter(i => i.condition)[0];
      if (errStrategy) return errStrategy.errorMsg;
    }
  },
  watch: {
    dialogVisible(v) {
      if (!v) {
        setTimeout(() => {
          this.stepState = "createAccount";
          this.mnemonics = [];
          this.selectedMnemonics = [];
          this.mnemonicsSelectOption = [];
        }, 300);
      }
    },
    "$i18n.locale"() {
      this.curCreateAccountName =
        this.$t("account.accountUser") + ` ${this.accounts.length + 1}`;
      this.form.curCreateAccountName =
        this.$t("account.accountUser") + ` ${this.accounts.length + 1}`;
    }
  },
  methods: {
    goBack() {
      this.stepState = "getMnemonic";
      this.selectedMnemonics = [];
    },
    checkMnemonics() {
      if (!this.canSubmit) return;
      if (this.mnemonics.join("") !== this.selectedMnemonics.join("")) {
        return Message.error(this.$t("riskTips.notCorrectMnemonic"));
      }
      Message.success(this.$t("riskTips.correctMnemonic"));
      this.stepState = "applyWitness";
    },
    toTestMnemonics() {
      this.stepState = "testMnemonic";
      this.mnemonicsSelectOption = shuffle(this.mnemonics).map(text => {
        return {
          text,
          isSelected: false
        };
      });
    },
    setSelectedMnemonics(item) {
      item.isSelected = !item.isSelected;
      if (item.isSelected) {
        this.selectedMnemonics.push(item.text);
      } else {
        this.selectedMnemonics.splice(
          this.selectedMnemonics.indexOf(item.text),
          1
        );
      }
    },
    removeSelectedMnemonics(i) {
      let item = this.mnemonicsSelectOption.filter(item => item.text === i)[0];
      item.isSelected = false;
      this.selectedMnemonics.splice(this.selectedMnemonics.indexOf(i), 1);
    },
    toApplyWitness() {
      this.$store.commit(
        "account/set_account_idx",
        this.accountAddresses.length - 1
      );
      this.$router.push(`/witnessManage/${this.createdAccountAddress}`);
    },
    async submit() {
      this.loading = true;
      if (this.pwdErrorMsg) {
        Message.error(this.pwdErrorMsg);
      } else {
        let hasExist = await this.checkNameHasExist();
        if (!hasExist) {
          await this.addAccountAddress();
          this.stepState = "preGetMnemonic";
          // this.dialogVisible = false
          this.resetDialogForm();
        } else {
          Message.error(this.$t("account.sameName"));
        }
      }
      this.loading = false;
    },
    async addAccountAddress() {
      //generateMnemonic
      let words = bip39.generateMnemonic();
      let seed = bip39.mnemonicToSeed(words);
      let root = bip32.fromSeed(seed);
      let privateKey = Array.from(
        root.derivePath("m/44'/60'/0'/0/0").privateKey
      )
        .map(i => i.toString(16).padStart(2, "0"))
        .join("");
      this.mnemonics = words.split(" ");
      //send privateKey
      let { code, result } = await api.importRawKey(
        privateKey,
        this.form.password
      );
      let curName = this.form.curCreateAccountName.trim();
      if (code === api.SUCCESS) {
        this.newAccountName = curName;
        Message.success(
          this.$t("account.newAccount") + curName + this.$t("transaction.pass")
        );
        this.$store.commit("account/add_account_address", result);
        this.createdAccountAddress = result;
        // 保存进数据库
        accountDB.insert(result, curName, createRandomColor()).then(() => {
          // 更新accountsByDB
          accountDB.getAccounts().then(accounts => {
            this.$store.commit("account/set_accounts_by_db", accounts);
            this.$store.dispatch("account/getAccountAddresses");
            // this.$store.commit("account/set_account_addresses", accounts.map(i => i._id));
            // setTimeout(() => {
            // this.NoWitnessTips = true
            // }, 500)
          });
        });
      } else {
        console.error(code, result);
      }
    },
    resetDialogForm() {
      this.form.curCreateAccountName =
        this.$t("account.accountUser") + ` ${this.accounts.length + 1}`;
      this.curCreateAccountName =
        this.$t("account.accountUser") + ` ${this.accounts.length + 1}`;
      this.form.password = "";
      this.form.repeat_password = "";
    },
    showDialog() {
      this.resetDialogForm();
      this.dialogVisible = true;
    },
    async checkNameHasExist() {
      let accounts = this.$store.getters.accounts;
      return !!accounts.find(
        i => i.name === this.form.curCreateAccountName.trim()
      );
    },
    async getTxList() {
      this.contracts = (await contractDB.getContracts())
        .filter(i => !!i.name && !!i.contractAddress)
        .map(i => i.contractAddress);
      if (this.accountAddresses.length === 0) return;
      let { code, result } = await api.getTxList(
        this.contracts.concat(this.accountAddresses),
        "all",
        1,
        10
      );
      if (code === api.SUCCESS) {
        this.txList = result.list || [];
      } else {
        console.error(`## getTxList ##${code}: ${result}`);
      }
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getTxList();
        this.setTimer();
      }, 5000);
    }
  },
  created() {
    this.getTxList();
    this.setTimer();
    this.form.curCreateAccountName =
      this.$t("account.accountUser") + ` ${this.accounts.length + 1}`;
  },
  beforeDestroy() {
    clearTimeout(timer);
  }
};
</script>

<style scoped lang="scss">
.canNotChoose {
  user-select: none;
}
.mt30 {
  margin-top: 30px;
}
.p1 {
  font-size: 16px;
  margin-bottom: 25px;
}
.p2 {
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5em;
}
.back {
  cursor: pointer;
  position: absolute;
  left: 22px;
  top: 22px;
  font-size: 16px;
}
.mnemonics-box {
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  background: rgba(243, 243, 243, 1);
  min-height: 150px;
  span {
    cursor: pointer;
    display: inline-block;
    background: #ffffff;
    padding: 8px;
    font-size: 16px;
    border-radius: 5px;
    margin: 6px;
  }
}

.select-box {
  margin-bottom: 30px;
  span {
    cursor: pointer;
    display: inline-block;
    padding: 8px;
    font-size: 16px;
    margin: 6px;
    &.unselected {
      color: #c3c3c3;
    }
  }
}

.mnemonics {
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 16px;
  background: rgba(243, 243, 243, 1);
  display: flex;
  flex-wrap: wrap;
  span {
    margin: 12px;
  }
  /deep/ .el-form-item__content {
    width: 100%;
    .el-textarea__inner {
      border: 0;
    }
  }
}

.total {
  margin-top: 22px;
  font-size: 12px;
  margin-bottom: 40px;
}

.totalBalance {
  font-size: 22px;
  font-weight: bold;
}

.accountPreview {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  line-height: 2;
  color: rgb(51, 51, 51);
}

.confirmBtn {
  margin-top: 40px;
  width: 160px;
}

.NoWitnessTips {
  text-align: center;
  /deep/ .el-dialog__header {
    padding: 0;
  }
}

.words {
  line-height: 1.6em;
  font-size: 14px;
}

.elInput {
  ::-webkit-input-placeholder {
    color: #c3c3c3;
    font-size: 14px;
  }
}

.passwordTip {
  font-size: 12px;
  color: red;
  height: 20px;
  line-height: 20px;
}

.elFormItem {
  margin-bottom: 12px;
}

.bgWhite {
  background: #fff;
  margin-bottom: 20px !important;
}

.paddingBt0 {
  padding-bottom: 0 !important;
  background: #fff;
}

.bg {
  background: #f3f5f6;
}

.createBtn {
  margin-bottom: 20px;
  margin-top: 30px;
}

.dialog {
  width: 410px;
}

.dialogFooter {
  text-align: center;
  .el-button {
    width: 160px;
  }
}

.el-dialog {
  /deep/ .el-dialog__body {
    padding: 15px 40px 25px;
  }
  .el-dialog__footer {
    padding-bottom: 30px;
    padding-top: 5px;
  }
}
</style>
