<template>
  <div class="bg">
    <nts-card :title="$t(`recruit.${proposalInfo.type}`)" class="bgWhite">
      <el-row>
        <el-col :span="6">
          <div class="campaignInfo">
            <p> {{$t('proposal.RecruitingSum')+':'+proposalInfo.RecruitingSum}}</p>
            <p>{{$t('proposal.atLeastMargin')}}: {{campaignMargin}} NTS</p>
            <p>{{$t('proposal.height')}}: {{proposalInfo.voting_unumber}}</p>
          </div>
        </el-col>
        <el-col :span="18">
          <el-row v-if="!rankLoading">
            <el-col :span="24" class="flexBox">
              <div class="campaignInfo" v-if="rank.Ranking !== 0">
                <p>{{$t('proposal.curRank') + ':' + rank.Ranking}}</p>
                <p>{{$t('proposal.margin') + ':'}} {{ rank.Margin | toNts }} NTS</p>
              </div>
              <div v-if="operationStatus === 'markup'">
                <router-link :to="`/sendCampaign/${proposalInfo.type}/${proposalHash}`">
                  <el-button class="btnThemeColor addMargin">{{ $t('proposal.addMargin') }}</el-button>
                </router-link>
              </div>
            </el-col>
            <el-col :offset="22" :span="2">
              <div class="flexBtn"
                   v-if="operationStatus !== 'markup' && rank.Ranking === 0 && proposalInfo.status === 'apply'">
                <router-link :to="`/sendCampaign/${proposalInfo.type}/${proposalHash}`">
                  <el-button class="btnThemeColor applyBtn">{{ $t('account.apply') }}</el-button>
                </router-link>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </nts-card>
    <nts-card :title="$t('proposal.applyList')" class="ntsCard bgWhite">
      <witness-campaign-list :list="txList"/>
      <div class="pagination" v-if="txList.length && total > pageSize">
        <el-pagination @current-change="getTxList" :current-page.sync="curPage" :page-size="pageSize"
                       layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div class="btnContainer">
        <el-button v-if="operationStatus==='finalize'" type="primary" @click="finalizeSend"
        >{{$t('proposal.finalize')}}
        </el-button>
      </div>
    </nts-card>

    <transaction-dialog v-model="transactionDialogVisible"
                        :account="curAccount"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        :errorMsg="errorMsg"
                        @submit="sendTransaction"
    />
  </div>
</template>

<script>
import * as api from "../../api";
import card from "../components/card";
import witnessCampaignList from "../components/witnessCampaignList";
import vuexData from "../mixins/vuexData";
import transactionDialog from "../components/dialog/transactionDialog";
import { toNtsBN, getTx } from "../utils";
import { Message } from "element-ui";
import { getTransactionABI } from "../contract";
import { type as sysType } from "../const/system";
import { type as proposalType } from "../const/proposal";
import { identity } from "../const/account";

let timer;
let timerStatus;

