<template>
  <div class="container">

    <h3 class="title">{{$t('proposal.newProposal')}}</h3>

    <el-form label-position="top" size="medium">

      <el-form-item :label="$t('proposal.creator')">
        <p class="curName">
          <avatar class="avatar" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"/>
          {{curAccount.name}}
        </p>
      </el-form-item>

      <el-form-item :label="$t('proposal.proposalType')" class="elSelect">
      <!-- todo 还特么用i18n语言包里的配置来遍历...不信抬头看 苍天绕过谁  -->
        <el-select v-model="proposalType" :placeholder="$t('system.pleaseChoose')" v-if="curAccount.role.identity === identity.council && curAccount.role.active">
          <el-option  :key="key" v-for="(text, key) in $t('councilSysType')" :label="text" :value="key"/>
        </el-select>
        <el-select v-model="proposalType" :placeholder="$t('system.pleaseChoose')" v-else-if="curAccount.role.identity === identity.userWitness|| curAccount.role.identity === identity.sysWitness">
          <el-option  :key="key" v-for="(text, key) in $t('witnessSysType')" :label="text" :value="key"/>
        </el-select>
        <el-select v-model="proposalType" :placeholder="$t('system.pleaseChoose')" v-else>
          <el-option :key="key" v-for="(text, key) in $t('commonSysType')" :label="text" :value="key"/>
        </el-select>
        <p  class="deposit" v-if="amount !== '0'">{{$t('transaction.deposit')}}: {{amount}} NTS</p>
      </el-form-item>

      <el-form-item :label="$t('proposal.needParamsInput')" v-show="needParamsInput" class="elSelect">
        <template v-if="proposalTypeIsCfgChange">
          <el-select v-model="consensusCfg" :placeholder="$t('system.pleaseChoose')">
            <el-option :key="index" v-for="(value,item,index) in $t('consensusConfig')" :label="value" :value="item"/>
          </el-select>
          <el-input-number class="input-number" v-model="proposalValue" :min="1" :max="99999999999" :step="stepValue" />
        </template>

        <el-input v-if="proposalTypeIsCouncilFire" class="input" v-model="proposalValue"
                  :placeholder="$t('proposal.proposalValue')"/>
      </el-form-item>
      <el-form-item class="mt40">
        <el-button class="btnThemeColor" @click="showTransactionDialog">{{$t('system.send')}}</el-button>
      </el-form-item>

    </el-form>

    <transaction-dialog v-model="transactionDialogVisible"
                        :amount="amount"
                        :amount-label="amount === '0' ? $t('transaction.amount') : $t('transaction.deposit')"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        :errorMsg="errorMsg"
                        @submit="sendTransaction"/>
  </div>
</template>

<script>
import transactionDialog from "../../components/dialog/transactionDialog";
import avatar from "../../components/avatar";
import { type as proposalTypes } from "../../const/proposal";
import { identity } from "../../const/account";
import { getTransactionABI } from "../../contract";
import vuexData from "../../mixins/vuexData";
import * as MP from "../../map/proposal";
import { Message } from "element-ui";
import { getTx, toDotBN, toNtsBN } from "../../utils";
import * as api from "../../../api";

let web3 = new Web3();

