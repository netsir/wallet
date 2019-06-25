<template>
  <div class="bg">
    <nts-card :title="$t('proposal.proposalDetail')" class="bgWhite">

      <detail-header :time="proposalInfo.apply_time"
                     :type="proposalInfo.type"
                     :hash="proposalHash"
                     :proposal-info="proposalInfo"
                     :status="proposalInfo.status"/>
    </nts-card>

    <nts-card class="bgWhite marginBt0">
      <template v-if="proposalInfo.type !== 'sys_witness_campaign'">
        <div class="stepsContainer">
          <el-steps :active="curStep" simple>
            <el-step :title="$t('proposal.approval')" :icon="getStepIcon(0)"
                     :class="{active:isActiveCouncilList, unActive:!isActiveCouncilList}"/>
            <el-step :title="$t('proposal.vote')" :icon="getStepIcon(1)"
                     :class="{active:!isActiveCouncilList, unActive:isActiveCouncilList}"/>
            <el-step :title="$t('proposal.finalize')" :icon="getStepIcon(2) || hasFinalize"
                     :class="{unActive:true}"/>
          </el-steps>
          <ul class="stepClickMask">
            <li @click="setListComponent('councilList')"></li>
            <li v-if="curStep" @click="setListComponent('voteList')"></li>
            <li></li>
          </ul>
        </div>
      </template>

      <detail-list :proposal-hash="proposalHash" @messages="activeListMsg" :proposal-status="proposalInfo.status"
                   ref="list"/>
      <div class="btnContainer">
        <el-button v-if="proposalInfo.status === 'in_approval' && activeList === 'councilList'" :type="i.type"
                   :disabled="i.disabled" @click="btnClickHandle(i.handle)" v-for="(i, idx) in operationBtnTypes"
                   :key="idx">{{i.text}}
        </el-button>
      </div>
      <div class="btnContainer">
        <el-button v-if="proposalInfo.status !== 'in_approval' && activeList === 'voteList'|| proposalInfo.status === 'expired'"
                   :disabled="i.disabled" :type="i.type" @click="btnClickHandle(i.handle)"
                   v-for="(i, idx) in operationBtnTypes"
                   :key="idx">{{i.text}}
        </el-button>
      </div>

      <transaction-dialog v-model="transactionDialogVisible"
                          :account="curAccount"
                          :transaction-need-gas="transactionNeedGas"
                          :gettingNeedGas="gettingNeedGas"
                          @submit="sendTransaction"
                          :errorMsg="errorMsg"
      />
    </nts-card>
  </div>
</template>

<script>
import detailList from "./detailList";
import detailHeader from "./detailHeader";
import transactionDialog from "../../components/dialog/transactionDialog";
import card from "../../components/card";

import { type as sysType } from "../../const/system";
import { status as proposalStatus } from "../../const/proposal";

import vuexData from "../../mixins/vuexData";

import { getTransactionABI } from "../../contract";
import { getTx } from "../../utils";
import {
  getEstimateGas,
  getProposalDetail,
  getProposalNextActionForAccount,
  sendTransaction,
  SUCCESS
} from "../../../api";
import { Message } from "element-ui";

// 成功状态对应步骤的映射
// 如果状态为失败,那么还需要判断提案中的时间来判断具体在哪个步骤失败,详情见 computed.curStep
const [ApprovalStep, VoteStep, downStep] = [0, 1, 3];
let statusToStepMap = {
  [proposalStatus.in_approval]: ApprovalStep,
  [proposalStatus.in_voting]: VoteStep,
  [proposalStatus.pending_judge]: VoteStep, // 因为只是立案是统计币龄得出投票结果,所以应该是放在投票阶段.如果投票的结果是true.那么状态会是passed.即成功立案
  [proposalStatus.passed]: downStep, // 全部通过
  [proposalStatus.expired]: ApprovalStep // 过期只可能发生在审核阶段.
};

const OperationStatusType = {
  Apply: "apply",
  Voting: "voting",
  Join: "join",
  Markup: "markup",
  Finalize: "finalize",
  Pass: "pass",
  Underway: "underway"
};

let timer;