export default {
  name: "witness-campaign",
  components: {
    [card.name]: card,
    [witnessCampaignList.name]: witnessCampaignList,
    [transactionDialog.name]: transactionDialog
  },
  mixins: [vuexData],
  data() {
    return {
      errorMsg: "",
      operationStatus: "",
      proposalHash: "",
      num: 1,
      // 筛选框
      typeMenuVisible: false,
      // 分页
      curPage: 1,
      total: 1,
      pageSize: 10,
      // 交易记录列表
      txList: [],
      proposalInfo: {},

      rankLoading: true,
      rank: {
        Margin: 0,
        Ranking: 0
      },
      deposit: "",
      transactionDialogVisible: false,
      gettingNeedGas: false,
      transactionNeedGas: 0
    };
  },
  computed: {
    transactionABI() {
      return getTransactionABI(this.sysType, [this.proposalHash]);
    },
    sysType() {
      return sysType.SetConfigFinalize;
    },
    isNormal() {
      return this.curAccount.role.identity === identity.normal;
    },
    campaignMargin() {
      if (this.proposalInfo.type === proposalType.sys_witness_campaign)
        return toNtsBN(
          this.$store.state.system.consensualConfig.scWitnessMinMargin
            .current_val
        ).toString();
      if (this.proposalInfo.type === proposalType.user_witness_campaign)
        return toNtsBN(
          this.$store.state.system.consensualConfig.ucWitnessMargin.current_val
        ).toString();
    }
  },
  watch: {
    "curAccount.address"() {
      this.getTxList();
      this.getProposalDetail();
      this.getCampaignRanking();
      this.getOperationStatus();
    }
  },
  methods: {
    async finalizeSend() {
      this.transactionDialogVisible = true;
      this.getNeedGas();
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
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
        // Message.error(`${result}`)
      }
      this.gettingNeedGas = false;
    },
    async getOperationStatus() {
      let { code, result } = await api.getProposalNextActionForAccount(
        this.proposalHash,
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.operationStatus = result;
      } else {
        console.error(`${code}: ${result}`);
      }
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
        Message.success(this.$t("proposal.optionSuccess"));
        dialog.close();
      } else {
        dialog.stopLoading();
        Message.error(`${result}`);
      }
    },
    async getProposalDetail() {
      let { code, result } = await api.getProposalDetail(this.proposalHash);
      console.log(result);
      if (code === api.SUCCESS) {
        this.proposalInfo = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getCampaignRanking() {
      let { code, result } = await api.getCampaignRanking(
        this.proposalHash,
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.rankLoading = false
        this.rank = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getTxList() {
      let { code, result } = await api.getCampaignList(
        this.proposalHash,
        this.curPage,
        this.pageSize
      );
      if (code === api.SUCCESS) {
        this.txList =
          result.list.map((i, idx) => {
            return {
              idx: idx + (this.curPage - 1) * this.pageSize + 1,
              ...i
            };
          }) || [];
        this.total = result.sum || 0;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getProposalDetail();
        this.getCampaignRanking();
        this.getTxList();
        this.setTimer();
      }, 5000);
    },
    setTimerBtnStatus() {
      timerStatus = setTimeout(() => {
        this.getOperationStatus();
        this.setTimerBtnStatus();
      }, 5000);
    }
  },
  mounted() {
    this.getTxList();
    this.setTimer();
    this.setTimerBtnStatus();
  },
  async created() {
    this.proposalHash = this.$route.params.hash;
    this.getProposalDetail();
    this.getCampaignRanking();
    this.getOperationStatus();
    this.deposit = toNtsBN(
      this.$store.state.system.consensualConfig.councilMargin.current_val
    ).toString();
  },
  beforeDestroy() {
    clearTimeout(timer);
    clearTimeout(timerStatus);
    timer = null;
    timerStatus = null;
  }
};
</script>

<style scoped lang="scss">
.flexBox {
  display: flex;
  justify-content: space-between;
}

.flexBtn {
  display: flex;
  flex-direction: row-reverse;
}

.applyBtnBox {
  display: flex;
  flex-direction: row-reverse;
}

.addMargin {
  padding: 10px 40px;
}

.applyBtn {
  padding: 10px 40px;
}

.campaignInfo {
  p {
    margin-bottom: 20px;
  }
}

.btnContainer {
  text-align: center;
  margin: 25px auto;
}

.bg {
  background: #f3f5f6;
}

.bgWhite {
  background: #fff;
  margin-bottom: 20px !important;
}

.selectType {
  display: inline-block;
  cursor: pointer;
  margin-left: 10px;
}

.typeMenu {
  cursor: pointer;
  font-size: 13px;
  text-align: center;
  font-weight: bold;
}

.rollover {
  transform: rotate(180deg);
}

.icon {
  transition: 0.2s;
  margin-left: 0;
}

.pagination {
  margin-top: 12px;
  text-align: right;
}

.ntsCard {
  /deep/ h2 {
    display: inline-block;
  }
}
</style>
