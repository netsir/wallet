<template>
  <div :class="$style.container">
    <component :is="curListComponent" :list="curList"/>
  </div>
</template>

<script>
import {
  getProposalCouncilList,
  getProposalVoteList,
  SUCCESS
} from "../../../api";

import councilList from "./councilList";
import voteList from "./voteList";

import { status as statusMap } from "../../const/proposal";

let CouncilListTimer;
let VoteListTimer;

export default {
  name: "detail-list",
  components: {
    councilList,
    voteList
  },
  props: ["proposalHash", "proposalStatus"],
  data() {
    return {
      activeComponentName: "councilList",
      councilList: [],
      voteList: []
    };
  },
  computed: {
    curListComponent() {
      const Map = {
        councilList: councilList,
        voteList: voteList
      };
      this.$emit("messages", this.activeComponentName);
      return Map[this.activeComponentName];
    },
    curList() {
      const Map = {
        councilList: this.councilList,
        voteList: this.voteList
      };
      return Map[this.activeComponentName];
    },
    needRefreshCouncilList() {
      return this.proposalStatus === statusMap.in_approval;
    },
    needRefreshVoteList() {
      return this.proposalStatus === statusMap.in_voting;
    }
  },
  watch: {
    proposalStatus(status) {
      // 判断应当显示哪个列表
      if (status !== statusMap.in_approval && status !== statusMap.expired) {
        this.activeComponentName = "voteList";
      } else {
        this.activeComponentName = "councilList";
      }
      this.setTimer();
    }
  },
  methods: {
    async getProposalCouncilList() {
      let { code, result } = await getProposalCouncilList(this.proposalHash);
      if (code === SUCCESS) this.councilList = result;
      else console.error(`${code}: ${result}`);
    },
    async getVoteList() {
      let { code, result } = await getProposalVoteList(
        this.proposalHash,
        0,
        10
      );
      if (code === SUCCESS) this.voteList = result.votings;
      else console.error(`${code}: ${result}`);
    },
    setGetProposalCouncilListTimer() {
      CouncilListTimer = setTimeout(() => {
        this.getProposalCouncilList();
        this.needRefreshCouncilList && this.setGetProposalCouncilListTimer();
      }, 1000);
    },
    setGetVoteListTimer() {
      VoteListTimer = setTimeout(() => {
        this.getVoteList();
        this.needRefreshVoteList && this.setGetVoteListTimer();
      }, 1000);
    },
    // 根据状态判断是否需要轮询刷新列表数据
    setTimer() {
      if (this.needRefreshCouncilList) this.setGetProposalCouncilListTimer();
      if (this.needRefreshVoteList) this.setGetVoteListTimer();
    },
    setActiveComponentName(componentName) {
      this.activeComponentName = componentName;
    }
  },
  created() {
    this.getProposalCouncilList();
    this.getVoteList();
    this.setTimer();
  },
  beforeDestroy() {
    clearTimeout(VoteListTimer);
    clearTimeout(CouncilListTimer);
  }
};
</script>

<style module lang="scss">
.container {
  margin-top: 20px;
  background: #fff;
  padding: 14px;
}
</style>