export default {
  name: "proposal-detail",
  components: {
    detailList,
    detailHeader,
    [transactionDialog.name]: transactionDialog,
    [card.name]: card
  },
  data() {
    return {
      errorMsg: "",
      activeList: "",
      proposalHash: this.$route.params.hash,
      proposalInfo: {},
      operationStatus: "",

      // transaction-dialog
      transactionDialogVisible: false,
      willExecuteSysType: "",
      transactionNeedGas: 0,
      gettingNeedGas: false,
      btnReturnValue: ""
    };
  },
  mixins: [vuexData],
  computed: {
    isActiveCouncilList() {
      return this.activeList === "councilList";
    },
    operationBtnTypes() {
      let Map = {
        [OperationStatusType.Underway]: [
          {
            type: "danger",
            text: this.$t("transaction.underway"),
            disabled: true,
            handle: () => {}
          }
        ],
        [OperationStatusType.Apply]: [
          {
            type: "danger",
            text: this.$t("resultToTextMap.disagree"),
            handle: () =>
              this.setBtnReturnValue(sysType.SetConfigApplyVote, false),
            disabled: false
          },
          {
            type: "primary",
            text: this.$t("resultToTextMap.agree"),
            handle: () =>
              this.setBtnReturnValue(sysType.SetConfigApplyVote, true),
            disabled: false
          }
        ],
        [OperationStatusType.Voting]: [
          {
            type: "danger",
            text: this.$t("resultToTextMap.disagree"),
            handle: () => this.setBtnReturnValue(sysType.SetConfigVote, false),
            disabled: false
          },
          {
            type: "primary",
            text: this.$t("resultToTextMap.agree"),
            handle: () => this.setBtnReturnValue(sysType.SetConfigVote, true),
            disabled: false
          }
        ],
        [OperationStatusType.Join]: [
          {
            type: "primary",
            text: this.$t("proposal.compete"),
            handle: () => this.setBtnReturnValue(sysType.SetSystemWitnessApply),
            disabled: false
          }
        ],
        [OperationStatusType.Markup]: [
          {
            type: "primary",
            text: "加价",
            handle: () =>
              this.setBtnReturnValue(sysType.SetSystemWitnessAddMargin),
            disabled: false
          }
        ],
        [OperationStatusType.Finalize]: [
          {
            type: "primary",
            text: this.$t("proposal.finalize"),
            handle: () => this.setBtnReturnValue(sysType.SetConfigFinalize),
            disabled: false
          }
        ],
        [OperationStatusType.Pass]: []
      };
      return Map[this.operationStatus] || [];
    },

    isProposalFail() {
      return [proposalStatus.expired, proposalStatus.failed].includes(
        this.proposalInfo.status
      );
    },

    isInApprovalStep() {
      // 没有投票时间,则代表在审核阶段
      return !this.proposalInfo.voting_time;
    },

    curStep() {
      // 议案失败有两类 1.审核阶段失败 2.投票阶段失败
      if (this.isProposalFail) {
        return this.isInApprovalStep
          ? statusToStepMap[proposalStatus.in_approval]
          : statusToStepMap[proposalStatus.in_voting];
      }
      return statusToStepMap[proposalStatus[this.proposalInfo.status]];
    },

    transactionABI() {
      let params = [this.proposalHash];
      if (
        this.willExecuteSysType === sysType.SetConfigVote ||
        this.willExecuteSysType === sysType.SetConfigApplyVote
      ) {
        params.push(this.btnReturnValue);
      }
      return getTransactionABI(this.willExecuteSysType, params);
    },
    hasFinalize() {
      return this.proposalInfo.ending_time ? "el-icon-success" : "";
    }
  },
  methods: {
    activeListMsg(val) {
      this.activeList = val;
    },
    getStepIcon(step) {
      if (this.curStep === step)
        return this.isProposalFail ? "el-icon-error" : "iconfont icon-loudou";
      if (this.curStep < step) return "";
      if (this.curStep > step) return "el-icon-success";
    },

    setBtnReturnValue(sysType, btnReturnValue) {
      this.willExecuteSysType = sysType;
      this.btnReturnValue = btnReturnValue;
    },

    async btnClickHandle(handle) {
      handle();
      this.transactionDialogVisible = true;
      this.getNeedGas();
    },
    async sendTransaction(data, dialog) {
      let tx = {
        ...getTx(data.gas, data.gasPrice, data.amount, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.transactionABI
      };
      let { code, result } = await sendTransaction(tx, data.password);
      if (code === SUCCESS) {
        Message.success(this.$t("proposal.optionSuccess"));
        dialog.close();
      } else {
        dialog.stopLoading();
        Message.error(`${result}`);
      }
    },
    async getProposalDetail() {
      let { code, result } = await getProposalDetail(this.proposalHash);
      if (code === SUCCESS) {
        if (["passed", "failed", "expired"].includes(result.status))
          clearTimeout(timer);
        this.proposalInfo = result;
      } else {
        console.error(`${code}: ${result}`);
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
      let { code, result } = await getEstimateGas(tx);
      this.gettingNeedGas = false;
      if (code === SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
        // Message.error(`${result}`)
      }
      this.gettingNeedGas = false;
    },

    async getOperationStatus() {
      let { code, result } = await getProposalNextActionForAccount(
        this.proposalHash,
        this.curAccount.address
      );
      if (code === SUCCESS) {
        this.operationStatus = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },

    setListComponent(listComponentName) {
      this.$refs.list.setActiveComponentName(listComponentName);
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getProposalDetail();
        this.getOperationStatus();
        this.setTimer();
      }, 3000);
    }
  },
  created() {
    this.getProposalDetail();
    this.getOperationStatus();
    this.setTimer();
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  }
};
</script>

<style scoped lang="scss">
.active {
  /deep/ .el-step__head {
    color: #409eff;
    .el-step__line-inner {
      border: none;
    }
  }
  /deep/ .el-step__title {
    color: #409eff;
  }
}

.unActive {
  /deep/ .el-step__head {
    color: #c0c4cc;
    .el-step__line-inner {
      border: none;
    }
  }
  /deep/ .el-step__title {
    color: #c0c4cc;
  }
}

.marginBt0 {
  margin-bottom: 0 !important;
}

.bg {
  background: #f3f5f6;
}

.bgWhite {
  background: #fff;
}

.stepsContainer {
  margin-top: 20px;
  position: relative;
}

.btnContainer {
  display: flex;
  width: 30%;
  max-width: 240px;
  justify-content: space-around;
  margin: 25px auto;
}

.stepClickMask {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  height: 46px;
  display: flex;
  li {
    flex: 1;
    cursor: pointer;
  }
  z-index: 100;
}
</style>
