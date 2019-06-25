<template>
  <el-table :data="list" stripe :row-style="{height:'60px'}">
    <el-table-column :label="$t('transaction.address')"  width="500px">
      <template slot-scope="scope">
        <div :class="$style.elColItem">
          <div>{{scope.row.holder}}</div>
          <div :class="$style.creater" v-if="isMyAccount(scope.row.holder)">
            (
            <avatar :class="$style.userImg" size="small" :color="getAddressInfo(scope.row.holder).color"
                    :identity="getAddressInfo(scope.row.holder).role.identity"
                    :active="getAddressInfo(scope.row.holder).role.active"
            ></avatar>
            <span :class="$style.accountName">{{getAddressInfo(scope.row.holder).name}}</span>
            )
          </div>
        </div>
      </template>
    </el-table-column>
    <!--<el-table-column prop="holder" :label="$t('transaction.address')" align="center"/>-->
    <el-table-column :label="$t('proposal.votingTime')" align="center">
      <template slot-scope="scope">
          <span>
            {{scope.row.voting_time / 1e9 | formatTime}}
          </span>
      </template>
    </el-table-column>
    <el-table-column prop="weights" :label="$t('proposal.weights')" align="center"/>
    <el-table-column :label="$t('proposal.result')" align="center">
      <template slot-scope="scope">
          <span :class="getResultClass(scope.row.result)">
            {{$t(`resultToTextMap.${scope.row.result}`)}}
          </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import vuexData from "../../mixins/vuexData";
import avatar from "../../components/avatar";
import { identity } from "../../const/account";

export default {
  name: "voteList",
  props: ["list"],
  mixins: [vuexData],
  components: {
    [avatar.name]: avatar
  },
  methods: {
    getAddressInfo(address) {
      const accountsMap = this.accountsMap;
      return {
        name: this.getAccountName(address),
        role: this.getAccountRole(address),
        color: (accountsMap[address] && accountsMap[address].color) || ""
      };
    },
    isMyAccount(address) {
      return !!this.accountsMap[address];
    },
    getAccountRole(address) {
      if (this.isMyAccount(address)) return this.accountsMap[address].role;
      return {
        identity: identity.anonymity,
        active: false
      };
    },
    getAccountName(address) {
      if (this.isMyAccount(address)) return this.accountsMap[address].name;
    },
    getResultClass(result) {
      const resultToClass = {
        agree: this.$style.agree,
        disagree: this.$style.disagree
      };
      return resultToClass[result];
    }
  },
  created() {
    this.accountsMap = this.accounts.reduce((map, cur) => {
      map[cur.address] = {
        name: cur.name,
        color: cur.color,
        role: cur.role
      };
      return map;
    }, {});
  }
};
</script>

<style module lang="scss">
.accountName {
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.userImg {
  margin: 0 5px;
}
.elColItem {
  display: flex;
}
.creater {
  margin-left: 4px;
  display: flex;
  justify-content: center;
}
.disagree {
  color: red;
}

.agree {
  color: #409eff;
}
</style>
