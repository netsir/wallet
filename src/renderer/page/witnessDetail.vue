<template>
  <div class="container">
    <div class="head">
      <div>
        <div class="avatarInfo">
          <avatar size="largest" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"></avatar>
        </div>
        <div class="detail">
          <p>{{curAccount.name}}</p>
          <p>{{identityText}}</p>
          <p>{{$t('account.voteRate')}} {{voteRate}}%</p>
        </div>
        <span class="cancelWitness noPointer" v-if="!isActive">{{$t('witnessStatus.LoggedOut')}}</span>
        <span class="cancelWitness" @click="riskTipsToggle" v-else>{{$t('account.cancelWitness')}}</span>
      </div>
      <div>
        <ul class="witnessFee">
          <li>
            <p>{{$t('account.canTake')}}  (NTS)</p>
            <p>{{withdrawCurMoney | toNts}}</p>
          </li>
        </ul>
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="$t('account.withdrawDetail')" name="2">
            <ul class="witnessFeeDetail">
              <li>
                <p>{{$t('account.preReward')}} (NTS)</p>
                <p>{{preReward | toNts}}</p>
              </li>
              <li>
                <p>{{$t('account.canReward')}} (NTS)</p>
                <p>{{canReward | toNts}}</p>
              </li>
              <li>
                <p>{{$t('account.costFeeFreezed')}} (NTS)</p>
                <p>{{witnessFeeFreezed | toNts}}</p>
              </li>
              <li>
                <p>{{$t('account.feeCost')}} (NTS)</p>
                <p>{{feeCost | toNts}}</p>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div>
        <!--<p class="proposalTotalTitle">{{$t('account.proposalTotalTitle')}}</p>-->
        <ul class="proposalTotal">
          <li>
            <p>{{$t('account.notWitness')}}</p>
            <p>{{notWitness}}</p>
          </li>
          <li>
            <p>{{$t('account.witnessed')}}</p>
            <p>{{haveWitness}}</p>
          </li>
          <li>
            <p>{{$t('account.toBeWitness')}}</p>
            <p>{{ActualGenerateUnit}}</p>
          </li>
        </ul>
      </div>
      <div class="LastUnit" v-if="!noLastBlock">
        <ul>
          <li>
            <p>{{$t('account.lastVoteBlock')}}</p>
            <p>{{lastBlockTimeStamp / 1000000000 | formatTime}}</p>
          </li>
          <router-link tag="li" :to="`/unitDetail/${lastBlockHash}`">
            <p class="lastHash">{{lastBlockHash | ellipsis}}</p>
          </router-link>
        </ul>
      </div>

      <div class="btnContainer">
        <el-button v-if="!isActive"
          :class="{'btn':true,'btnThemeColor':true,'disabledBtn':canWithDrawMoney}"
          :disabled="canWithDrawMoney"
                 @click="withdrawFronzonMoney">
          {{$t('account.withdrawMoney')}}
        </el-button>
        <el-button :class="{'btn':true,'btnThemeColor':true,'disabledBtn':canWithDrawMoney}"
                   :disabled="canWithDrawMoney" @click="withdrawMoney"
                   v-else>
          {{$t('account.withdrawMoney')}}
        </el-button>
      </div>
    </div>
    <div class="main">
      <h4>{{$t('account.manageUser')}}</h4>
      <div>
        <el-table class="list" :data="list.slice((curPage-1)*pageSize,curPage*pageSize)" stripe
                  :row-style="{height:'60px'}">
          <el-table-column type="index" width="150px" :label="$t('transaction.orderNumber')" align="center"/>
          <el-table-column :label="$t('transaction.address')" align="center">
            <template slot-scope="scope">
              {{scope.row }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="list.length && total > pageSize">
          <el-pagination @current-change="getWitnessCurrentUsers" :current-page.sync="curPage" :page-size="10"
                         layout="prev, pager, next, jumper" :total="total"/>
        </div>
      </div>
    </div>
    <transaction-dialog v-model="transactionDialogVisible"
                        :account="curAccount"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        @submit="sendTransaction"
                        :errorMsg="errorMsg"
    />

   <risk-tips-dialog v-model="riskTipsDialogVisible" @riskRead="cancelWitness" />


  </div>
</template>

<script>
import vuexData from "../mixins/vuexData";
import * as api from "../../api";
import { Message } from "element-ui";
import transactionDialog from "../components/dialog/transactionDialog";
import { getTx } from "../utils";
import { getTransactionABI } from "../contract";
import { type as sysType } from "../const/system";
import avatar from "../components/avatar";
import { identity } from "../const/account";
import { toBigNumber, BigNumberEqualZero } from "../utils";
import riskTipsDialog from "../components/dialog/riskTipsDialog";
let timer;
export default {
  name: "witnessDetail",
  components: {
    [transactionDialog.name]: transactionDialog,
    [avatar.name]: avatar,
    [riskTipsDialog.name]: riskTipsDialog
  },
  mixins: [vuexData],
  data() {
    return {
      withdrawCurMoney: this.$t("system.calculateMoney"),
      witnessFeeFreezed: this.$t("system.calculateMoney"),
      errorMsg: "",
      deposit: "",
      gettingNeedGas: false,
      transactionDialogVisible: false,
      riskTipsDialogVisible: false,
      transactionNeedGas: 0,
      preReward: this.$t("system.calculateMoney"),
      canReward: this.$t("system.calculateMoney"),
      feeCost: this.$t("system.calculateMoney"),
      // curFilter: 1,

      curPage: 1,
      pageSize: 10,
      total: 0,
      joinTotal: 0,
      haveWitness: 0,
      ActualGenerateUnit: 0,
      notWitness: 0,
      voteRate: 0,

      lastBlockTimeStamp: 0,
      lastBlockHash: "",
      noLastBlock: false,

      //执行的ABI
      willExecuteSysType: "",
      list: [],
      witnessInfo: "",
      activeNames: ["1"]
    };
  },
  watch: {
    curAccount(v) {
      if (v.identity === identity.council) {
        return this.$router.push(`/councilDetail/${this.curAccount.address}`);
      }
    },
    "curAccount.address"(v) {
      if (v) {
        this.isWitness();
        this.witnessGetWitnessFee();
        this.getWitnessReport();
        this.getWitnessCurrentUsers();
        this.startTimeout();
      }
    }
  },
  computed: {
    //有身份才能进来提现相关操作，加入注销的见证人也能进来的操作，进来后调用getCouncilInfo来拿到是否是见证人
    identityText() {
      return this.$t(`identity.${this.curAccount.role.identity}`);
    },
    isActive() {
      return this.curAccount.role.active;
    },
    //注销后冻结金额变成可提现金额
    canWithDrawMoney() {
      return BigNumberEqualZero(this.withdrawCurMoney, 0);
    },

    transactionABI() {
      return getTransactionABI(this.willExecuteSysType);
    },

    isAccessible() {
      return (
        this.curAccount.role.identity === identity.council ||
        this.curAccount.role.identity === identity.sysWitness ||
        this.curAccount.role.identity === identity.userWitness
      );
    }
  },
  methods: {
    startTimeout() {
      timer = setTimeout(() => {
        this.witnessGetWitnessFee();
        this.getWitnessReport();
        this.getWitnessCurrentUsers();
        this.startTimeout();
      }, 5000);
    },
    async isWitness() {
      if (!this.isAccessible) {
        this.$router.push(`/account/${this.curAccount.address}`);
        return Message.error(this.$t("account.withdrawMoneyOperation"));
      }
      let { code, result } = await api.getWitnessInfo(this.curAccount.address);
      if (code === api.SUCCESS) {
        this.witnessInfo = result;
      }
    },
    setWillExecuteSysType(sysType) {
      this.willExecuteSysType = sysType;
    },
    withdrawMoney() {
      this.setWillExecuteSysType(sysType.Settlement);
      this.transactionDialogVisible = true;
      this.getNeedGas();
    },
    withdrawFronzonMoney() {
      this.setWillExecuteSysType(sysType.Settlement);
      this.transactionDialogVisible = true;
      this.getNeedGas();
    },
    riskTipsToggle() {
      this.riskTipsDialogVisible = !this.riskTipsDialogVisible;
    },
    cancelWitness(val) {
      if (val) {
        this.riskTipsDialogVisible = false;
        this.setWillExecuteSysType(sysType.CancelWitness);
        setTimeout(() => {
          this.transactionDialogVisible = true;
          this.getNeedGas();
        }, 400);
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
        // Message.error(`${result}`)
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
        Message.success(this.$t("proposal.optionSuccess"));
        dialog.close();
        this.$router.push("/transactionList");
      } else {
        dialog.stopLoading();
        Message.error(`${result}`);
      }
    },
    async getWitnessCurrentUsers() {
      let { code, result } = await api.getWitnessCurrentUsers(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.total = result ? result.length : 0;
        this.list = result || [];
      } else {
        // console.error(`${code}: ${result}`);
      }
    },
    async witnessGetWitnessFee() {
      let { code, result } = await api.witnessGetWitnessFee(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        // 当前可提
        this.withdrawCurMoney = result
          ? toBigNumber(result.Additional).plus(toBigNumber(result.WitnessFee))
          : 0;
        //已冻结见证手续费
        this.witnessFeeFreezed = result
          ? toBigNumber(result.WitnessFeeFreezed)
          : 0;
        //可提见证手续费
        this.feeCost = result ? toBigNumber(result.WitnessFee) : 0;
        //工作预奖励
        this.preReward = result ? toBigNumber(result.AdditionalFreezed) : 0;
        //可提工作奖励
        this.canReward = result ? toBigNumber(result.Additional) : 0;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getWitnessReport() {
      let { code, result: getWitnessReportResult } = await api.getWitnessReport(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.haveWitness = getWitnessReportResult
          ? getWitnessReportResult.voted_units
          : 0;
        this.ActualGenerateUnit = getWitnessReportResult
          ? getWitnessReportResult.created_units
          : 0;
        this.notWitness = getWitnessReportResult
          ? parseInt(
              getWitnessReportResult.should_vote_units -
                getWitnessReportResult.voted_units
            )
          : 0;
        this.voteRate = getWitnessReportResult
          ? parseInt(
              (getWitnessReportResult.voted_units /
                (getWitnessReportResult.should_vote_units || 1)) *
                100
            )
          : 0;
        let { code, result } = await api.getHeaderByHash(
          getWitnessReportResult.voted_last_unit
        );
        if (code === api.SUCCESS) {
          this.lastBlockTimeStamp = parseInt(result.timestamp);
          this.lastBlockHash = result.hash;
        } else {
          this.noLastBlock = true;
        }
      } else {
        console.error(`${code}: ${result}`);
      }
    }
  },
  created() {
    this.isWitness();
    this.witnessGetWitnessFee();
    this.getWitnessReport();
    this.getWitnessCurrentUsers();
    this.startTimeout();
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  }
};
</script>

<style scoped lang="scss">
.witnessFeeDetail {
  li {
    p {
      &:first-child {
        margin-bottom: 4px;
      }
      &:last-child {
        margin-bottom: 6px;
      }
    }
    &:last-child p:last-child {
      margin-bottom: 0;
    }
  }
}
.el-collapse {
  border: none;
  /deep/ .el-collapse-item__content {
    padding: 0;
  }
  /deep/ .el-collapse-item__header {
    border: none;
  }
  /deep/ .el-collapse-item__wrap {
    border: none;
  }
  /deep/ .el-icon-arrow-right {
    margin-right: 150px;
  }
}
.disabledBtn {
  opacity: 0.5;
}

.lastHash {
  margin-top: 4px;
  width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    color: #f68d27;
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
  justify-content: space-between;
  flex-direction: column;
  > div {
    box-sizing: border-box;
    background: #fff;
    &:nth-child(1) {
      padding: 25px 20px;
      margin-bottom: 30px;
      flex-shrink: 0;
      display: flex;
      position: relative;
    }
    &:nth-child(2) {
      padding: 25px 40px;
      flex: 3;
      margin-bottom: 30px;
    }
    &:nth-child(3) {
      display: flex;
      align-items: center;
      height: 160px;
      padding: 25px 40px;
      flex: 2;
      margin-bottom: 30px;
    }
  }
}

.main {
  margin-left: 350px;
  height: 100%;
  background: #fff;
  flex-direction: column;
  display: flex;
  h4 {
    margin-top: 30px;
    margin-left: 30px;
  }
  > div {
    &:nth-child(1) {
      margin-right: 20px;
      flex-shrink: 0;
    }
    &:nth-child(2) {
      box-sizing: border-box;
      background: #fff;
      padding: 0 30px;
      flex: 1;
      overflow: hidden;
    }
  }
}

.avatarInfo {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.avatar {
  margin: 20px auto;
  .icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.witnessFee {
  li {
    margin-bottom: 20px;
    p {
      color: #333;
      &:first-child {
        font-size: 14px;
        margin-top: 10px;
      }
      &:nth-child(2) {
        margin-top: 16px;
        font-weight: bold;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.cancelWitness {
  color: #777;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 14px;
  cursor: pointer;
}

.noPointer {
  cursor: default;
}

.detail {
  margin-left: 30px;
  margin-top: 20px;
  p {
    font-size: 16px;
    color: #333;
    &:first-child {
      font-weight: bold;
    }
    &:nth-child(2) {
      font-size: 14px;
      color: #777;
    }
    margin: 0 auto 15px;
  }
}

.btnContainer {
  width: 100%;
  margin-top: 30px;
  background: #f3f5f6 !important;
  text-align: center;
}

.btn {
  border: none;
  width: 100%;
  border-radius: 4px;
}

.withdrawMoney {
  color: #fff;
  background: #5b8bff;
  border: none;
  margin-top: 20px;
  &:hover {
    background: #5b8bff;
    opacity: 0.8;
  }
}

.proposalTotalTitle {
  font-weight: bold;
  font-size: 18px;
}

.proposalTotal {
  width: 100%;
  li {
    &:nth-child(2) {
      margin: 20px 0;
    }
    display: flex;
    justify-content: space-between;
    p {
      font-size: 14px;
    }
    color: #333;
  }
}

.heart {
  padding: 36px 40px;
  p {
    text-align: center;
    &:first-child {
      font-weight: bold;
      font-size: 18px;
    }
    &:last-child {
      margin-top: 30px;
      font-size: 40px;
    }
  }
}

.LastUnit {
  padding: 36px 40px;
  font-size: 14px;
  li:first-child {
    margin-bottom: 20px;
  }
  li:last-child {
    cursor: pointer;
  }
  p {
    color: #333;
    &:first-child {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}

.filter {
  display: flex;
  li {
    padding: 0 20px;
    color: #606060;
    &:first-child {
      padding-left: 0;
      border-right: 1px solid #dbdbdb;
    }
    span {
      cursor: pointer;
    }
    &.isActive {
      span {
        color: #f68d27;
      }
    }
  }
}

.list {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.identity {
  width: 24px;
  height: 20px;
  background-size: 24px 20px;
  background-position: center;
  background-repeat: no-repeat;
}

.userWitness {
  background-image: url("../components/accountList/imgs/userWitness.png");
}

.sysWitness {
  background-image: url("../components/accountList/imgs/sysWitness.png");
}

.council {
  width: 22px;
  height: 20px;
  background-size: 22px 20px;
  background-image: url("../components/accountList/imgs/council.png");
}
</style>
