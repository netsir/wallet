<template>

  <el-dialog  :title="id?$t('token.editToken'):$t('token.addToken')" :visible.sync="visible" width="500px" :close-on-click-modal="false" center>
    <el-dialog
      center
      width="30%"
      :visible.sync="innerVisible"
      append-to-body>
      <p class="delToken">{{$t('token.confirmDel')}}{{this.token.name}}？</p>
      <div slot="footer">
        <el-button class="submitBtn" v-if="id" @click="innerVisible=false">{{$t('riskTips.cancel')}}</el-button>
        <el-button class="btnThemeColor submitBtn"  @click="delToken">{{$t('transaction.sure')}}</el-button>
      </div>
    </el-dialog>
    <ul>
      <li>
        <h4>{{$t('token.address')}}</h4>
        <div class="address">
          <el-input size="small" v-model="token.address" @input="getCoinInfo"/>
        </div>
      </li>

      <li>
        <h4>{{$t('token.name')}}</h4>
        <div class="name">
          <el-input size="small" v-model="token.name"/>
        </div>
      </li>

      <li>
        <h4>{{$t('token.symbol')}}</h4>
        <div class="name">
          <el-input :rows="6"  size="small" resize="none"  v-model="token.symbol"/>
        </div>
      </li>
      <li>
        <h4>{{$t('token.decimals')}}</h4>
        <div class="name">
          <el-input :rows="6" size="small"  resize="none"  v-model="token.decimals" />
        </div>
      </li>
      <li>
        <h4>{{$t('token.preview')}}</h4>
        <div class="tokenSymbol">
          <p>{{token.name}}</p>
          {{showPreview}}{{token.symbol}}
        </div>
      </li>
      <!--<li>-->
        <!--<h4>发行总资产</h4>-->
        <!--<div>-->
          <!--<p>{{showTokenAsset}}</p>-->
        <!--</div>-->
      <!--</li>-->
    </ul>

    <div slot="footer">
      <el-button class="submitBtn" v-if="id" @click="confirmDel">{{$t('token.del')}}</el-button>
      <el-button class="btnThemeColor submitBtn"  @click="submit">{{$t('transaction.sure')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { Message } from "element-ui";
import * as contractDB from "../../../modules/db/contract";
import * as api from "../../../api/index";
import { getTx, toBigNumber } from "../../utils";
import { getTransactionABI } from "../../contract";
import vuexData from "../../mixins/vuexData";
import { tokenInterface } from "../../const/token";
import { web3 } from "../../main";

//  TOKEN 分为 新增 删除 修改 三个功能
//  新增的时候 输入已经部署成功了的TOKEN合约地址 发请求 如果有数据进行填充 保存在TOKEN.db 文件
//  TOKEN合约 添加成功后 账户详情获取 TOKEN.db  显示TOKEN  可以转账TOKEN

export default {
  name: "watch-token-dialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    address: {
      type: String
      // default: ""
    },
    name: {
      type: String
    },
    decimals: {
      // type: String,
      // default: ""
    },
    symbol: {
      type: String
      // default: ""
    },
    id: {
      type: String
      // default: ""
    }
  },
  mixins: [vuexData],
  data() {
    return {
      visible: this.value,
      innerVisible: false,
      token: {
        address: this.address,
        name: this.name,
        symbol: this.symbol,
        decimals: this.decimals,
        totalSupply: ""
      },
      abi: "",
      contracts: []
    };
  },
  computed: {
    showTokenAsset() {
      return parseFloat(
        toBigNumber(this.token.totalSupply).dividedBy(
          toBigNumber(Math.pow(10, this.token.decimals))
        )
      );
    },
    isLegalTokenAddress() {
      return web3.utils.isAddress(this.token.address);
    },
    isLegalTokenName() {
      return this.token.name.trim() !== "";
    },
    isLegalTokenDecimals() {
      const intNumberReg = /^\d+$/;
      return intNumberReg.test(this.token.decimals);
    },
    isLegalTokenSymbol() {
      return this.token.symbol.trim() !== "";
    },
    tokenSymbolLength() {
      return this.token.symbol.trim().length > 10;
    },
    decimalsCheck() {
      return this.token.decimals > 32;
    },
    showPreview() {
      return this.token.decimals > 0
        ? "0." + "0".repeat(this.token.decimals)
        : this.token.decimals;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      if (val === false) {
        setTimeout(() => {
          this.resetForm();
        }, 100);
        return;
      }
      this.token.address = this.address;
      this.token.name = this.name;
      this.token.decimals = this.decimals;
      this.token.symbol = this.symbol;
    },
    address(val) {
      this.token.address = val;
    },
    name(val) {
      this.token.name = val;
    },
    decimals(val) {
      this.token.decimals = val;
    },
    symbol(val) {
      this.token.symbol = val;
    }
  },
  methods: {
    resetForm() {
      this.token.address = "";
      this.token.name = "";
      this.token.decimals = "";
      this.token.symbol = "";
    },
    delToken() {
      this.innerVisible = false;
      this.$emit("del", this.id);
      this.visible = false;
    },
    confirmDel() {
      this.innerVisible = true;
    },
    async ntsCall(tokenAddress, sysType) {
      let methodInfo = tokenInterface.find(i => i.name === sysType);
      let { outputs } = methodInfo;
      let tx = {
        ...getTx(0, 0, 0, 0),
        from: this.curAccount.address,
        to: tokenAddress,
        data: getTransactionABI(sysType)
      };
      let { code, result: ntsCallResult } = await api.ntsCall(tx);
      if (code === api.SUCCESS) {
        // 解码
        let result = await web3.nts.abi.decodeParameter(
          outputs[0].type,
          ntsCallResult
        );
        this.token[sysType] = result.startsWith("0x")
          ? web3.utils.hexToUtf8(result)
          : result;
      }
    },
    async getCoinInfo(v) {
      // let contractInfoByDb = await contractDB.getContract({
      //   contractAddress: v
      // });
      // if(!contractInfoByDb){
      //   await contractDB.insert({address: v})
      // }
      try {
        await this.ntsCall(v, "decimals");
        await this.ntsCall(v, "name");
        await this.ntsCall(v, "symbol");
        await this.ntsCall(v, "totalSupply");
      } catch (e) {
        console.log(e);
      }
    },
    async getContractMethodId(txHash) {
      let {
        result: { input }
      } = await api.getTransactionDetail(txHash);
      return input.slice(0, 10);
    },
    submit() {
      if (!this.isLegalTokenAddress) {
        return Message.error(this.$t("token.addressLimit"));
      }
      if (!this.isLegalTokenName) {
        return Message.error(this.$t("token.noName"));
      }
      if (!this.isLegalTokenSymbol) {
        return Message.error(this.$t("token.noUnit"));
      }
      if (!this.isLegalTokenDecimals) {
        return Message.error(this.$t("token.intNum"));
      }
      if (this.decimalsCheck) {
        return Message.error(this.$t("token.bitsLess"));
      }
      if (this.tokenSymbolLength) {
        return Message.error(this.$t("token.symbolLength"));
      }
      this.$emit("submit", {
        address: this.token.address,
        name: this.token.name,
        symbol: this.token.symbol,
        decimals: this.token.decimals,
        id: this.id
      });
      this.visible = false;
    }
  },
  async created() {
    this.contracts = (await contractDB.getContracts())
      .filter(i => !!i.name)
      .sort((a, b) => a.time - b.time);
  }
};
</script>

<style scoped lang="scss">
.delToken {
  margin-top: 10px;
  text-align: center;
  font-size: 18px;
}
.tokenSymbol {
  font-size: 14px;
  margin-bottom: 20px;
  p {
    margin-bottom: 10px;
  }
}
li + li {
  margin-top: 20px;
}
h4 {
  margin-bottom: 16px;
}

.address {
  width: 380px;
}

.name {
  width: 160px;
}
</style>
