<template>
  <nts-card :title="$t('transaction.transactionTransfer')">
    <div class="container">

      <el-row class="row">
        <el-col :span="10">
          <p class="label">{{$t('system.from')}}</p>
          <p class="curName">
            <avatar size="middle" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"/>
            <span>{{curAccount.name}}</span>
          </p>
        </el-col>
        <el-col :span="10" :offset="4">
          <p class="label">{{$t('system.to')}}</p>
          <el-input v-model="form.to" :placeholder="$t('transaction.validAddress')"/>
          <div class="illegalTips">{{illegalAddressTips}}</div>
        </el-col>
      </el-row>

      <el-row class="mb25">
        <el-col :span="10"  v-if="!isTokenCoin">
          <p class="label">{{$t('transaction.sum')}}
            <span class="unitNote">(1NTS=10¹²DOT)</span>
          </p>
          <div>
            <el-input :placeholder="$t('transaction.amount')" v-model="form.amount" class="input-with-select">
              <el-select v-model="unit" slot="append" class="chooseUnit">
                <el-option label="NTS" value="NTS"></el-option>
                <el-option label="DOT" value="DOT"></el-option>
              </el-select>
            </el-input>
            <div class="illegalTips">{{illegalAmountTips}}</div>
          </div>
        </el-col>
        <el-col :span="10" v-else>
          <p class="label">TOKEN</p>
          <div>
            <el-input :placeholder="$t('transaction.amount')" v-model="tokenAmount" class="input-with-select">
            </el-input>
            <div class="illegalTips">{{illegalTokenTips}}</div>
          </div>
        </el-col>
        <el-col :span="10" :offset="4">
          <p class="label">{{$t('account.accountAssets')}}</p>
          <template>
            <el-table
              :row-style="{height:'40px'}"
              :show-header="false"
              ref="singleTable"
              :data="tokenCoin"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%;cursor: pointer;">
              <el-table-column
                property="name"
                label="币种"
                width="120">
              </el-table-column>
              <el-table-column class="tokenAmount" :span="10">
                <template slot-scope="scope">
                  <div style="float: right;">
                    <span >{{scope.row.balance}}</span>
                    <span >{{scope.row.symbol}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-col>
      </el-row>

      <el-row class="row">
        <el-col :span="10" :class={noteHide:isTokenCoin}>
          <!--<span class="more" @click="toggleMore">{{moreText}} <i :class="moreIconClass"></i></span>-->
          <div class="moreInput">
            <!--<transition name="sliderDown">-->
            <!--<div v-if="more">-->
            <p class="label">{{$t('system.note')}}</p>
            <el-input type="textarea" v-model="form.textarea" :placeholder="$t('transaction.description')"/>
            <!--</div>-->
            <!--</transition>-->
          </div>
        </el-col>
      </el-row>

      <el-button class="btnThemeColor sendBtn" @click="handleSendBtn">{{$t('system.send')}}</el-button>
    </div>

    <transaction-dialog v-model="transactionDialogVisible"
                        :amount="isTokenCoin?0:amountInputUnit"
                        :amount-label="$t('transaction.amount')"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        :errorMsg="errorMsg"
                        @submit="sendTransaction"/>
  </nts-card>
</template>
<script>
import card from "../components/card";
import transactionDialog from "../components/dialog/transactionDialog";
import avatar from "../components/avatar";

import {
  getTx,
  isNumber,
  toDotBN,
  toNtsBN,
  toNtsStr,
  toBigNumber
} from "../utils";
import vuexData from "../mixins/vuexData";
import { Message } from "element-ui";
import * as api from "../../api";
import { getTransactionABI } from "../contract";
import { type as SysTpye } from "../const/system";
import * as tokenCoinDB from "../../modules/db/tokenCoin";
import { tokenInterface } from "../const/token";
import { web3 } from "../main";
let timer;
export default {
  name: "sendTransaction",
  components: {
    [card.name]: card,
    [transactionDialog.name]: transactionDialog,
    [avatar.name]: avatar
  },
  mixins: [vuexData],
  data() {
    return {
      tokenAmount: "",
      currentRow: null,
      unit: "NTS",
      form: {
        to: "",
        amount: "",
        textarea: ""
      },
      more: false,
      errorMsg: "",
      transactionNeedGas: 0,
      transactionDialogVisible: false,
      gettingNeedGas: false,
      illegalAmountTips: "",
      illegalAddressTips: "",
      illegalAmountFlag: true,
      illegalAddressFlag: true,
      tokenItem: "NTS",
      tokenillegal: false,
      illegalTokenTips: "",
      tokenCoin: [
        {
          name: "NTS",
          address: "NTS",
          balance: "",
          symbol: "NTS",
          decimals: 1,
          time: 0
        }
      ]
    };
  },
  computed: {
    checkTokenInt() {
      const intNumberReg = /^\d+(\.\d+)?$/;
      return intNumberReg.test(this.tokenAmount);
    },
    isLegalToken() {
      let decimals = this.currentRow.decimals;
      const floatNumberReg = new RegExp(
        "^-?\\d+(\\.\\d{0," + decimals + "})?$"
      );
      return floatNumberReg.test(this.tokenAmount);
    },
    checkTokenAmount() {
      return toBigNumber(this.tokenAmount).isLessThanOrEqualTo(
        toBigNumber(this.currentRow.balance.replace(/[^\d\.-]/g, ""))
      );
    },
    isTokenCoin() {
      return this.currentRow && this.currentRow.address !== "NTS";
    },
    amountInputUnit() {
      return this.unit === "DOT" ? toNtsBN(this.form.amount) : this.form.amount;
    },
    moreIconClass() {
      return this.more ? "el-icon-arrow-up" : "el-icon-arrow-down";
    },
    moreText() {
      return (
        (this.more ? this.$t("system.close") : this.$t("system.open")) +
        this.$t("system.moreOptions")
      );
    },
    isLegalAddress() {
      return web3.utils.isAddress(this.form.to);
    },
    isLegalAmount() {
      if (this.unit === "NTS") {
        const floatNumberReg = /^(\d+\.)?\d{1,12}$/;
        const intNumberReg = /^\d+$/;
        if (floatNumberReg.test(this.form.amount)) return true;
        else return intNumberReg.test(this.form.amount);
      }
      return true;
    },
    isLegalNumber() {
      if (this.unit === "NTS") {
        const NumberReg = /^\d+(\.\d+)?$/;
        return NumberReg.test(this.form.amount);
      }
      return true;
    },
    isIntNumber() {
      if (this.unit === "DOT") {
        const intNumberReg = /^\d+$/;
        return intNumberReg.test(this.form.amount);
      }
      return true;
    },
    enoughBalance() {
      return (
        toDotBN(this.amountInputUnit).toNumber() <= this.curAccount.balance
      );
    },
    transactionABI() {
      return getTransactionABI(SysTpye.transfer, [
        this.form.to,
        JSON.stringify(
          this.tokenAmount * Math.pow(10, this.currentRow.decimals)
        )
      ]);
    }
  },
  watch: {
    currentRow(v) {
      if (v) {
        this.checkToken();
      }
    },
    tokenAmount(v) {
      if (v) {
        this.checkToken();
      }
    },
    "curAccount.address"(v) {
      if (v) {
        this.checkAmount();
        this.initCur();
        this.tokenCoin.length = 1;
        this.showToken();
        this.checkToken();
      }
    },
    unit() {
      if (this.form.amount) {
        this.checkAmount();
      }
    },
    "form.amount"(v) {
      if (v) {
        this.checkAmount();
      }
    },
    "form.to"(v) {
      if (v) {
        this.checkTo();
      }
    },
    transactionDialogVisible(v) {
      if (v) {
        this.getNeedGas();
      }
    }
  },
  methods: {
    initCur() {
      this.tokenCoin.find(i => i.address === "NTS").balance = toNtsStr(
        this.curAccount.balance
      );
    },
    setCurrent() {
      let params = this.$route.params.address;
      let curToken = params
        ? this.tokenCoin.find(i => i.address === params)
        : this.tokenCoin[0];
      this.$refs.singleTable.setCurrentRow(curToken);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    checkAmount() {
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
        this.illegalAmountFlag = true;
        return (this.illegalAmountTips = AmountErrStrategy.error);
      }
      this.illegalAmountFlag = false;
      this.illegalAmountTips = "";
    },
    checkTo() {
      // this.illegalAddressFlag = false
      let addressErrStrategy = {
        condition: !this.isLegalAddress,
        error: this.$t("transaction.addressIllegal")
      };
      if (addressErrStrategy.condition) {
        this.illegalAddressFlag = true;
        return (this.illegalAddressTips = addressErrStrategy.error);
      }
      this.illegalAddressTips = "";
      this.illegalAddressFlag = false;
    },
    toggleMore() {
      this.more = !this.more;
    },
    openTransactionDialog() {
      this.transactionDialogVisible = true;
    },
    checkToken() {
      let arrError = [
        {
          condition: !this.checkTokenInt,
          error: this.$t("token.intLimit")
        },
        {
          condition: !this.checkTokenAmount,
          error: this.$t("token.amountLimit")
        },
        {
          condition: !this.isLegalToken,
          error: this.$t("token.illegalDecimals")
        }
      ].find(i => i.condition);
      if (arrError) {
        this.tokenillegal = true;
        return (this.illegalTokenTips = arrError.error);
      }
      this.tokenillegal = false;
      this.illegalTokenTips = "";
    },
    handleSendBtn() {
      this.checkTo();
      if (this.isTokenCoin) {
        this.checkToken();
        if (!this.tokenillegal && !this.illegalAddressFlag) {
          this.openTransactionDialog();
        }
      } else {
        this.checkAmount();
        if (!this.illegalAmountFlag && !this.illegalAddressFlag) {
          this.openTransactionDialog();
        }
      }
    },
    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let txAmount = this.isTokenCoin
        ? 0
        : toDotBN(this.amountInputUnit).toString();
      let txData = this.isTokenCoin
        ? this.transactionABI
        : this.form.textarea && web3.utils.utf8ToHex(this.form.textarea);
      let txTo = this.isTokenCoin ? this.currentRow.address : this.form.to;
      let tx = {
        ...getTx(0, 0, txAmount, 0),
        from: this.curAccount.address,
        to: txTo,
        data: txData
      };
      let { code, result } = await api.getEstimateGas(tx);
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
        // Message.error(`${result}`)
      }
      this.gettingNeedGas = false;
    },
    async sendTransaction(data, dialog) {
      // 其他Token的转账和正常转账的参数是不一样的
      let txAmount = this.isTokenCoin ? 0 : data.amount;
      let txData = this.isTokenCoin
        ? this.transactionABI
        : this.form.textarea && web3.utils.utf8ToHex(this.form.textarea);
      let txTo = this.isTokenCoin ? this.currentRow.address : this.form.to;
      let tx = {
        ...getTx(data.gas, data.gasPrice, txAmount, data.periodOfValidity),
        from: this.curAccount.address,
        to: txTo,
        data: txData
      };
      let { code, result } = await api.sendTransaction(tx, data.password);
      if (code === api.SUCCESS) {
        dialog.close();
        Message.success(this.$t("transaction.transactionSent"));
        this.$router.push("/transactionList");
      } else {
        Message.error(`${result}`);
        dialog.stopLoading();
      }
    },
    async ntsCall(tokenItem, sysType) {
      let methodInfo = tokenInterface.find(i => i.name === sysType);
      // 获取该合约方法的inputs
      let { outputs } = methodInfo;
      let tx = {
        ...getTx(0, 0, 0, 0),
        from: this.curAccount.address,
        to: tokenItem.address,
        data: getTransactionABI(SysTpye.balanceOf, [this.curAccount.address])
      };
      let { code, result: ntsCallResult } = await api.ntsCall(tx);
      if (code === api.SUCCESS) {
        // 解码
        let result = await web3.nts.abi.decodeParameter(
          outputs[0].type,
          ntsCallResult
        );
        // if (code === api.SUCCESS) {
        let item = this.tokenCoin.find(i => i.address === tokenItem.address);
        if (item) {
          this.tokenCoin.find(
            i => i.address === tokenItem.address
          ).balance = toBigNumber(result)
            .dividedBy(toBigNumber(Math.pow(10, tokenItem.decimals)))
            .toFormat(Number(tokenItem.decimals));
        } else {
          this.tokenCoin.push({
            name: tokenItem.name,
            address: tokenItem.address,
            balance: toBigNumber(result)
              .dividedBy(toBigNumber(Math.pow(10, tokenItem.decimals)))
              .toFormat(Number(tokenItem.decimals)),
            symbol: tokenItem.symbol,
            decimals: tokenItem.decimals,
            time: tokenItem.time
          });
          this.setCurrent();
        }
        this.tokenCoin.sort((a, b) => a.time - b.time);

        // } else {
        //   Message.error(`${result}`);
        // }
      }
      // else console.error(result)
    },
    async showToken() {
      //获取存储的Token合约去拿TOKEN
      let result = await tokenCoinDB.getTokenCoins();
      result.forEach(i => this.ntsCall(i, "balanceOf"));
    },
    setTimer() {
      timer = setTimeout(() => {
        this.showToken();
        this.setTimer();
      }, 1000);
    }
  },
  mounted() {
    this.showToken();
    this.setCurrent();
    this.setTimer();
  },
  created() {
    this.initCur();
  },
  beforeDestroy() {
    clearTimeout(timer);
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-table .cell {
  line-height: 15px;
}
/deep/ .el-table__body tr.current-row > td {
  background-color: #f5f7fa;
}
.noteHide {
  visibility: hidden;
}
.chooseUnit {
  /deep/ .el-input {
    height: 38px;
    width: 80px;
  }
}
/*.input-with-select .el-input-group__append {*/
/*background-color: #fff;*/
/*}*/
.illegalTips {
  position: absolute;
  font-size: 12px;
  margin-top: 10px;
  color: #f56c6c;
}
.unitNote {
  color: #777;
  margin-left: 20px;
  font-size: 12px;
}
.sendBtn {
  width: 88px;
}

.container {
  width: 90%;
  margin-top: 30px;
}

.curName {
  display: flex;
  align-items: center;
  line-height: 40px;
  > span {
    margin-left: 10px;
  }
}
.mb25 {
  margin-bottom: 25px;
}
.row {
  margin-bottom: 40px;
}

.label {
  font-size: 14px;
  margin-bottom: 30px;
}

.select {
  width: 100%;
}

.balance {
  font-size: 18px;
  margin-top: 40px;
}

.more {
  cursor: pointer;
  font-size: 12px;
  color: #878787;
  transition: 0.3s;
  &:hover {
    color: #000;
  }
}

.moreInput {
  /*padding-top: 30px;*/
}
</style>
