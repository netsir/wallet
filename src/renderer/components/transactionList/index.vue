<template>
  <el-table :data="list" :row-style="{height:'60px'}">
    <el-table-column :label="$t('transaction.transactionTime')" min-width="130px">
      <template slot-scope="scope">
        {{scope.row.time / 1000000000 | formatTime}}
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.type')" min-width="170px">
      <template slot-scope="scope">
        {{$t(`type2TextMap.${scope.row.type}`)}}
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.accounts')" min-width="260px">
      <template slot-scope="scope">
        <div class="account">
          <el-row type="flex">
            <el-col :span="6" class="elColItem">
              <avatar size="small" :color="getAddressInfo(scope.row.from).color"
                      :identity="getAddressInfo(scope.row.from).role.identity"
                      :active="getAddressInfo(scope.row.from).role.active"
              />
              <span class="accountName">{{getAddressInfo(scope.row.from).name}}</span>
            </el-col>
            <el-col :span="3" class="arrowRight">
              <i class="iconfont icon-arrow-right"></i>
            </el-col>
            <el-col :span="8" class="elColItem" min-width="120">
              <avatar size="small" :color="getAddressInfo(scope.row.to).color"
                      :identity="getAddressInfo(scope.row.to).role.identity"
                      :active="getAddressInfo(scope.row.from).role.active"
              />
              <span class="accountName">{{getAddressInfo(scope.row.to).name}}</span>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.status')">
      <template slot-scope="scope">
        {{$t(`status2TextMap.${scope.row.status}`)}}
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.sum')" min-width="103px">
      <template slot-scope="scope">
        {{scope.row.amount | toNts}}
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.operation')">
      <template slot-scope="scope">
        <router-link tag="span" :to="`/transactionDetail/${scope.row.hash}`">
          <i class="iconfont icon-youjiantou" style="color:#777"></i>
        </router-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import vuexData from "../../mixins/vuexData";
import i18n from "../../lang/index";
import { identity } from "../../const/account";
import avatar from "../../components/avatar";

const type2TextMap = {
  contract_run: i18n.t("contract.contractRun"),
  transfer: i18n.t("transaction.transfer"),
  contract_deploy: i18n.t("contract.contractDeploy")
};
const status2TextMap = {
  underway: i18n.t("transaction.underway"),
  pass: i18n.t("transaction.pass"),
  failed: i18n.t("transaction.failed")
};
const CONTRACT_ADDRESS_SUFFIX = "nsc1";

export default {
  name: "transaction-list",
  props: ["list"],
  mixins: [vuexData],
  components: {
    [avatar.name]: avatar
  },
  filters: {
    type2Text(type) {
      return type2TextMap[type];
    },
    status2Text(status) {
      return status2TextMap[status];
    }
  },
  methods: {
    isSysAddress(address) {
      return this.sysChainAddress.toLowerCase() === address.toLowerCase();
    },
    isMyAccount(address) {
      return !!this.accountsMap[address];
    },
    isContractAddress(address) {
      return address.slice(0, 4) === CONTRACT_ADDRESS_SUFFIX;
    },
    getAccountRole(address) {
      if (this.isMyAccount(address)) return this.accountsMap[address].role;
      if (this.isSysAddress(address))
        return { identity: identity.system, active: true };
      if (this.isContractAddress(address))
        return { identity: identity.contract, active: true };
      return { identity: identity.anonymity, active: false };
    },
    getAccountName(address) {
      if (this.isMyAccount(address)) return this.accountsMap[address].name;
      if (this.isSysAddress(address)) return this.$t("account.systemChain");
      return address;
    },
    getAddressInfo(address) {
      const accountsMap = this.accountsMap;
      return {
        name: this.getAccountName(address),
        role: this.getAccountRole(address),
        color: (accountsMap[address] && accountsMap[address].color) || ""
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
.elColItem {
  display: flex;
  align-items: center;
  min-width: 100px;
}

.arrowRight {
  display: flex;
  align-items: center;
  min-width: 68px;
}

.icon-iconqianwang {
  padding: 4px;
  color: #f68d27;
  font-size: 22px;
  cursor: pointer;
}

.iconfont.icon-touxiangcopy {
  font-size: 22px;
  position: relative;
  top: -2px;
  color: #777;
}

.icon-heyue {
  font-size: 24px;
}

.icon-arrow-right {
  padding: 0 10px;
  font-size: 22px;
  margin-right: 10px;
}

.accountName {
  width: 70px;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