export default {
  name: "create-proposal",
  components: {
    [transactionDialog.name]: transactionDialog,
    [avatar.name]: avatar
  },
  mixins: [vuexData],
  data() {
    return {
      consensualConfigValue: 0,
      cancel: false,
      errorMsg: "",
      // 表单相关
      proposalType: "",
      consensusCfg: "",
      proposalValue: "",

      sysAddress: "",

      // transaction-dialog
      transactionDialogVisible: false,
      transactionNeedGas: 0,
      gettingNeedGas: false,

      proposalTypeSelectOption: [],
      consensusCfgTypeSelectOption: [],

      hasInit: false
    };
  },
  computed: {
    stepValue() {
      return this.consensusCfg === "ucGasLimit" ? 10 : 1;
    },
    proposalTypeIsCfgChange() {
      return this.proposalType === proposalTypes.config_change;
    },
    proposalTypeIsCouncilFire() {
      return this.proposalType === proposalTypes.council_fire;
    },
    proposalTypeIsCouncilAdd() {
      return this.proposalType === proposalTypes.council_add;
    },
    isIntNumber() {
      const intNumberReg = /^\d+$/;
      return intNumberReg.test(this.proposalValue);
    },
    canApplyCouncilAdd() {
      return this.curAccount.role.identity === identity.normal;
    },

    needParamsInput() {
      return this.proposalTypeIsCouncilFire || this.proposalTypeIsCfgChange;
    },

    sysType() {
      return MP.typeToSysTypeMap[this.proposalType];
    },

    amount() {
      if (this.proposalTypeIsCouncilAdd)
        return toNtsBN(
          this.$store.state.system.consensualConfig.councilMargin.current_val
        ).toString();
      else return "0";
    },

    transactionABIParams() {
      let params = [];
      switch (this.proposalType) {
        case proposalTypes.config_change:
          params = [this.consensusCfg, this.proposalValue];
          break;
        case proposalTypes.council_add:
          params = [];
          break;
        case proposalTypes.council_fire:
          params = [this.proposalValue.toString().trim()];
          break;
        case proposalTypes.user_witness_campaign:
          params = [];
          break;
        case proposalTypes.sys_witness_campaign:
          params = [];
          break;
      }
      return params;
    },

    transactionABI() {
      return getTransactionABI(this.sysType, this.transactionABIParams);
    }
  },
  watch: {
    "curAccount.address"() {
      this.proposalType = proposalTypes.config_change;
    },
    proposalType(val) {
      // 若修改共识配置，则给予共识配置的默认选项
      this.consensusCfg =
        val === proposalTypes.config_change
          ? this.consensusCfgTypeSelectOption[
              Object.keys(this.consensusCfgTypeSelectOption)[0]
            ].key
          : "";
    },
    consensusCfg(val) {
      // 给定共识配置的默认值
      if (val) {
        this.proposalValue = this.$store.state.system.consensualConfig[
          val
        ].current_val;
      } else this.proposalValue = "";
    },

    transactionDialogVisible(visible) {
      if (visible) this.getNeedGas();
    }
  },
  methods: {
    async showTransactionDialog() {
      if (!this.isIntNumber && this.proposalType === "config_change") {
        return Message.error(this.$t("proposal.isIntNumber"));
      }
      if (this.proposalTypeIsCouncilAdd && !this.canApplyCouncilAdd) {
        return Message.error(this.$t("proposal.proposalTypeIsCouncilAdd"));
      }
      if (
        this.proposalTypeIsCouncilAdd &&
        toNtsBN(this.curAccount.balance).toNumber() < parseInt(this.amount)
      ) {
        return Message.error(this.$t("account.balanceInsufficient"));
      }
      if (
        this.proposalTypeIsCouncilFire &&
        !web3.utils.isAddress(this.proposalValue)
      ) {
        return Message.error(this.$t("transaction.addressIllegal"));
      }
      if (this.proposalTypeIsCouncilFire) {
        let { code, result } = await api.getAccountStatus([this.proposalValue]);
        if (code === api.SUCCESS) {
          let { role, active } = result[this.proposalValue];
          let isCouncil = role === "council" && active;
          if (!isCouncil) {
            return Message.error(this.$t("proposal.canNotFireCouncil"));
          }
        } else {
          return Message.error(result);
        }
      }
      this.transactionDialogVisible = true;
    },

    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let tx = {
        ...getTx(0, 0, toDotBN(this.amount).toString(), 0),
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

    async sendTransaction(data, dialog) {
      let tx = {
        ...getTx(data.gas, data.gasPrice, data.amount, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.transactionABI
      };
      let { code, result } = await api.sendTransaction(tx, data.password);
      if (code === api.SUCCESS) {
        Message.success(this.$t("proposal.sendTransaction"));
        dialog.close();
        this.$router.push("/transactionList");
      } else {
        Message.error(`${result}`);
        dialog.stopLoading();
      }
    }
  },
  mounted() {
    if (this.cancel) {
      this.proposalType = proposalTypes.council_fire;
      this.proposalValue = this.curAccount.address;
    }
  },
  async created() {
    this.cancel = this.$route.query.cancel || false;
    this.consensusCfgTypeSelectOption = Object.keys(
      this.$store.state.system.consensualConfig
    ).reduce((obj, cur) => {
      if (this.$store.state.system.consensualConfig[cur].is_update) {
        obj[cur] = this.$store.state.system.consensualConfig[cur];
      }
      return obj;
    }, {});
    this.identity = identity;
    this.proposalType = Object.keys(proposalTypes)[0];
    this.hasInit = true;
  }
};
</script>

<style scoped lang="scss">
.mt40 {
  margin-top: 40px;
}

.container {
  padding: 30px;
  background: #fff;
}

.curName {
  display: flex;
  align-items: center;
  line-height: 40px;
  margin-left: -8px;
}

.avatar {
  margin: 0 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.sliderContainer {
  width: 400px;
  position: relative;
}

.sliderSignContainer {
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -6px;
}

.gasPrice {
  span {
    margin-left: 10px;
  }
}

.input {
  width: 280px;
}
.elSelect {
  /deep/ .el-input:first-child {
    width: 280px;
  }
}
.deposit {
  color: #666666;
  margin-top: 15px;
}
.input-number {
  margin-left: 14px;
}
</style>
