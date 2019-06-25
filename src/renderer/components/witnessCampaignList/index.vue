<template>
  <el-table  :data="list" :row-style="{height:'60px'}" align="center">
    <el-table-column  :label="$t('transaction.orderNumber')" prop="idx" width="150" align="center">
    </el-table-column>
    <el-table-column :label="$t('system.time')" min-width="150px" align="center">
      <template slot-scope="scope">
        {{scope.row.Time / 1000000000 | formatTime}}
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.address')" min-width="150px" align="center"  width="500px">
      <template slot-scope="scope">
        <div :class="$style.elColItem">
          <div>{{scope.row.Address}}</div>
          <div :class="$style.creater" v-if="isMyAccount(scope.row.Address)">
            (
            <avatar :class="$style.userImg" size="small" :color="getAddressInfo(scope.row.Address).color"
                    :identity="getAddressInfo(scope.row.Address).role.identity"
                    :active="getAddressInfo(scope.row.Address).role.active"
            ></avatar>
            <span :class="$style.accountName">{{getAddressInfo(scope.row.Address).name}}</span>
            )
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column  :label="$t('transaction.sum')" align="center">
      <template slot-scope="scope">
        {{scope.row.Margin | toNts}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import vuexData from "../../mixins/vuexData";
import i18n from "../../lang/index";
import { identity } from "../../const/account";
import avatar from "../../components/avatar";

export default {
  name: "witness-campaign-list",
  props: ["list"],
  mixins: [vuexData],
  components: {
    [avatar.name]: avatar
  },
  methods: {
    getAddressInfo(address) {
      /*
     *   {
     *     name: 自身账户 -> 名称 | 系统链 -> 系统链 | 其他账户/合约地址 -> 地址
     *     identity: 1 自身账户 2 系统链/合约地址 3 其他账户
     *     color: 自身账户颜色
     *   }
     * */
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
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
