<template>
  <div class="container">
    <header>
      <i class="iconfont icon-heyue"></i>
      <div class="header-main">
        <h4>{{info.name}}</h4><span class="backup" @click="ABIVisible = true">ABI</span>
        <p>{{contractBalance | toNts}} <span>NTS</span></p>
        <p>{{info.contractAddress}}
          <el-button @click="copyContactAddress" class="copyContactAddress" size="mini">{{$t('system.copy')}}</el-button>
          <el-button @click="deleteContract" class="copyContactAddress" size="mini">{{$t('token.del')}}</el-button>
        </p>
      </div>
    </header>

    <div class="main">
      <div class="read-container">
        <span class="r-title">{{$t('contract.readContract')}}</span>
        <div class="side">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item, idx) in staticFuncList" :title="item.name" :name="idx">
              <ul class="input-container" v-if="item.inputs && item.inputs.length">
                <li v-for="input in item.inputs">
                  <el-input :placeholder="input.type" size="small" v-model="input.value">
                    <template slot="prepend">{{input.name}}</template>
                  </el-input>
                </li>
                <li>
                  <el-button size="small" class="btn" @click="executeStaticFunc(idx)">{{$t('contract.execute')}}</el-button>
                </li>
              </ul>
              <ul class="output-container" v-if="item.outputs && item.outputs.length">
                <li v-for="(value, key) in staticFuncOutputs[idx]">
                  <span v-if="item.outputs.length > 1">{{key}}: </span>
                  <span>{{value}}</span>
                </li>
              </ul>
            </el-collapse-item>
            <el-collapse-item :title="$t('contract.contractWitness')" name="witness">
              <ul>
                <li v-for="i in witnessList" class="fz12 mb5">{{i}}</li>
              </ul>
              <el-button class="changeWitness fz12"  @click="changeWitness">{{$t('contract.replaceWitness')}}</el-button>
            </el-collapse-item>
          </el-collapse>
          <!--<p> <span class="r-title">{{$t('contract.contractWitness')}}</span></p>-->
          <!--<ul>-->
            <!--<li v-for="i in witnessList">{{i}}</li>-->
          <!--</ul>-->
          <!--<el-button class="changeWitness"  @click="changeWitness">{{$t('contract.replaceWitness')}}</el-button>-->
        </div>
      </div>
      <div class="write-container">
        <span class="r-title">{{$t('contract.contractDeal')}}</span>

        <div class="select-func">
          <el-select v-model="curFuncName" :placeholder="$t('contract.curFuncName')">
            <el-option v-for="i in funcList" :key="i.name" :label="i.name" :value="i.name"/>
          </el-select>

          <ul v-if="curFunc.inputs && curFunc.inputs.length">
            <li v-for="i in curFunc.inputs">
              <el-input :placeholder="i.type" v-model="funcParams[i.name]">
                <template slot="prepend">{{i.name}}</template>
              </el-input>
            </li>
          </ul>
        </div>

        <div class="amountBox" v-if="curFunc.payable">
          <span class="r-title">{{$t('transaction.transactionAmount')}}</span>
          <div class="amount">
            <el-input :placeholder="$t('transaction.amount')" v-model="amount" class="input-with-select">
              <el-select v-model="unit" slot="append">
                <el-option label="NTS" value="NTS"></el-option>
                <el-option label="DOT" value="DOT"></el-option>
              </el-select>
            </el-input>
          <p class="unitNote">(1NTS=10¹²DOT)</p>
          </div>
          <p class="illegalTips">{{isShowTips}}</p>
        </div>

        <div class="execute-func">
          <p class="execute-address">{{$t('contract.operator')}}:
            <avatar class="avatar" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"/>
            {{curAccount.name}}
          </p>
          <el-button class="btnThemeColor" :class="{btnOpacity:!canExecute}" @click="execute" :disabled="!canExecute"
                     :loading="loading">{{$t('contract.execute')}}
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog title="Contract ABI" width="40%" :visible.sync="ABIVisible" center>
      <div>
        <el-input class="abiInput" type="textarea" v-model="jsonInterface" :rows="12" readonly></el-input>
      </div>
      <div slot="footer">
        <el-button  class="btnThemeColor copyBtn" @click="copyInterface">{{$t('system.copy')}}</el-button>
      </div>
    </el-dialog>

    <transaction-dialog v-model="transactionDialogVisible"
                        :amount="amountInputUnit"
                        :amount-label="$t('transaction.transactionAmount')"
                        :canModifyAmount="false"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        :errorMsg="errorMsg"
                        @submit="sendTransaction"/>

    <witness-dialog v-model="witnessDialogVisible"
                    :transaction-need-gas="replaceTransactionNeedGas"
                    @submit="sendWitnessPow"
    />
  </div>
