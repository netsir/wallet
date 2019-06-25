<template>
  <nts-card :title="!isFirstApply ? $t('proposal.addMargin'):$t('proposal.sendDeposit')">
    <div class="container">
      <el-row class="row">
        <el-col :span="10">
          <p class="label">{{$t('system.from')}}</p>
          <p class="curName">
            <avatar size="middle" :color="curAccount.color" :identity="curAccount.role.identity"
                    :active="curAccount.role.active"/>
            <span>{{curAccount.name}}</span>
          </p>
        </el-col>
      </el-row>

      <el-row class="row">
        <el-col :span="10">
          <p class="label">{{$t('proposal.depositAmount')}}
            <span v-if="isFirstApply">{{ `${$t('proposal.atLeast')} ${campaignMargin} NTS`}}</span>
          </p>
          <div>
            <el-input :placeholder="$t('transaction.amount')" v-model="form.amount" class="input-with-select">
              <span slot="append">NTS</span>
            </el-input>
            <p class="illegalTips">{{illegalAmountTips}}</p>
          </div>
        </el-col>
        <el-col :span="10" :offset="4">
          <p class="label">{{$t('account.accountAssets')}}</p>
          <p class="balance">{{curAccount.balance | toNts}} <span class="unit">NTS</span></p>
        </el-col>
      </el-row>

      <el-button class="btnThemeColor sendBtn" @click="handleSendBtn">{{$t('system.send')}}</el-button>
    </div>

    <transaction-dialog v-model="transactionDialogVisible"
                        :amount="form.amount"
                        :amount-label="$t('transaction.amount')"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        :errorMsg="errorMsg"
                        @submit="sendTransaction"/>
  </nts-card>
</template>
<script>
import card from "../components/card/index";
import transactionDialog from "../components/dialog/transactionDialog";
import { getTransactionABI } from "../contract";
import avatar from "../components/avatar/index";
import { getTx, toDotBN, toNtsBN, toBigNumber as toBN } from "../utils";
import { type as proposalTypes } from "../const/proposal";
import { identity } from "../const/account";
import { type as sysType } from "../const/system";
import vuexData from "../mixins/vuexData";
import { Message } from "element-ui";
import * as api from "../../api/index";

let timer = null;
export default {
  name: "sendCampaign",
  components: {
    [card.name]: card,
    [transactionDialog.name]: transactionDialog,
    [avatar.name]: avatar
  },
  mixins: [vuexData],
  data() {
    return {
      rank: {
        Margin: 0,
        Ranking: 0
      },
      form: {
        to: "",
        amount: "",
        textarea: ""
      },
      proposalInfo: {},
      errorMsg: "",
      more: false,
      proposalType: "",
      transactionNeedGas: 0,
      transactionDialogVisible: false,
      gettingNeedGas: false,
      proposalHash: "",
      illegalAmountFlag: true,
      illegalAmountTips: ""
    };
  },
  computed: {
    isNormalAccount() {
      return this.curAccount.role.identity === identity.normal;
    },
    isFirstApply() {
      return this.rank.Ranking === 0;
    },
    isLegalNumber() {
      const NumberReg = /^\d+(\.\d{1,12})?$/;
      return NumberReg.test(this.form.amount);
    },
    enoughMargin() {
      return toBN(this.form.amount).gte(this.campaignMargin);
    },
    enoughBalance() {
      return toDotBN(this.form.amount).toNumber() <= this.curAccount.balance;
    },
    transactionABI() {
      return getTransactionABI(this.sysType, [this.proposalHash]);
    },
    sysType() {
      return this.isFirstApply
        ? sysType.SetSystemWitnessApply
        : sysType.SetSystemWitnessAddMargin;
    },
    campaignMargin() {
      const { consensualConfig } = this.$store.state.system;
      if (this.proposalInfo.type === proposalTypes.sys_witness_campaign)
        return toNtsBN(consensualConfig.scWitnessMinMargin.current_val);
      if (this.proposalInfo.type === proposalTypes.user_witness_campaign)
        return toNtsBN(consensualConfig.ucWitnessMargin.current_val);
    }
  },
  watch: {
    "curAccount.address"(v) {
      if (v) {
        this.checkFormAmount();
      }
    },
    unit(v) {
      if (v) {
        this.checkFormAmount();
      }
    },
    "form.amount"(v) {
      if (v) {
        this.checkFormAmount();
      }
    },
    transactionDialogVisible(v) {
      if (v) {
        this.getNeedGas();
      }
    }
  },
  methods: {
    checkFormAmount() {
      let AmountErrStrategy = [
        {
          condition: !this.isLegalNumber,
          error: this.$t("transaction.amountIllegal")
        },
        {
          condition: !this.enoughBalance,
          error: this.$t("transaction.amountInsufficient")
        },
        {
          condition: this.isFirstApply && !this.enoughMargin,
          error: this.$t("proposal.notEnoughMargin")
        }
      ].filter(i => i.condition)[0];
      if (AmountErrStrategy) {
        this.illegalAmountFlag = true;
        return (this.illegalAmountTips = AmountErrStrategy.error);
      }
      this.illegalAmountFlag = false;
      this.illegalAmountTips = "";
    },
    async getCampaignRanking() {
      let { code, result } = await api.getCampaignRanking(
        this.proposalHash,
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.rank = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getProposalDetail() {
      let { code, result } = await api.getProposalDetail(this.proposalHash);
      if (code === api.SUCCESS) {
        this.proposalInfo = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    toggleMore() {
      this.more = !this.more;
    },
    openTransactionDialog() {
      this.transactionDialogVisible = true;
    },
    handleSendBtn() {
      this.checkFormAmount();
      if (!this.illegalAmountFlag) {
        this.openTransactionDialog();
      }
    },
    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let tx = {
        ...getTx(0, 0, toDotBN(this.form.amount).toString(), 0),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.transactionABI
      };
      let { code, result } = await api.getEstimateGas(tx);
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
      }
      this.gettingNeedGas = false;
    },
    async sendTransaction(data, dialog) {
      let tx = {
        ...getTx(data.gas, data.gasPrice, data.amount, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.sysChainAddress,
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
    setTimer() {
      timer = setTimeout(() => {
        this.getCampaignRanking();
        this.setTimer();
      }, 5000);
    }
  },
  mounted() {
    this.setTimer();
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  },
  created() {
    this.proposalType = this.$route.params.type;
    this.proposalHash = this.$route.params.hash;
    this.getProposalDetail();
    this.getCampaignRanking();
  }
};
</script>

<style scoped lang="scss">
.illegalTips {
  font-size: 12px;
  color: #f56c6c;
  position: absolute;
  margin-top: 12px;
}

.el-select {
  /deep/ .el-input {
    width: 80px;
  }
}

.sendBtn {
  width: 88px;
}

.container {
  width: 80%;
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
