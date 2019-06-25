<template>
  <div class="bg">
    <nts-card :title="$t('transaction.transactionDetail')" class="bgWhite">
      <div class="detail">
        <nts-item :label="$t('system.time')">{{info.time / 1000000000 | formatTime}}</nts-item>
        <nts-item :label="$t('system.expirationTime')">{{info.expiration_time / 1000000000 | formatTime}}</nts-item>
        <nts-item :label="$t('transaction.hash')">{{hash}}</nts-item>
        <nts-item :label="$t('transaction.status')">{{$t(`status2TextMap.${info.status}`)}}
          <el-button v-if="info.status === 'underway'" size="small" class="btnResend btnThemeColor" @click="reBroadcastTx">{{$t('system.sendAgain')}}</el-button>
        </nts-item>
        <nts-item :label="$t('transaction.type')">{{$t(`type2TextMap.${info.type}`)}}</nts-item>
        <nts-item :label="$t('system.from')">{{info.from}}</nts-item>
        <nts-item :label="$t('system.to')">{{info.to}} {{executeMethodsName}}</nts-item>
        <nts-item :label="$t('transaction.gasLimit')">{{parseInt(info.gas)}}</nts-item>
        <nts-item :label="$t('transaction.gasPrice')">{{parseInt(info.gasPrice)}} DOT</nts-item>
        <nts-item :label="$t('transaction.poundage')">{{poundageText}}</nts-item>
        <nts-item :label="$t('transaction.transactionAmount')">{{info.amount | toNts}} NTS</nts-item>
        <nts-item :label="$t('transaction.randomNumber')">{{info.seed}}</nts-item>
        <nts-item :label="$t('transaction.transactionInput')">
          <div class="inputBox">
            <el-input readonly type="textarea" :autosize="{ minRows: 1, maxRows: 6}" resize="vertical" v-model="inputValue"/>
            <div v-if="canDecode">
               <span  class="decodeBtn" v-if="isContractExecute" @click="decodeABIBtn">{{hasDecode ? $t('system.return') : $t('system.decode')}}</span>
               <span  class="decodeBtn" v-else @click="decodeUTF8Btn">{{hasDecode ? $t('system.return') : $t('system.decode')}}</span>
            </div>
          </div>
        </nts-item>
      </div>
    </nts-card>
    <nts-card :title="$t('transaction.transactionUnit')" class="bgWhite">
      <el-table :data="unitList" :row-style="{height:'60px'}">
        <el-table-column :label="$t('transaction.unitHash')" prop="unit_hash" min-width="400px"/>
        <el-table-column :label="$t('transaction.unitState')">
          <template slot-scope="scope">
            <span>{{$t(`unitStatus2TextMap.${scope.row.unit_status}`)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('transaction.unitAction')">
          <template slot-scope="scope">
            <span>{{$t(`unitAction2TextMap.${scope.row.action}`)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('transaction.executionResult')" >
          <template slot-scope="scope">
            <span>{{$t(`executionResult.${scope.row.failed}`) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('transaction.operation')">
          <template slot-scope="scope">
            <router-link tag="span" :to="`/unitDetail/${scope.row.unit_hash}`">
              <i class="iconfont icon-youjiantou"></i>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </nts-card>
  </div>
</template>

<script>
import card from "../../components/card";
import item from "../../components/item";
import * as api from "../../../api/index";
import { getContract } from "../../../modules/db/contract";
import { Message } from "element-ui";
import vuexData from "../../mixins/vuexData";

const CONTRACT_ADDRESS_SUFFIX = "nsc1";
import { web3 } from "../../main";
export default {
  name: "transactionDetail",
  components: {
    [item.name]: item,
    [card.name]: card
  },
  data() {
    return {
      hash: this.$route.params.hash,
      info: {},
      unitList: [],
      contractByDb: null,
      contract: null,

      hasDecode: false
    };
  },
  mixins: [vuexData],
  computed: {
    inputValue() {
      let val = this.info.input !== "0x" ? this.info.input : "";
      return this.hasDecode ? this.info.friendlyInput : val;
    },
    executeMethodsName() {
      if (!this.contract) return "";
      let contractName = this.contractByDb.name;
      let methodsName = this.contract._jsonInterface.filter(
        i => i.signature === this.info.input.slice(0, 10)
      )[0].name;
      return `( ${contractName} : ${methodsName} )`;
    },
    canDecode() {
      return this.info.input !== "0x";
    },
    isContractExecute() {
      if (!this.info.to) return false;
      return this.info.to.slice(0, 4).toLowerCase() === CONTRACT_ADDRESS_SUFFIX;
    },
    poundageText() {
      if (!this.info.gas) return;
      let used = parseInt(this.info.gasUsed) * parseInt(this.info.gasPrice);
      let limit = parseInt(this.info.gas) * parseInt(this.info.gasPrice);
      if (this.info.status === "underway") {
        // return `交易进行中-已用 ${used} DOT (剩余 ${limit - used} DOT)`;
        return this.$t('transaction.underway2', {used, remain: limit - used});
      } else {
        return `${used} DOT`;
      }
    }
  },
  methods: {
    async reBroadcastTx() {
      let { code, result } = await api.reBroadcastTx(this.hash);
      if (code === api.SUCCESS) {
        Message.success(this.$t("transaction.reBroadcast"));
        this.getDetail();
        this.getTxUnit();
      } else {
        Message.error(`${result}`);
      }
    },
    async getDetail() {
      let { code, result } = await api.getTransactionDetail(this.hash);
      if (code === api.SUCCESS) {
        this.info = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getTxUnit() {
      let { code, result } = await api.getTxUnit(this.hash);
      if (code === api.SUCCESS) {
        this.unitList = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getContractInfo() {
      let result = await getContract({ contractAddress: this.info.to });
      if (!result) return;
      this.contractByDb = result;
      this.contract = new web3.nts.Contract(result.jsonInterface);
    },
    decodeUTF8Btn() {
      this.info.friendlyInput = web3.utils.hexToUtf8(this.info.input);
      this.hasDecode = !this.hasDecode;
    },
    async decodeABIBtn() {
      let contractInfoByDb = await getContract({
        contractAddress: this.info.to
      });
      if (!contractInfoByDb) return Message.error("未找到该合约的ABI");
      // 通过交易的输入获取合约的方法id
      let methodId = this.info.input.slice(0, 10);
      // todo
      let contract = new web3.nts.Contract(
        contractInfoByDb.jsonInterface,
        this.$store.state.system.sysChainAddress
      );
      // 获取该合约方法的inputs
      let {
        options: { jsonInterface }
      } = contract;
      let methodInfo = jsonInterface.filter(i => i.signature === methodId)[0];
      if (!methodInfo)
        return Message.error("该合约没有此方法, 请检查本地合约是否正确");
      let { inputs } = methodInfo;
      // 调用web3的解码
      let result;
      if (
        methodInfo.name === "CreateContract" &&
        this.info.to === this.$store.state.system.sysChainAddress
      ) {
        result = { code: this.info.input.replace(methodId, "") };
      } else {
        result = methodInfo.inputs.length
          ? web3.nts.abi.decodeParameters(
              methodInfo.inputs,
              this.info.input.replace(methodId, "")
            )
          : {};
        let dataName = methodInfo.inputs.map(i => i.name);
        let res = Object.keys(result).filter(i => !dataName.includes(i));
        res.map(i => {
          delete result[i];
        });
      }
      // if (code === api.SUCCESS) {
      this.info.friendlyInput = JSON.stringify(result, null, 4);
      this.hasDecode = !this.hasDecode;
      // } else {
      //   Message.error(`${result}`);
      // }
    }
  },
  async created() {
    this.getTxUnit();
    await this.getDetail();
    this.getContractInfo();
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/index";

.bg {
  background-color: #f3f5f6;
}
.bgWhite {
  background-color: #fff;
}
.btnResend {
  height: 30px;
  margin-left: 20px;
  font-size: 12px;
}

.detail {
  margin-top: 30px;
  color: rgb(51, 51, 51);
  font-size: 14px;
  div:nth-child(2n + 1) {
    background: rgb(250, 250, 250);
  }
}

.icon-iconqianwang {
  padding: 4px;
  color: #f68d27;
  font-size: 22px;
  cursor: pointer;
}

.input {
  margin-left: -10px;
  padding: 10px;
  max-height: 60px;
  overflow-y: scroll;
  word-wrap: break-word;
  word-break: normal;
  vertical-align: middle;
  display: block;
}

.inputBox {
  display: block;
  flex: 1;
}

.decodeBtn {
  display: inline-block;
  margin-top: 5px;
  cursor: pointer;
  color: #333333;
  &:hover {
    color: $themeColor;
  }
}
</style>