</template>

<script>
import { clipboard } from "electron";
import vuexData from "../../mixins/vuexData";
import * as api from "../../../api";
import transactionDialog from "../../components/dialog/transactionDialog";
import witnessDialog from "../../components/dialog/witnessDialog";
import avatar from "../../components/avatar";
import * as contractDB from "../../../modules/db/contract";
import { MessageBox } from "element-ui";
import {
  getTx,
  toNtsBN,
  checkParameterOfContractMethodIsArray,
  toDotBN,
  toBigNumber
} from "../../utils";
import { Message } from "element-ui";
import { web3 } from "../../main";

export default {
  name: "detail",
  components: {
    [transactionDialog.name]: transactionDialog,
    [avatar.name]: avatar,
    [witnessDialog.name]: witnessDialog
  },
  data() {
    return {
      unit: "NTS",
      errorMsg: "",
      info: {},
      contract: {},
      curFuncName: "",
      funcParams: {},

      functionList: [],

      oldActiveNames: [],
      activeNames: [],

      curStaticFunc: null,
      staticFuncOutputs: [],

      abi: "",
      transactionNeedGas: 0,
      loading: false,

      transactionDialogVisible: false,
      gettingNeedGas: false,
      witnessDialogVisible: false,
      ABIVisible: false,

      amount: "0",

      contractBalance: 0,
      witnessList: [],
      replaceTransactionNeedGas: 0,

      jsonInterface: "",
      curClickTime: "",
      illegalTips: ""
    };
  },
  mixins: [vuexData],
  watch: {
    curFunc(f) {
      if (!f.inputs) return;
      this.funcParams = {};
      f.inputs.forEach(i => {
        this.$set(this.funcParams, i.name, "");
      });
      this.amount = "0";
    }
  },
  computed: {
    isShowTips() {
      let AmountErrStrategy = [
        {
          condition: !this.isIntNumber,
          error: this.$t("transaction.isIntNumber")
        },
        {
          condition: !this.isLegalNumber,
          error: this.$t("transaction.amountIllegal")
        },
        {
          condition: !this.isLegalAmount,
          error: this.$t("transaction.floatIllegal")
        },
        {
          condition: !this.enoughBalance,
          error: this.$t("transaction.amountInsufficient")
        }
      ].filter(i => i.condition)[0];
      if (AmountErrStrategy) {
        return AmountErrStrategy.error;
      }
    },
    enoughBalance() {
      return !toBigNumber(this.$store.getters.curAccount.balance).lt(
        toDotBN(this.amountInputUnit)
      );
    },
    amountInputUnit() {
      return this.unit === "DOT" ? toNtsBN(this.amount) : this.amount;
    },
    funcList() {
      if (!this.contract._jsonInterface) return [];
      return this.functionList.filter(i => i.stateMutability !== "view" && i.stateMutability !== "pure");
    },
    staticFuncList() {
      if (!this.contract._jsonInterface) return [];
      return this.functionList.filter(i => i.stateMutability === "view" || i.stateMutability === "pure");
    },
    curFunc() {
      return this.funcList.filter(i => i.name === this.curFuncName)[0] || {};
    },
    isLegalAmount() {
      if (this.unit === "NTS") {
        const floatNumberReg = /^(\d+\.)?\d{1,12}$/;
        const intNumberReg = /^\d+$/;
        return (
          floatNumberReg.test(this.amount) || intNumberReg.test(this.amount)
        );
      }
      return true;
    },
    isLegalNumber() {
      if (this.unit === "NTS") {
        const NumberReg = /^\d+(\.\d+)?$/;
        return NumberReg.test(this.amount);
      }
      return true;
    },
    isIntNumber() {
      if (this.unit === "DOT") {
        const intNumberReg = /^\d+$/;
        return intNumberReg.test(this.amount);
      }
      return true;
    },
    canExecute() {
      return (
        this.curFuncName !== "" &&
        this.isLegalAmount &&
        this.isIntNumber &&
        this.isLegalNumber &&
        this.enoughBalance
      );
    }
  },
  methods: {
    async handleChange(actives) {
      let curIdx = this.getCurClickIdx(actives);
      this.oldActiveNames = actives.slice();
      // -1 代表是点击收缩   witness 代表点击合约见证人
      if (curIdx === -1 || curIdx === "witness") return;
      this.curStaticFunc = this.staticFuncList[curIdx];
      if (this.curStaticFunc.inputs.length) return;
      let curStaticFuncName = this.curStaticFunc.name;
      try {
        let result = await this.contract.methods[curStaticFuncName]().call({
          from: this.curAccount.address
        });
        let outputResult = {};
        if (typeof result === "object") {
          for (let k in result) {
            if (result.hasOwnProperty(k)) {
              if (/^\d+$/g.test(k)) continue;
              outputResult[k] = result[k];
            }
          }
        } else {
          outputResult = {
            r1: result
          };
        }
        this.$set(this.staticFuncOutputs, curIdx, outputResult);
      } catch (e) {
        return Message({
          message: e.toString(),
          type: "error",
          duration: 6000
        });
      }
    },
    async executeStaticFunc(idx) {
      let curFunc = this.staticFuncList[idx];
      let params;
      try {
        params = curFunc.inputs.map(i => {
          return checkParameterOfContractMethodIsArray(i.type)
            ? JSON.parse(i.value)
            : i.value;
        });
        let result = await this.contract.methods[curFunc.name](...params).call({
          from: this.curAccount.address
        });
        let outputResult = {};
        if (typeof result === "object") {
          for (let k in result) {
            if (result.hasOwnProperty(k)) {
              if (/^\d+$/g.test(k)) continue;
              outputResult[k] = result[k];
            }
          }
        } else {
          outputResult = {
            r1: result
          };
        }
        this.$set(this.staticFuncOutputs, idx, outputResult);
      } catch (e) {
        return Message({
          message: e.toString(),
          type: "error",
          duration: 6000
        });
      }
    },
    getCurClickIdx(actives) {
      let curIdx = actives.filter(i => !this.oldActiveNames.includes(i))[0];
      return curIdx === undefined ? -1 : curIdx;
    },
    changeWitness() {
      this.curClickTime = Date.now();
      let lastClickTimeValue = window.localStorage.getItem(
        "contractAddressLastClick"
      )
        ? JSON.parse(window.localStorage.getItem("contractAddressLastClick"))[
            this.info.contractAddress
          ]
        : this.curClickTime - 60 * 1000 * 10 - 1000;
      let lastClickTime = lastClickTimeValue || this.info.time;
      if (this.curClickTime - lastClickTime > 60 * 1000 * 10) {
        this.witnessDialogVisible = true;
      } else {
        Message.error(this.$t("account.witnessChangeDelay"));
      }
    },
    async execute() {
      this.loading = true;
      let params = this.getInputParams();
      if (!params) return false;
      this.abi = this.getExecuteAbi(params);
      if (!this.abi) return false;
      await this.getNeedGas();
      this.loading = false;
      this.transactionDialogVisible = true;
    },
    getInputParams() {
      let params = [];
      for (let i = 0; i < this.curFunc.inputs.length; i++) {
        let input = this.curFunc.inputs[i];
        try {
          params.push(
            checkParameterOfContractMethodIsArray(input.type)
              ? JSON.parse(this.funcParams[input.name])
              : this.funcParams[input.name]
          );
        } catch (e) {
          Message({
            message: e.toString(),
            type: "error",
            duration: 6000
          });
          this.loading = false;
          return false;
        }
      }
      return params;
    },
    getExecuteAbi(params) {
      let abi;
      try {
        abi = this.contract.methods[this.curFuncName](...params).encodeABI();
      } catch (e) {
        Message({
          message: e.toString(),
          type: "error",
          duration: 6000
        });
        this.loading = false;
        return false;
      }
      return abi;
    },
    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let tx = {
        ...getTx(0, 0, toDotBN(this.amountInputUnit), 0),
        from: this.curAccount.address,
        to: this.info.contractAddress,
        data: this.abi
      };
      const { code, result } = await api.getEstimateGas(tx);
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
        // Message.error(`${code},${result}`)
      }
      this.gettingNeedGas = false;
    },
    async sendTransaction(data, dialog) {
      const tx = {
        ...getTx(data.gas, data.gasPrice, data.amount, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.info.contractAddress,
        data: this.abi
      };
      const { code, result } = await api.sendTransaction(tx, data.password);
      if (code === api.SUCCESS) {
        dialog.close();
        Message.success(this.$t("contract.sendTransaction"));
        this.$router.push("/transactionList");
      } else {
        dialog.stopLoading();
        Message.error(`${result}`);
      }
    },
    async getContractBalance() {
      const { code, result } = await api.getBalances([
        this.info.contractAddress
      ]);
      if (code === api.SUCCESS)
        this.contractBalance = result[this.info.contractAddress];
      else Message.error(`${result}`);
    },
    async getWitnessList() {
      const { code, result } = await api.getAccountWitnessList(
        this.info.contractAddress
      );
      if (code === api.SUCCESS) {
        this.witnessList = result;
      } else {
        Message.error(`${result}`);
      }
    },
    async sendWitnessPow(data, dialog) {
      const { code, result } = await api.sendWitnessPow(
        this.curAccount.address,
        this.info.contractAddress,
        data.password
      );
      if (code === api.SUCCESS) {
        dialog.close();
        Message.success(this.$t("account.messageSent"));
        let clickTimeInfo =
          JSON.parse(window.localStorage.getItem("contractAddressLastClick")) ||
          {};
        clickTimeInfo[this.info.contractAddress] = Date.now();
        window.localStorage.setItem(
          "contractAddressLastClick",
          JSON.stringify(clickTimeInfo)
        );
      } else {
        Message.error(`${result}`);
        dialog.stopLoading();
      }
    },
    copyInterface() {
      clipboard.writeText(this.jsonInterface, "selection");
      Message.success(this.$t("system.copySuccess"));
    },
    copyContactAddress() {
      clipboard.writeText(this.info.contractAddress, "selection");
      Message.success(this.$t("system.copySuccess"));
    },
    async deleteContract() {
      try {
        await MessageBox.confirm(
          this.$t("riskTips.delContract"),
          this.$t("riskTips.tips"),
          {
            confirmButtonText: this.$t("account.yes"),
            cancelButtonText: this.$t("riskTips.cancel"),
            confirmButtonClass: "delConfirmBtn",
            type: "warning"
          }
        );
        await contractDB.remove(this.info._id);
        this.$router.go(-1);
      } catch (e) {
        console.log("No");
      }
    }
  },
  async created() {
    this.info = await contractDB.getContract({
      contractAddress: this.$route.params.hash,
      type: Number(this.$route.params.type)
    });
    this.getContractBalance();
    this.getWitnessList();
    this.contract = new web3.nts.Contract(
      this.info.jsonInterface,
      this.$route.params.hash
    );
    this.functionList = this.contract._jsonInterface
      .filter(i => i.type === "function")
      .map(i => {
        return {
          ...i,
          inputs: i.inputs.map(input => ({ ...input, value: "" })),
          outputs: i.outputs.map(output => ({ ...output, value: "" }))
        };
      });
    this.jsonInterface = JSON.stringify(this.info.jsonInterface).trim();
  }
};
</script>

