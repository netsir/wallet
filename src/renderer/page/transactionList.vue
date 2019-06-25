<template>
  <nts-card :title="$t('transaction.transactionRecord')" class="ntsCard">
    <div class="selectType">
      <el-dropdown trigger="click" @visible-change="typeMenuVisibleChange" @command="selectType">
        <div>
          <span class="typeMenu">{{$t(`type2TextMapMenu.${curType}`)}}</span>
          <i class="el-icon-arrow-down" :class="{rollover: typeMenuVisible, icon: true}"></i>
        </div>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item v-for="(v, k) in $t('type2TextMapMenu')" :command="k" :key="k">{{v}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <transaction-list :list="txList"/>
    <div class="pagination" v-if="total > pageSize">
      <el-pagination @current-change="getTxList" :current-page.sync="curPage" :page-size="pageSize"
                     layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </nts-card>
</template>

<script>
import card from "../components/card";
import transactionList from "../components/transactionList";
import * as api from "../../api";
import vuexData from "../mixins/vuexData";
import * as contractDB from "../../modules/db/contract";

let timer = null;

export default {
  name: "transactionList",
  components: {
    [card.name]: card,
    [transactionList.name]: transactionList
  },
  mixins: [vuexData],
  data() {
    return {
      // 筛选框
      typeMenuVisible: false,
      curType: "all",
      // 分页
      curPage: 1,
      total: 1,
      pageSize: 10,
      // 交易记录列表
      txList: []
    };
  },
  watch: {
    curType() {
      this.getTxList();
    },
    "curAccount.address"() {
      this.curPage = 1;
      this.getTxList();
    }
  },
  methods: {
    typeMenuVisibleChange(val) {
      this.typeMenuVisible = val;
    },
    selectType(type) {
      this.curType = type;
      this.curPage = 1;
    },
    async getTxList() {
      this.contracts = (await contractDB.getContracts())
        .filter(i => !!i.name && !!i.contractAddress)
        .map(i => i.contractAddress);
      let { code, result } = await api.getTxList(
        this.contracts.concat([this.curAccount.address]),
        this.curType,
        this.curPage,
        this.pageSize
      );
      if (code === api.SUCCESS) {
        this.txList = result.list || [];
        this.total = result.sum || 0;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getTxList();
        this.setTimer();
      }, 5000);
    }
  },
  mounted() {
    this.getTxList();
    this.setTimer();
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  }
};
</script>

<style scoped lang="scss">
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
