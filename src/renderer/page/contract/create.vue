<template>
  <nts-card :title="$t('contract.newContract')">
    <p class="curName">{{$t('contract.creator')}}:
      <avatar class="avatar" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"/>
      {{curAccount.name}}
    </p>
    <div class="container">
      <div class="tab">
        <header class="tab-head">
          <div class="tab-item" :class="{active: curActiveTab === 1}" @click="curActiveTab = 1">
            {{$t('contract.contractCode')}}
          </div>
          <div class="tab-item" :class="{active: curActiveTab === 2}" @click="curActiveTab = 2">
            {{$t('contract.contractByteCode')}}
          </div>
        </header>
        <div class="tab-content">
          <div class="tab-item-content" v-show="curActiveTab === 1">
            <codemirror v-model="code" :options="cmOptions" @input="onCmCodeChange"
                        placeholder="Solidity Code goes here..." class="fz12"/>
          </div>
          <div class="tab-item-content" v-show="curActiveTab === 2">
            <textarea class="bytecode" v-model="byteCode"/>
          </div>
        </div>
        <div class="btn">
          <el-button class="btnThemeColor"  @click="deploy">
            {{$t('contract.contractDeploy')}}
          </el-button>
        </div>
      </div>
      <div class="side" v-show="curActiveTab === 1">
        <div v-if="!showErrors">
          <el-select v-model="curContractName" :placeholder="$t('contract.selectContract')">
            <el-option v-for="(i, key) in contracts" :key="key" :label="key" :value="key"/>
          </el-select>
        </div>
        <div v-if="contractConstructor && curContractName">
          <div class="constructor-item" v-for="i in contractConstructor.inputs">
            <el-input :placeholder="i.type" v-model="deployForm[i.name]">
              <template slot="prepend">{{i.name}}</template>
            </el-input>
          </div>
          <span class="r-title">{{$t('transaction.transactionAmount')}}</span>
          <div class="amountBox">
            <el-input
                :placeholder="contractConstructor.payable ? $t('contract.inputAmount') : $t('contract.NotSupported')"
                v-model="amount"
                class="amount" :disabled="!contractConstructor.payable" slot="append">
              <el-select v-model="unit" slot="append" class="chooseUnit">
                <el-option label="NTS" value="NTS"></el-option>
                <el-option label="DOT" value="DOT"></el-option>
              </el-select>
            </el-input>
          </div>
        </div>
        <div v-for="error in compileError">
          <el-alert title="" class="errorMsg" :type="isErrorType(error) ? 'error' : 'warning'" :closable="false">
            <pre>{{error.formattedMessage.slice(9)}}</pre>
          </el-alert>
        </div>
      </div>
    </div>


    <transaction-dialog v-model="transactionDialogVisible"
                        :amount-label="$t('transaction.amount')"
                        :amount="amountInputUnit"
                        :errorMsg="errorMsg"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        @submit="sendTransaction"/>

  </nts-card>
</template>

<script>
import { ipcRenderer } from "electron";
import card from "../../components/card";
import avatar from "../../components/avatar";
import debounce from "lodash/debounce";
import vuexData from "../../mixins/vuexData";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import { Message } from "element-ui";
import transactionDialog from "../../components/dialog/transactionDialog";
import { getTx, toDotBN, toNtsBN } from "../../utils";
import * as api from "../../../api/index";
import * as contractDB from "../../../modules/db/contract";

const web3 = new Web3();

const DEPLOY = 1;

const DEPLOY_CONTRACT_PREFIX = "0x09e46464";