<style scoped lang="scss">
.mb5 {
  margin-bottom: 4px;
}
.fz12 {
  color: #777;
  font-size: 12px !important;
}
.illegalTips {
  font-size: 12px;
  color: #f56c6c;
  position: absolute;
  margin-top: -22px;
}
.input-with-select {
  width: 60%;
}
.unitNote {
  color: #777;
  margin-left: 10px;
  font-size: 12px;
}
.el-input-group .el-select {
  /deep/ .el-input {
    width: 80px;
  }
}
.copyBtn {
  width: 160px;
}
.copyContactAddress {
  margin-left: 10px;
  padding: 20px auto;
}
@import "../../styles/index";
.btnOpacity {
  opacity: 0.5;
}

.container {
  background: #fff;
  padding: 20px 30px;
}

header {
  color: #414141;
  display: flex;
  margin-top: 20px;
  align-items: center;
}

.header-main {
  margin-left: 14px;
  h4 {
    font-size: 22px;
    display: inline;
  }
  p {
    margin-top: 14px;
    &:first-child {
      font-weight: bold;
    }
    &:last-child {
      font-size: 13px;
      color: #777;
    }
  }
}

.icon-heyue {
  font-size: 60px;
}

.main {
  display: flex;
  margin-top: 80px;
}

.read-container {
  width: 60%;
}

