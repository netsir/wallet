<template>
  <div class="container">
    <div class="head">
      <div class="heart">
        <div>
          <p>{{$t('account.curWitness')}}</p>
          <p>{{witnessList.length + '/' + 11}}</p>
        </div>
      </div>
<!--      <div class="heart">-->
<!--        <div>-->
<!--          <p>{{$t('account.witnessCancel')}}</p>-->
<!--          <p>{{chainStatus !== "normal" ? 0 : 11 - witnessList.length}}</p>-->
<!--        </div>-->
<!--      </div>-->
      <div class="heart">
        <div>
          <p>{{$t('account.chainStatus')}}</p>
          <p>{{chainStatusText}}</p>
        </div>
      </div>
      <div class="btnContainer">
        <el-button class="btn btnThemeColor" @click="showDialog"
                   :disabled="applyBtnDisable">
          {{witnessList.length ? $t('account.replace') : $t('account.apply')}}{{$t('account.witness')}}
        </el-button>
        <!--    帮助他人申请见证人    -->
        <div style="margin-top: 20px">
          <el-button style="width: 100%" :disabled="!canHelpApplyWitness" @click="showHelpWitnessDialog">
            {{$t('account.helpOtherApplyWitness')}}
          </el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <nts-card :title="$t('account.witnessManage')">
        <el-table :data="witnessList" :row-style="{height:'60px'}">
          <el-table-column prop="witness" align="center" :label="$t('account.accountUser')"/>
          <el-table-column :label="$t('system.status')" align="center">
            <template slot-scope="scope">
              {{$t(`witnessStatus.${scope.row.status}`)}}
            </template>
          </el-table-column>
        </el-table>
      </nts-card>
    </div>

    <witness-dialog v-model="witnessDialogVisible"
                    :account="curAccount"
                    @submit="submit"
    />

    <help-witness-dialog  v-model="helpWitnessDialogVisible"
                          :account="curAccount"
                          @submit="handleHelpWitnessDialog"
    />

    <el-dialog :visible.sync="applyInfo" width="400px" class="applyInfo">
      <p class="words">{{$t('account.calPow')}}</p>
      <el-button class="btnThemeColor applyInfoBtn" @click="applyInfo = false">{{$t('riskTips.iKnow')}}</el-button>
    </el-dialog>

    <transaction-dialog v-model="transactionDialogVisible"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        :errorMsg="errorMsg"
                        @submit="sendHelpWitnessTransaction"/>
  </div>
</template>

<script>
import card from "../components/card";
import * as api from "../../api";
import vuexData from "../mixins/vuexData";
import witnessDialog from "../components/dialog/witnessDialog";
import helpWitnessDialog from "../components/dialog/helpWitnessDialog";
import transactionDialog from "../components/dialog/transactionDialog";
import { type as sysType } from "../const/system";
import { getTransactionABI } from "../contract";
import { Message } from "element-ui";
import i18n from "./../lang/index";
import { getContract } from "../../modules/db/contract";
import { web3 } from "../main";
import { getTx } from "../utils";

let timer;

