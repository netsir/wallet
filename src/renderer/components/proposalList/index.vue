<template>
  <el-table :data="list" class="container" :row-style="{height:'60px'}">
    <el-table-column :label="$t('system.time')" min-width="160px">
      <template slot-scope="scope">
        {{scope.row.apply_time / 1e9 | formatTime}}
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.address')" min-width="410px">
      <template slot-scope="scope">
        <div class="elColItem">
          <div>{{scope.row.creater}}</div>
          <div class="creater" v-if="isMyAccount(scope.row.creater)">
            (
            <avatar class="userImg" size="small" :color="getAddressInfo(scope.row.creater).color"
                    :identity="getAddressInfo(scope.row.creater).role.identity" :active="getAddressInfo(scope.row.creater).role.active"></avatar>
            <span class="accountName">{{getAddressInfo(scope.row.creater).name}}</span>
            )
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('system.type')" min-width="190px">
      <template slot-scope="scope">
        {{$t(`proposal.${scope.row.type}`)}}
        <!--{{scope.row.type | proposalTypeToText}}-->
      </template>
    </el-table-column>
    <el-table-column :label="$t('system.status')" min-width="170px">
      <template slot-scope="scope">
        <router-link v-if="scope.row.type==='sys_witness_campaign'||scope.row.type==='user_witness_campaign'"
                     :to="`/witnessCampaign/${scope.row.id}`"
                     :class="getStatusClass(scope.row.status)">
          {{$t(`proposal.${scope.row.status}`)}}
        </router-link>
        <router-link v-else :to="`/proposal/detail/${scope.row.id}`"
                     :class="getStatusClass(scope.row.status)">
          {{$t(`proposal.${scope.row.status}`)}}
        </router-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { status as statusMap } from "../../const/proposal";
import vuexData from "../../mixins/vuexData";
import avatar from "../avatar";
import { identity } from "../../const/account";

export default {
  name: "proposal-list",
  props: ["list"],
  components: {
    [avatar.name]: avatar
  },
  mixins: [vuexData],
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
        active: true
      };
    },
    getAccountName(address) {
      if (this.isMyAccount(address)) return this.accountsMap[address].name;
    },
    getStatusClass(status) {
      return {
        ["check"]:
          status === statusMap.in_approval ||
          status === statusMap.in_voting ||
          status === statusMap.pending_judge,
        ["pass"]: status === statusMap.passed,
        ["fail"]: status === statusMap.failed,
        ["failure"]: status === statusMap.expired
      };
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

<style scoped lang="scss">
/*.tableList {*/
/*width: 550px;*/
/*}*/
.elColItem {
  display: flex;
}
.creater {
  margin-left: 4px;
  display: flex;
  justify-content: center;
}
.accountName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.userImg {
  margin: 0 5px;
}

.container {
  width: 100%;
  a {
    text-decoration: none;
  }
}

.check {
  color: rgb(141, 213, 206);
}

.pass {
  color: #87a8fd;
}

.fail {
  color: #fb848a;
}

.failure {
  color: #c0c0c0;
}
</style>