.write-container {
  width: 35%;
  margin-left: 20px;
}

.r-title {
  font-size: 18px;
  padding: 6px 10px;
  display: inline-block;
  background: #9f9f9f;
  color: #fff;
}

.select-func {
  margin: 14px 0 30px 0;
  color: #6b6d71;
  p {
    margin: 10px 0;
  }
  ul {
    li {
      margin-top: 14px;
    }
  }
}

.select {
  margin: 0 5px;
}

.execute-address {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  .avatar {
    margin: 0 6px;
  }
}

.amountBox {
  .amount {
    margin: 30px 0;
    display: flex;
    align-items: baseline;
    /*width: 200px;*/
  }
  .unit {
    font-size: 14px;
    margin-left: 10px;
  }
}

.side {
  margin-top: 15px;
  margin-right: 100px;
  /*p {*/
  /*margin-bottom: 26px;*/
  /*font-weight: bold;*/
  /*}*/
  /*ul {*/
  /*margin-left: 6px;*/
  /*}*/
  /*li {*/
  /*color: #777;*/
  /*font-size: 14px;*/
  /*& + li {*/
  /*margin-top: 14px;*/
  /*}*/
  /*}*/
}

.changeWitness {
  color: #777;
  margin-top: 22px;
  font-size: 14px;
}

.backup {
  display: inline-block;
  position: relative;
  top: -2px;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  margin-left: 20px;
  border: 1px solid #c3c3c3;
  color: #777;
  padding: 0 10px;
  border-radius: 6px;
  font-weight: normal;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: $themeColor;
    border: 1px solid $themeColor;
  }
}

.abiInput {
  font-size: 14px;
  color: #333333;
}

.input-container {
  /*width: 90%;*/
  /*margin: 0 auto;*/

  .btn {
    margin-top: 6px;
  }
  li {
    & + li {
      margin-top: 6px;
    }
    &:last-child {
      text-align: right;
    }
  }
}
</style>