export default {
  name: "witnessManage",
  components: {
    [card.name]: card,
    [witnessDialog.name]: witnessDialog,
    [helpWitnessDialog.name]: helpWitnessDialog,
    [transactionDialog.name]: transactionDialog
  },
  data() {
    return {
      witnessList: [],
      witnessDialogVisible: false,
      curClickTime: 0,
      chainStatus: "normal",
      applyInfo: false,
      applyWitness: "",
      checkUnderway: false,

      // 帮助他人更换见证人相关
      helpWitnessDialogVisible: false,
      transactionDialogVisible: false,
      helpWitnessAddress: "",
      transactionNeedGas: 0,
      gettingNeedGas: true,
      errorMsg: ""
    };
  },
  mixins: [vuexData],
  watch: {
    "curAccount.address"() {
      this.getWitnessList();
      this.getAccountWitnessStatus();
    }
  },
  computed: {
    transactionABI() {
      return getTransactionABI(sysType.applyWitnessWay2, [
        this.helpWitnessAddress
      ]);
    },
    canHelpApplyWitness() {
      return this.witnessList.length >= 8;
    },
    chainStatusText() {
      let text
      switch (this.chainStatus) {
        case "powing":
          text = this.$t("account.calPow1")
          break
        case "witness_replace_underway":
          text = this.witnessList.length === 0 ? this.$t("account.applyingWitness") : this.$t("account.changingWitness");
          break
        case "not_witness":
          text = this.$t("account.noWitnessTips");
          break
        case "normal":
          text = this.$t("account.normal")
          break
        case "insufficient":
          text = this.$t("account.insufficient");
          break
      }
      return text
    },
    applyBtnDisable() {
      return (
        this.chainStatus === "witness_replace_underway" ||
        this.chainStatus === "powing"
      );
    }
  },
  methods: {
    /*********************帮助他人更换见证人相关***********************/
    showHelpWitnessDialog() {
      this.helpWitnessAddress = "";
      this.helpWitnessDialogVisible = true;
    },
    handleHelpWitnessDialog(data, dialog) {
      this.helpWitnessAddress = data.helpAddress;
      dialog.close();
      this.transactionDialogVisible = true;
      this.getNeedGas();
    },
    async sendHelpWitnessTransaction(data, dialog) {
      let tx = {
        ...getTx(data.gas, data.gasPrice, 0, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.$store.state.system.sysChainAddress,
        data: this.transactionABI
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
    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let tx = {
        ...getTx(0, 0, 0, 0),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.transactionABI
      };
      let { code, result } = await api.getEstimateGas(tx);
      this.gettingNeedGas = false;
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
      }
      this.gettingNeedGas = false;
    },
    /************************ END **************************/
    async getWitnessList() {
      let { code, result } = await api.getChainWitnessInfo(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.witnessList = result;
      } else {
        console.error(code, result);
      }
    },

    async decodeValue(item) {
      let contractInfoByDb = await getContract({
        contractAddress: item.to
      });
      if (!contractInfoByDb) return console.error("未找到该合约的ABI");
      let methodId = item.input.slice(0, 10);
      let contract = new web3.nts.Contract(
        contractInfoByDb.jsonInterface,
        this.$store.state.system.sysChainAddress
      );
      // 获取该合约方法的inputs
      let {
        options: { jsonInterface }
      } = contract;
      let methodInfo = jsonInterface.filter(i => i.signature === methodId)[0];
      let result = methodInfo.inputs.length
        ? web3.nts.abi.decodeParameters(
            methodInfo.inputs,
            item.input.replace(methodId, "")
          )
        : {};
      let dataName = methodInfo.inputs.map(i => i.name);
      let res = Object.keys(result).filter(i => !dataName.includes(i));
      res.map(i => {
        delete result[i];
      });
      return result;
    },

    submit(data, dialog) {
      this.sendWitnessPow(data, dialog);
    },

    async getAccountWitnessStatus() {
      let { code, result } = await api.getAccountWitnessStatus(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.chainStatus = result;
      } else {
        this.$message.error(result);
      }
    },

    async sendWitnessPow(data, dialog) {
      let { code, result } = await api.sendWitnessPow(
        this.curAccount.address,
        this.curAccount.address,
        data.password
      );
      if (code === api.SUCCESS) {
        dialog.close();
        this.applyInfo = true;
      } else {
        Message({
          type: "error",
          duration: 4000,
          message: (this.witnessList.length === 0 ? i18n.t("account.applyWitnessFail") : i18n.t("account.changeWitnessFail")) + ": " + `${result}`
        });
        dialog.stopLoading();
      }
    },
    showDialog() {
      this.curClickTime = Date.now();
      const lastClickTimeValue = window.localStorage.getItem(
        "accountAddressLastClick"
      )
        ? JSON.parse(window.localStorage.getItem("accountAddressLastClick"))[
            this.curAccount.address
          ]
        : 0;
      const lastClickTime = lastClickTimeValue || 0;
      const TEN_MINUTES = 60 * 1000 * 10;
      if (this.curClickTime - lastClickTime > TEN_MINUTES) {
        this.witnessDialogVisible = true;
      } else {
        Message.error(this.$t("account.witnessChangeDelay"));
      }
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getAccountWitnessStatus();
        this.getWitnessList();
        this.setTimer();
      }, 1000);
    }
  },
  created() {
    this.getWitnessList();
    this.setTimer();
    this.getAccountWitnessStatus();
  },
  beforeDestroy() {
    clearTimeout(timer);
  }
};
</script>

<style scoped lang="scss">
.words {
  line-height: 1.6em;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 700;
}

.applyInfoBtn {
  margin-top: 40px;
}

.applyInfo {
  text-align: center;

  /deep/ .el-dialog__header {
    padding: 0;
  }
}

.btn {
  width: 100%;
  border-radius: 4px;
  border: none;
}

.heart {
  position: relative;
  padding: 36px 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    text-align: center;

    &:first-child {
      font-weight: bold;
      font-size: 16px;
      color: #555;
    }

    &:last-child {
      margin-top: 30px;
      font-size: 20px;
      color: #333;
    }
  }
}

.container {
  background: #f3f5f6;
  height: 100%;
}

.head {
  float: left;
  width: 320px;
  display: flex;
  flex-direction: column;

  > div {
    box-sizing: border-box;
    background: #fff;

    &:nth-child(1) {
      padding: 25px 20px;
      margin-bottom: 30px;
      flex-shrink: 0;
      height: 160px;
    }

    &:nth-child(2) {
      height: 160px;
      padding: 25px 20px;
      flex: 3;
      margin-bottom: 30px;
    }
  }
}

.main {
  height: 100%;
  margin-left: 350px;
  background: #fff;
}

.btnContainer {
  background: #f3f5f6 !important;
  text-align: center;
}

.extra-info {
  position: absolute;
  right: 30px;
  top: 36px;
  color: #555;
  display: flex;
  font-size: 12px;

  li {
    margin-left: 20px;
  }
}

.total {
  background: #fff;
  padding: 30px 20px;
  display: flex;
  text-align: center;

  > div {
    flex: 1;

    &:first-child {
      border-right: 1px solid #d0d0d0;
    }
  }

  .num {
    margin-top: 18px;
  }
}
</style>