export default {
  name: "contractCreate",
  components: {
    codemirror,
    [card.name]: card,
    [avatar.name]: avatar,
    [transactionDialog.name]: transactionDialog
  },
  data() {
    return {
      unit: "NTS",
      curActiveTab: 1,
      code: "",
      byteCode: "",
      errorMsg: "",
      curContractName: "",
      contracts: {},

      contract: null,

      cmOptions: {
        tabSize: 2,
        lineNumbers: true
      },
      compileError: [],

      deployForm: {},
      abi: "",
      transactionDialogVisible: false,
      transactionNeedGas: 0,
      gettingNeedGas: false,
      amount: "0"
    };
  },
  computed: {
    amountInputUnit() {
      return this.unit === "DOT" ? toNtsBN(this.amount) : this.amount;
    },
    select_contract() {
      return this.contracts[this.curContractName];
    },
    contractConstructor() {
      if (this.contract === undefined || this.contract === null) return;
      return this.contract.options.jsonInterface.filter(i => {
        return i.type === "constructor";
      })[0];
    },
    canDeploy() {
      return this.select_contract !== undefined && this.curAccount.balance;
    },
    isIntNumber() {
      if (this.unit === "DOT") {
        const intNumberReg = /^\d+$/;
        return intNumberReg.test(this.amount);
      }
      return true;
    },
    isLegalAmount() {
      const floatNumberReg = /^(\d+\.)?\d{1,12}$/;
      const intNumberReg = /^\d+$/;
      if (floatNumberReg.test(this.amount)) return true;
      else return intNumberReg.test(this.amount);
    },
    showErrors() {
      for (let i = 0; i < this.compileError.length; i++) {
        let { type } = this.compileError[i];
        if (type.toLowerCase().includes("error")) return true;
      }
      return false;
    }
  },
  watch: {
    curContractName() {
      if (this.select_contract && this.select_contract.abi) {
        this.contract = new web3.nts.Contract(this.select_contract.abi);
        this.byteCode = this.select_contract.evm.bytecode.object;
      }
    },
    contractConstructor(nc) {
      this.deployForm = {};
      if (!nc) return;
      nc.inputs.forEach(i => {
        this.$set(this.deployForm, i.name, "");
      });
    }
  },
  mixins: [vuexData],
  methods: {
    compile: debounce(function() {
      ipcRenderer.send("compile", this.code);
    }, 600),

    onCmCodeChange() {
      if (this.code === "") {
        this.compileError = [];
      } else {
        this.compile();
      }
    },

    clickByteCodeItem() {
      if (!this.select_contract) return;
      this.curActiveTab = 2;
    },

    formatErrorMsg(errors) {
      return errors.map(e => {
        return {
          type: e.match(/:(\s+)(\w+):/)[2],
          msg: e
        };
      });
    },

    isErrorType(errMsg) {
      return /error/i.test(errMsg.type);
    },

    solidityDeploy() {
      if (
        this.contractConstructor &&
        this.contractConstructor.payable &&
        !this.isLegalAmount
      ) {
        Message.error(this.$t("transaction.amountIllegal"));
        return false;
      }
      if (!this.isIntNumber) {
        Message.error(this.$t("transaction.isIntNumber"));
        return false;
      }
      let amountNumber = toDotBN(this.amountInputUnit).toNumber();

      if (amountNumber > this.curAccount.balance) {
        Message.error(this.$t("account.balanceInsufficient"));
        return;
      }
      // 获取参数
      let params = [];
      for (let key in this.deployForm) {
        if (this.deployForm[key] !== "") {
          params.push(this.deployForm[key]);
        } else {
          Message.error(this.$t("contract.constructorParametersInput"));
          return false;
        }
      }
      // 构造合约实例
      let ints = this.contract.deploy({
        data: this.select_contract.evm.bytecode.object,
        arguments: params
      });
      // 获取合约实例的abi, 可能由于参数不正确会报错,故使用try catch
      try {
        // 部署合约的函数id: 3cb6b6f1
        this.abi = DEPLOY_CONTRACT_PREFIX + ints.encodeABI();
      } catch (e) {
        Message.error(this.$t("contract.constructorParametersError"));
        return false;
      }
      return true;
    },

    byteCodeDeploy() {
      this.abi = DEPLOY_CONTRACT_PREFIX + this.byteCode;
      return true;
    },

    deploy() {
      if (
        (this.curActiveTab === 1 && this.solidityDeploy()) ||
        (this.curActiveTab === 2 && this.byteCodeDeploy())
      ) {
        this.getNeedGas();
        this.transactionDialogVisible = true;
      }
    },

    async sendTransaction(data, dialog) {
      let tx = {
        ...getTx(data.gas, data.gasPrice, data.amount, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.abi
      };
      let { code, result } = await api.sendTransaction(tx, data.password);
      if (code === api.SUCCESS) {
        Message.success(this.$t("contract.contractDeploying"));
        this.saveContractToDB(result);
        dialog.close();
        this.$router.push("/transactionList");
      } else {
        dialog.stopLoading();
        Message.error(`${result}`);
      }
    },

    saveContractToDB(hash) {
      let saveInfo = {
        txHash: hash,
        name: this.curContractName,
        solidityCode: this.code,
        jsonInterface: this.select_contract.abi,
        type: DEPLOY,
        time: Date.now()
      };
      if (Object.keys(this.deployForm).length !== 0) {
        saveInfo = Object.assign(saveInfo, {
          data: JSON.stringify(this.deployForm)
        });
      }
      contractDB.insert(saveInfo);
    },

    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let tx = {
        ...getTx(0, 0, toDotBN(this.amount), 0),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.abi
      };
      let { code, result } = await api.getEstimateGas(tx);
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
      }
      this.gettingNeedGas = false;
    },

    init() {
      ipcRenderer.on("compile", (event, info) => {
        info = JSON.parse(info);
        this.contracts = {};
        this.curContractName = "";
        if (info.errors) {
          this.compileError = info.errors;
        } else {
          this.compileError = [];
        }
        if (info.contracts) {
          for (let key in info.contracts["test.sol"]) {
            this.$set(this.contracts, key, info.contracts["test.sol"][key]);
          }
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped lang="scss">
.chooseUnit {
  /deep/ .el-input {
    height: 38px;
    width: 80px;
  }
}

/deep/ .CodeMirror {
  color: #555 !important;
}

.fz12 {
  /deep/ .CodeMirror-gutter-wrapper {
    font-size: 12px;
    line-height: 1.3;
  }

  /deep/ .CodeMirror-line {
    font-size: 12px;
    line-height: 1.3;
  }
}

.container {
  margin-top: 20px;

  &:after {
    content: "";
    display: block;
    clear: both;
  }
}

.curName {
  display: flex;
  align-items: center;
  line-height: 40px;
}

.avatar {
  margin: 0 10px;
}

.tab {
  width: 70%;
  float: left;

  .tab-head {
    display: flex;
    border: 1px solid #e8eef7;
  }

  .tab-item {
    flex: 1;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border-right: 1px solid #e8eef7;
    border-bottom: 4px solid #fff;
    transition: 0.2s;
    cursor: pointer;

    &:last-child {
      border-right: 0;
    }

    &.active {
      background: #ebfcff;
      border-bottom: 4px solid #96baff;
    }

    &.disable {
      cursor: not-allowed;
    }
  }

  .tab-content {
    border: 1px solid #e8eef7;
    border-top: 0;
  }
}

.side {
  float: left;
  width: 25%;
  margin-left: 20px;

  pre {
    font-size: 13px;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.2;
  }
}

.bytecode {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 13px;
  line-height: 1.2;
  width: 100%;
  box-sizing: border-box;
  border: 0;
  resize: none;
  outline: 0;
  padding: 10px;
  height: 380px;
}

.errorMsg {
  margin-top: 10px;
  padding: 8px 10px;
}

.constructor-item {
  margin-top: 10px;
}

.btn {
  margin-top: 30px;
  padding-bottom: 20px;
}

.constructor-amount-input {
  margin-top: 30px;
}

.r-title {
  font-size: 18px;
  padding: 6px 10px;
  display: inline-block;
  background: #9f9f9f;
  color: #fff;
  margin-top: 30px;
}

.amountBox {
  .amount {
    margin: 20px 0;
    width: 297px;
  }

  .unit {
    font-size: 12px;
    margin-left: 4px;
  }
}
</style>
