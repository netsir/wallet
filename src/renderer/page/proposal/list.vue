<template>
  <div>
    <nts-card :title="$t('proposal.proposalList')" class="ntsCard">
      <el-button  class="addProposal" @click.native="$router.push('/proposal/create')">+{{$t('proposal.newProposal')}}</el-button>
      <div class="selectType">
        <el-dropdown trigger="click" @visible-change="typeMenuVisibleChange" @command="selectType" >
          <div>
            <span class="typeMenu">{{$t(`typeToTextMap.${curType}`)}}</span>
            <i class="el-icon-arrow-down" :class="{rollover: typeMenuVisible, icon: true}"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(v, k) in $t('typeToTextMap')" :command="k" :key="k">{{v}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <proposal-list :list="list"/>

      <div class="pagination" v-if="list.length && total > pageSize">
        <el-pagination @current-change="getProposalList" :current-page.sync="curPage" :page-size="pageSize"
                       layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </nts-card>
  </div>
</template>

<script>
import card from "../../components/card";
import createButton from "../../components/createButton";
import proposalList from "../../components/proposalList";
import { status } from "../../const/proposal";
import { getProposalList, SUCCESS } from "../../../api";

const typeToProposalStatusMap = {
  all: [],
  active: [status.in_approval, status.in_voting, status.pending_judge],
  pass: [status.passed],
  fail: [status.expired, status.failed]
};

let timer;

export default {
  components: {
    [createButton.name]: createButton,
    [proposalList.name]: proposalList,
    [card.name]: card
  },
  data() {
    return {
      // 筛选框
      typeMenuVisible: false,
      curType: "all",
      // 分页
      curPage: 1,
      total: 0,
      pageSize: 15,
      // 议案列表
      list: []
    };
  },
  watch: {
    curType() {
      this.getProposalList();
    }
  },
  methods: {
    selectType(type) {
      this.curType = type;
      this.curPage = 1;
    },
    typeMenuVisibleChange(val) {
      this.typeMenuVisible = val;
    },
    async getProposalList(page = this.curPage) {
      let { code, result } = await getProposalList(
        page,
        this.pageSize,
        typeToProposalStatusMap[this.curType]
      );
      if (code === SUCCESS) {
        this.list = result.list || [];
        this.total = result.sum || 0;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getProposalList();
        this.setTimer();
      }, 5000);
    }
  },
  created() {
    this.getProposalList();
    this.setTimer();
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  }
};
</script>


<style scoped lang="scss">
.addProposal {
  margin-top: 5px;
  float: right;
  height: 32px;
  padding: 8px 25px;
  font-size: 14px;
  color: #555;
  /*padding-right: 25px;*/
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
  margin-left: 0px;
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
