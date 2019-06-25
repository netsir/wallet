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
          <p>{{$t('proposal.heartbeat')}} {{heartbeat}}%</p>
        </div>
        <span class="cancelWitness noPointer" v-if="!isActive">{{$t('witnessStatus.LoggedOut')}}</span>
        <span @click="riskTipsToggle" class="cancelWitness" v-else>{{$t('account.cancelWitness')}} </span>
      </div>
      <div class="canTakeDetail">
        <ul class="witnessFee">
          <li>
            <p>{{$t('account.canTake')}} (NTS)</p>
            <p>{{withdrawCurMoney | toNts}}</p>
          </li>
        </ul>
        <h3>{{$t('account.withdrawDetail')}}</h3>
        <ul class="witnessFeeDetail">
          <li>
            <p>{{$t('account.preReward')}} (NTS)</p>
            <p>{{preReward | toNts}}</p>
          </li>
          <li>
            <p>{{$t('account.canReward')}} (NTS)</p>
            <p>{{canReward | toNts}}</p>
          </li>
        </ul>
      </div>
      <div>
        <p class="proposalTotalTitle">{{$t('proposal.proposalTotal')}}</p>
        <ul class="proposalTotal">
          <li>
            <p>{{$t('proposal.joinTotal')}}</p>
            <p>{{joinTotal}}</p>
          </li>
          <li>
            <p>{{$t('proposal.haveJoinTotal')}}</p>
            <p>{{haveJoinTotal}}</p>
          </li>
        </ul>
      </div>

      <div class="btnContainer">
        <el-button v-if="isActive"
                   :class="{'btn':true,'btnThemeColor':true,'disabledBtn':canWithDrawMoney}"
                   :disabled="canWithDrawMoney"
                   @click="withdrawMoney">
          {{$t('account.withdrawMoney')}}
        </el-button>
        <el-button v-else :class="{'btn':true,'btnThemeColor':true,'disabledBtn':canWithDrawMoney}"
                   :disabled="canWithDrawMoney" @click="withdrawMoney">{{$t('account.withdrawMoney')}}
        </el-button>
      </div>
    </div>
    <div class="main">
      <ul class="filter">
        <li :class="{isActive: curFilter === 1}" @click="curFilter = 1">
          <span>{{$t('proposal.joinProposal')}}</span>
        </li>
        <li :class="{isActive: curFilter === 2}" @click="curFilter = 2">
          <span>{{$t('proposal.joinHaveJoinTotal')}}</span>
        </li>
      </ul>
      <div>
        <el-table class="list" :data="list" stripe :row-style="{height:'60px'}">
          <el-table-column :label="$t('system.time')" width="200px" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.apply_time/1000000000 | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('transaction.type')" align="center">
            <template slot-scope="scope">
              <span>
                {{$t(`proposal.${scope.row.type}`) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('proposal.proposalHash')" align="center">
            <template slot-scope="scope">
              <router-link tag="span" class="linkToDetail" :to="`/proposal/detail/${scope.row.id}`">
                {{scope.row.id}}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="list.length && total > pageSize">
          <el-pagination @current-change="getList" :current-page.sync="curPage" :page-size="pageSize"
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
    <risk-tips-dialog v-model="riskTipsDialogVisible" @riskRead="cancelCouncil"/>

  </div>
</template>

<script>
import vuexData from "../mixins/vuexData";
import * as api from "../../api";
import { toBigNumber, BigNumberEqualZero } from "../utils";
import { identity } from "../const/account";
import { Message } from "element-ui";
import avatar from "../components/avatar";
import { getTx } from "../utils";
import transactionDialog from "../components/dialog/transactionDialog";
import { getTransactionABI } from "../contract";
import { type as sysType } from "../const/system";
import riskTipsDialog from "../components/dialog/riskTipsDialog";

export default {
  name: "councilDetail",
  mixins: [vuexData],
  components: {
    [avatar.name]: avatar,
    [transactionDialog.name]: transactionDialog,
    [riskTipsDialog.name]: riskTipsDialog
  },
  data() {
    return {
      withdrawCurMoney: this.$t("system.calculateMoney"),
      witnessFeeFreezed: this.$t("system.calculateMoney"),
      preReward: this.$t("system.calculateMoney"),
      canReward: this.$t("system.calculateMoney"),
      feeCost: this.$t("system.calculateMoney"),
      transactionDialogVisible: false,
      riskTipsDialogVisible: false,
      gettingNeedGas: false,
      willExecuteSysType: "",
      transactionNeedGas: 0,
      curFilter: 1,
      curPage: 1,
      joinTotal: 0,
      haveJoinTotal: 0,
      pageSize: 10,
      heartbeat: 0,
      errorMsg: "",
      list: [],
      councilInfo: "",
      activeNames: ["1"]
    };
  },
  watch: {
    curAccount(v) {
      if (
        v.role.identity === identity.userWitness ||
        v.role.identity === identity.sysWitness
      ) {
        return this.$router.push(`/witnessDetail/${this.curAccount.address}`);
      }
    },
    "curAccount.address"(v) {
      if (v) {
        setTimeout(() => {
          this.getCouncilInfo();
          this.getList();
          this.witnessGetWitnessFee();
          this.getProposalHaveJoin(1, true);
          this.getCouncilHeartbeat();
        }, 300);
      }
    },
    curFilter() {
      this.getList();
    }
  },
  computed: {
    //有身份才能进来提现相关操作，加入注销的理事也能进来的操作，进来后调用getCouncilInfo来拿到是否是理事
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
      if (this.willExecuteSysType === "") return;
      return getTransactionABI(this.willExecuteSysType);
    },
    sysType() {
      return sysType.Settlement;
    },
    total() {
      return this.curFilter === 1 ? this.joinTotal : this.haveJoinTotal;
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
    setWillExecuteSysType(sysType) {
      this.willExecuteSysType = sysType;
    },
    async getCouncilInfo() {
      if (!this.isAccessible) {
        this.$router.push(`/account/${this.curAccount.address}`);
        return Message.error(this.$t("account.withdrawMoneyOperation"));
      }
      let { code, result } = await api.getCouncilInfo(this.curAccount.address);
      if (code === api.SUCCESS) {
        this.councilInfo = result;
      }
    },
    riskTipsToggle() {
      this.riskTipsDialogVisible = !this.riskTipsDialogVisible;
    },
    cancelCouncil(val) {
      if (val) {
        if (val) {
          this.riskTipsDialogVisible = false;
          this.setWillExecuteSysType(sysType.councilExit);
          setTimeout(() => {
            this.transactionDialogVisible = true;
            this.getNeedGas();
          }, 400);
        }
      }
    },
    async witnessGetWitnessFee() {
      let { code, result } = await api.witnessGetWitnessFee(
        this.curAccount.address
      );
      // 当前可提
      if (code === api.SUCCESS) {
        console.log(result);
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
    withdrawMoney() {
      this.setWillExecuteSysType(sysType.Settlement);
      this.transactionDialogVisible = true;
      this.getNeedGas();
    },
    // withdrawFronzonMoney() {
    //   this.setWillExecuteSysType(sysType.Settlement);
    //   this.transactionDialogVisible = true;
    //   this.getNeedGas();
    // },
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
    async getList(page = this.curPage) {
      let getApi =
        this.curFilter === 1 ? api.getProposalJoin : api.getProposalHaveJoin;
      let { code, result } = await getApi(
        this.curAccount.address,
        page,
        this.pageSize
      );
      if (code === api.SUCCESS) {
        this.list = result.list;
        this[this.curFilter === 1 ? "joinTotal" : "haveJoinTotal"] = result.sum;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getProposalHaveJoin(page = this.curPage, init = false) {
      let { code, result } = await api.getProposalHaveJoin(
        this.curAccount.address,
        page,
        this.pageSize
      );
      if (code === api.SUCCESS) {
        if (!init) {
          this.list = result.list;
        }
        this.haveJoinTotal = result.sum;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getCouncilHeartbeat() {
      let { code, result } = await api.getCouncilHeartbeat(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.heartbeat = result ? result.Count : 0;
      } else {
        console.error(`${code}: ${result}`);
      }
    }
  },
  created() {
    this.getCouncilInfo();
    this.getList();
    this.witnessGetWitnessFee();
    this.getProposalHaveJoin(1, true);
    this.getCouncilHeartbeat();
  }
};
</script>

<style scoped lang="scss">
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

.noPointer {
  cursor: default;
}

.disabledBtn {
  opacity: 0.5;
}

.linkToDetail {
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #4eb1ff;
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

.cancelWitness {
  color: #777;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 14px;
  cursor: pointer;
}

.proposalTotal {
  margin-top: 40px;

  li {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    p {
      font-size: 14px;
      text-align: center;

      &:first-child {
        color: #333;
      }
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
  justify-content: space-between;

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
      height: 160px;
      padding: 25px 40px;
      flex: 2;
      margin-bottom: 30px;
    }
  }
}

.witnessFeeDetail {
  margin-top: 20px;
  font-size: 13px;
  line-height: 1.77;
  li {
    p {
      &:first-child {
        margin-bottom: 8px;
      }

      &:last-child {
        margin-bottom: 8px;
      }
    }

    &:last-child p:last-child {
      margin-bottom: 0;
    }
  }
}

.witnessFee {
  li {
    margin-bottom: 20px;

    p {
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

.canTakeDetail {
  h3 {
    height: 48px;
    line-height: 48px;
    color: #303133;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
    font-size: 13px;
    font-weight: 500;
    transition: border-bottom-color 0.3s;
    outline: 0;
  }
}

.main {
  height: 100%;
  margin-left: 350px;
  background: #fff;
  flex-direction: column;
  display: flex;

  > div {
    &:nth-child(1) {
      width: 380px;
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
  background: #f3f5f6 !important;
  text-align: center;
}

.btn {
  width: 320px;
  border-radius: 4px;
  border: none;
}

.withdrawMoney {
  color: #fff;
  background: #5b8bff;
  border: none;
  margin-top: 20px;

  &:hover {
    background: #5b8bff;
  }
}

.proposalTotalTitle {
  font-size: 18px;
  font-weight: bold;
}

.proposalTotalInfo {
  display: flex;
  margin-top: 30px;

  li {
    flex: 1;

    &:first-child {
      border-right: 1px solid #8c939d;
    }

    p {
      font-size: 14px;
      text-align: center;

      &:first-child {
        color: #777;
      }

      &:last-child {
        margin-top: 10px;
      }
    }
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
      font-size: 60px;
    }
  }
}

.filter {
  display: flex;
  margin-top: 30px;
  margin-left: 30px;

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
  margin-top: 12px;
  text-align: right;
}

.identity {
  width: 36px;
  height: 30px;
  background-size: 36px 30px;
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
  width: 34px;
  height: 30px;
  background-size: 34px 30px;
  background-image: url("../components/accountList/imgs/council.png");
}
</style>
