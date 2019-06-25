<template>
  <div class="containerFather">
    <div class="container">
      <nts-card :title="$t('transaction.unitDetail')" class="detail bgWhite minWidth">
        <nts-item :label="$t('transaction.unitTime')">{{parseInt(header.timestamp) / 1000000000 | formatTime}}</nts-item>
        <nts-item :label="$t('transaction.unitHeight')">{{parseInt(header.number)}}</nts-item>
        <nts-item :label="$t('transaction.unitHash')">{{header.hash}}</nts-item>
        <nts-item :label="$t('transaction.unitChainAddress')">{{header.mc}}</nts-item>
        <nts-item :label="$t('transaction.systemHash')">
          <router-link class="router-link" :to="`/unitDetail/${header.sc_hash}`">{{header.sc_hash}}</router-link>
        </nts-item>
        <nts-item :label="$t('transaction.parentHash')">
          <router-link class="router-link" :to="`/unitDetail/${header.parent_hash}`">{{header.parent_hash}}</router-link>
        </nts-item>
        <nts-item :label="$t('transaction.receiptHash')">{{header.receipt_root}}</nts-item>
        <nts-item :label="$t('transaction.transactionSetHash')">{{header.transactions_root}}</nts-item>
        <nts-item :label="$t('transaction.chainStateHash')">{{header.state_root}}</nts-item>
        <nts-item :label="$t('transaction.gasLimit')">{{parseInt(header.gas_limit)}} gas</nts-item>
        <nts-item :label="$t('transaction.gasUsed')">{{parseInt(header.gas_used)}} gas</nts-item>
        <nts-item label="Bloom">
          <el-input readonly :autosize="{ minRows: 1, maxRows: 4}" type="textarea" v-model="header.bloom"/>
        </nts-item>
      </nts-card>
      <nts-card :title="$t('account.witnessVote')" class="voteList bgWhite">
        <ul>
          <li v-for="i in witnessList" :key="i">{{i}}</li>
        </ul>
      </nts-card>
    </div>

    <nts-card :title="$t('transaction.unitTransactionDetail')" class="unit-transaction-detail bgWhite mt0">
      <el-collapse v-model="activeCollapse">

        <el-collapse-item :title="i.tx_hash" :name="idx" v-for="(i,idx) in transactionList">
          <div class="transaction-detail">
            <nts-item :label="$t('transaction.TransactionStage')">{{i.action | unitAction2Text}}</nts-item>
            <nts-item :label="$t('transaction.preStepUnit')">{{i.pre_step.hash}}</nts-item>
            <nts-item :label="$t('transaction.transactionHash')">
              <router-link class="router-link" :to="`/transactionDetail/${i.tx_hash}`">{{i.tx_hash}}</router-link>
            </nts-item>
            <nts-item :label="$t('transaction.executionResult')">{{i.failed ? $t('transaction.failed') :
              $t('transaction.pass')}}
            </nts-item>

            <nts-item :label="$t('transaction.gasUsed')">{{parseInt(i.gas_used)}} gas</nts-item>

            <nts-item :label="$t('transaction.executionOutput')">
              <div class="formatOutputBox">
                <el-input readonly type="textarea" class="formatOutput" v-if="!i.isFormat"
                          :autosize="{ minRows: 1, maxRows: 6}" v-model="i.output"/>
                <el-input type="textarea" readonly  class="formatOutput" v-else
                          v-model="i.output_decode"/>
                <span class="formatOutputBtn"
                      @click="decodeOutput(i.tx_hash, i.output, idx, i.isFormat)"
                      v-if="getDecodeBtnVisible(i)">{{i.isFormat ? $t('system.code'): $t('system.decode')}}</span>
              </div>
            </nts-item>

            <nts-item :label="$t('transaction.receiptHash')">{{i.root}}</nts-item>

            <div class="fund">
              <h3 class="mt30" v-show="i.coinflows.length">{{$t('transaction.fundsFlow')}}</h3>

              <el-table :data="i.coinflows" v-show="i.coinflows.length" :row-style="{height:'60px'}"
                        class="fundTable">
                <el-table-column type="index" width="100px" :label="$t('transaction.orderNumber')"/>
                <el-table-column prop="To" :label="$t('transaction.address')" min-width="110px"/>
                <el-table-column :label="$t('transaction.amount')">
                  <template slot-scope="scope">
                    <span>{{scope.row.Amount | toNts}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('transaction.type')">
                  <template slot-scope="scope">
                    <span>{{$t('transaction.transfer')}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

        </el-collapse-item>
      </el-collapse>
    </nts-card>
  </div>

</template>

<script>
import card from "../../components/card";
import item from "../../components/item";
import * as api from "../../../api/index";
import i18n from "../../lang/index";
import { getContract } from "../../../modules/db/contract";
import { Message } from "element-ui";

import { web3 } from "../../main";

export default {
  name: "unitDetail",
  components: {
    [item.name]: item,
    [card.name]: card
  },
  data() {
    return {
      hash: this.$route.params.hash,
      header: {},
      witnessList: [],
      activeCollapse: 0,
      transactionList: []
    };
  },
  watch: {
    $route(r) {
      this.hash = r.params.hash;
      this.getDetail();
      this.getUnitReceipts();
    }
  },
  methods: {
    async getDetail() {
      let { code, result } = await api.getUnitDetail(this.hash);
      if (code === api.SUCCESS) {
        this.header = result.header;
        this.witnessList = result.witness_list;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async getUnitReceipts() {
      let { code, result } = await api.getUnitReceipts(this.hash);
      if (code === api.SUCCESS) {
        console.log(result);
        this.transactionList = result;
      } else {
        console.error(`${code}: ${result}`);
      }
    },
    async decodeOutput(txHash, output, idx, isFormat = false) {
      if (isFormat)
        return this.$set(this.transactionList[idx], "isFormat", false);
      // 从本地数据库中查找是否存在该合约
      let contractInfoByDb = await getContract({
        contractAddress: this.header.mc
      });
      if (!contractInfoByDb) return Message.error("未找到该合约的ABI");
      // 通过交易的输入获取合约的方法id
      let {
        options: { jsonInterface }
      } = new web3.nts.Contract(contractInfoByDb.jsonInterface);
      let methodId = await this.getContractMethodId(txHash);
      // 获取该合约方法的outputs
      let methodInfo = jsonInterface.filter(i => i.signature === methodId)[0];
      if (!methodInfo)
        return Message.error("该合约没有此方法, 请检查本地合约是否正确");
      let { outputs } = methodInfo;
      let result = await web3.nts.abi.decodeParameter(outputs[0].type, output);
      console.log(result);
      this.$set(this.transactionList, idx, {
        ...this.transactionList[idx],
        output_decode: result,
        isFormat: true
      });
      console.log(this.transactionList);
      console.log(this.transactionList[idx]);
    },
    getDecodeBtnVisible(i) {
      return !i.failed && i.output !== "0x";
    },
    async getContractMethodId(txHash) {
      let {
        result: { input }
      } = await api.getTransactionDetail(txHash);
      return input.slice(0, 10);
    }
  },
  filters: {
    unitAction2Text(action) {
      const unitAction2TextMap = {
        transfer_payment: i18n.t("transaction.transferPayment"),
        transfer_receipt: i18n.t("transaction.transferReceipt"),
        contract_freeze: i18n.t("contract.contractFreeze"),
        contract_deal: i18n.t("contract.contractDeal"),
        pow_tx_contract_deal: i18n.t("unitAction2TextMap.pow_tx_contract_deal"),
        s_c_idle_contract_deal: i18n.t(
          "unitAction2TextMap.s_c_idle_contract_deal"
        ),
        contract_refund: i18n.t("contract.contractRefund"),
        contract_receipt: i18n.t("contract.contractReceipt")
      };
      return unitAction2TextMap[action];
    }
  },
  created() {
    this.getDetail();
    this.getUnitReceipts();
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/index";

.fund {
  background: #fff !important;
  margin: 0 0 30px 30px;

  .fundTable {
    margin: 0 1%;
  }
}

.minWidth {
  min-width: 710px !important;
}

.mt30 {
  padding: 0 1%;
  font-size: 14px !important;
  font-weight: normal !important;
}

.el-collapse-item {
  /deep/ .el-collapse-item__header {
    font-size: 14px;
  }
}

.containerFather {
  background: #f3f5f6;
}

.bgWhite {
  background: #fff;
}

.mt0 {
  margin-top: 0px !important;
}

.container {
  display: flex;

  &:after {
    content: "";
    display: block;
    clear: both;
  }
}

.detail {
  flex: 1;
  color: rgb(51, 51, 51);
  font-size: 14px;
  min-width: 630px;

  div {
    margin-top: 10px;
  }

  div:nth-child(2n + 1) {
    background: rgb(250, 250, 250);
  }
}

.voteList {
  margin-left: 20px;
  font-size: 12px;
  color: #555555;

  li {
    margin-bottom: 25px;
  }
}

.transaction-detail {
  color: rgb(51, 51, 51);
  font-size: 14px;

  div:nth-child(2n) {
    background: rgb(250, 250, 250);
  }

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;

    span {
      font-weight: normal;
      font-size: 12px;
      margin-left: 10px;
    }
  }
}

.unit-transaction-detail {
  margin-top: 20px;
}

.router-link {
  text-decoration: none;
  color: rgb(51, 51, 51);
  transition: 0.2s;

  &:hover {
    color: #4eb1ff;
  }
}

.input {
  padding: 10px;
  height: 100px;
  overflow-y: scroll;
  word-wrap: break-word;
  word-break: normal;
  vertical-align: middle;
  display: block;
}

.formatOutputBox {
  word-wrap: break-word;
  word-break: normal;
  width: 100%;
}

.formatOutput {
  /*word-wrap: break-word;*/
  /*word-break: normal;*/
  /*max-height: 200px;*/
  /*overflow-y: scroll;*/
  /*vertical-align: middle;*/
  /*display: block;*/
}

.formatOutputBtn {
  font-size: 12px;
  padding: 2px;
  color: #7f7f7f;
  display: inline-block;
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: $themeColor;
  }
}
</style>
