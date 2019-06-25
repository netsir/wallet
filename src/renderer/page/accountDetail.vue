<template>
  <div class="bg">
    <nts-card :title="$t('account.accountDetail')" min="auto" class="accountBg">
      <div class="header">
        <avatar size="largest" :color="curAccount.color" :identity="curAccount.role.identity" :active="curAccount.role.active"/>
        <div class="detail">
          <div class="accountContainer">
            <span class="account" v-if="!isEdit">{{curAccount.name}}</span>
            <input class="editAccount" v-model="new_name" v-show="isEdit" @blur="updateAccount"/>
            <i @click="editAccount" class="iconfont icon-bianji1"></i>
<!--            <i class="iconfont icon-qrcode" @click="qrcodeVisible = true"></i>-->
          </div>

          <p class="balance">{{curAccount.balance | toNts}} <span class="unit">NTS</span></p>
          <p class="address">
            {{curAccount.address}}
            <el-button @click="copyAddress" class="copyAddress" size="mini">{{$t('system.copy')}}</el-button>
            <router-link tag="span" :to="link" v-if="identityName" class="op">
              <el-button size="mini" >
                {{$t('system.enter')}}{{identityName}}{{$t('account.userName')}}
              </el-button>
            </router-link>
          </p>
        </div>
      </div>
      <ul class="token" v-if="tokenArr.length">
        <li v-for="(i,idx) in tokenArr" :key="idx" class="tokenItem" @click="sendToken(i.address)">
          <p>{{i.name}}</p>
          <p><span>{{i.balance}}</span><span>{{i.symbol}}</span></p>
          <p><span>{{$t('system.send')}}</span></p>
        </li>
      </ul>
      <ul class="operate">
        <li>
          <router-link tag="span" to="/sendTransaction">
            <div class="operate-item">
              <i class="iconfont icon-send"></i>
              <span>{{$t('transaction.transfer')}}</span>
            </div>
          </router-link>
        </li>
        <li>
          <router-link tag="span" to="/createContract">
            <div class="operate-item">
              <i class="iconfont icon-heyue"></i>
              <span>{{$t('contract.contractTo')}}</span>
            </div>
          </router-link>
        </li>
        <li>
          <router-link tag="span" to="/proposal/create">
            <div class="operate-item">
              <i class="iconfont icon-tiqingyian"></i>
              <span>{{$t('proposal.proposalTo')}}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nts-card>
    <nts-card :title="$t('transaction.transactionList')" min="500px" class="bgWhite">
      <transaction-list :list="txList"/>
      <router-link tag="span" :to="`/witnessManage/${curAccount.address}`" :class="{viewWitness:true,unNormal:unNormal}">
        {{$t('account.chainStatus')}}: {{chainStatusText}} <i class="iconfont icon-next"></i>
      </router-link>
    </nts-card>

    <el-dialog :visible.sync="qrcodeVisible" width="300px" :close-on-click-modal="true" class="qrcodeContainer">
      <div class="qrcode">
        <qrcode :value="keystoreString" :options="{ width: 260 }"/>
        <div class="qrcodeWords">{{$t('account.qrcodeWords')}}</div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import transactionList from "../components/transactionList";
import card from "../components/card";
import avatar from "../components/avatar";
import vuexData from "../mixins/vuexData";
import * as api from "../../api";
import { identity } from "../const/account";
import { getTx, toBigNumber } from "../utils";
import { Message } from "element-ui";
import { clipboard } from "electron";
import { accountDB as extAccountDB } from "../../modules/db";
import * as accountDB from "../../modules/db/account";
import fs from "fs-extra";
import path from "path";
import * as tokenCoinDB from "../../modules/db/tokenCoin";
import { tokenInterface } from "../const/token";
import { getTransactionABI } from "../contract";
import { type as SysTpye } from "../const/system";
import { web3 } from "../main";
import { getContract } from "../../modules/db/contract";

let timer = null;

export default {
  name: "accountDetail",
  components: {
    [card.name]: card,
    [transactionList.name]: transactionList,
    [avatar.name]: avatar,
    [VueQrcode.name]: VueQrcode
  },
  mixins: [vuexData],
  data() {
    return {
      txList: [],
      isEdit: false,
      new_name: "",
      chainStatus: "normal",

      keystoreString: "",
      hasWitness: false,
      qrcodeVisible: false,
      tokenArr: [],
      witnessList: [],
      checkUnderway: false
    };
  },
  computed: {
    chainStatusText() {
      if (this.chainStatus === "powing") return this.$t("account.calPow1");
      if (this.chainStatus === "witness_replace_underway")
        return this.witnessList.length === 0
          ? this.$t("account.applyingWitness")
          : this.$t("account.changingWitness");
      if (this.chainStatus === "not_witness")
        return this.$t("account.noWitnessTips");
      if (this.chainStatus === "normal") return this.$t("account.normal");
      if (this.chainStatus === "insufficient")
        return this.$t("account.insufficient");
    },
    unNormal() {
      return this.chainStatus !== "normal";
    },
    isCouncil() {
      return this.curAccount.role.identity === identity.council;
    },
    isUserWitness() {
      return this.curAccount.role.identity === identity.userWitness;
    },
    isSysWitness() {
      return this.curAccount.role.identity === identity.sysWitness;
    },
    isWitness() {
      return this.isUserWitness || this.isSysWitness;
    },
    identityName() {
      if (this.isCouncil) return this.$t("proposal.member");
      if (this.isWitness) return this.$t("account.witness");
      return "";
    },
    link() {
      let l = "";
      if (this.isCouncil) l = "/councilDetail/";
      if (this.isWitness) l = "/witnessDetail/";
      return l + this.curAccount.address;
    },
    identityClass() {
      return {
        identity: true,
        userWitness: this.isUserWitness && this.curAccount.role.active,
        sysWitness: this.isSysWitness && this.curAccount.role.active,
        council: this.isCouncil && this.curAccount.role.active
      };
    },
    transactionABI() {
      return getTransactionABI(SysTpye.balanceOf, [this.curAccount.address]);
    }
  },
  watch: {
    "curAccount.address"(v) {
      if (v) {
        this.tokenArr.length = 0;
        this.showToken();
      }
    }
  },
  methods: {
    async getWitnessList() {
      let { code, result } = await api.getChainWitnessInfo(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.witnessList = result;
      } else {
        console.error(code, result);
      }
    },
    async ntsCall(tokenItem, sysType) {
      let methodInfo = tokenInterface.find(i => i.name === sysType);
      // 获取该合约方法的inputs
      let { outputs } = methodInfo;
      let tx = {
        ...getTx(0, 0, 0, 0),
        from: this.curAccount.address,
        to: tokenItem.address,
        data: this.transactionABI
      };
      let { code, result: ntsCallResult } = await api.ntsCall(tx);
      if (code === api.SUCCESS) {
        // 解码
        //todo 这里怎么好好的会报错???
        let result = await web3.nts.abi.decodeParameter(
          outputs[0].type,
          ntsCallResult
        );
        if (code === api.SUCCESS) {
          let item = this.tokenArr.find(i => i.address === tokenItem.address);
          if (item) {
            this.tokenArr.find(
              i => i.address === tokenItem.address
            ).balance = toBigNumber(result)
              .dividedBy(toBigNumber(Math.pow(10, tokenItem.decimals)))
              .toFormat(Number(tokenItem.decimals));
          } else {
            this.tokenArr.push({
              name: tokenItem.name,
              address: tokenItem.address,
              balance: toBigNumber(result)
                .dividedBy(toBigNumber(Math.pow(10, tokenItem.decimals)))
                .toFormat(Number(tokenItem.decimals)),
              symbol: tokenItem.symbol,
              time: tokenItem.time
            });
          }
          this.tokenArr.sort((a, b) => a.time - b.time);
        } else {
          Message.error(`${result}`);
        }
      } else {
        console.error(ntsCallResult);
      }
    },
    async showToken() {
      //获取存储的Token合约去拿TOKEN
      let result = await tokenCoinDB.getTokenCoins();
      result.forEach(i => this.ntsCall(i, "balanceOf"));
    },

    sendToken(add) {
      this.$router.push(`/sendTransaction/${add}`);
    },
    updateAccount() {
      if (this.new_name.length > 15) {
        Message.error(this.$t("account.isLegalLengthAccount"));
      } else {
        this.isEdit = false;
        this.sendNewName();
        Message.success(this.$t("account.nameChange"));
      }
    },
    editAccount() {
      if (this.new_name.length <= 15) {
        this.isEdit = !this.isEdit;
        if (!this.isEdit) {
          this.sendNewName();
          Message.success(this.$t("account.nameChange"));
        }
      }
    },
    async sendNewName() {
      await extAccountDB.update(
        { _id: this.curAccount.address },
        { $set: { name: this.new_name } }
      );
      let accounts = await accountDB.getAccounts();
      this.$store.commit("account/set_accounts_by_db", accounts);
    },
    async decodeValue(item) {
      let contractInfoByDb = await getContract({
        contractAddress: item.to
      });
      if (!contractInfoByDb) return console.error("未找到该合约的ABI");
      // 通过交易的输入获取合约的方法id
      let methodId = item.input.slice(0, 10);
      let contract = new web3.nts.Contract(
        contractInfoByDb.jsonInterface,
        this.$store.state.system.sysChainAddress
      );
      // 获取该合约方法的inputs
      let {
        options: { jsonInterface }
      } = contract;
      let methodInfo = jsonInterface.filter(i => i.signature === methodId)[0];
      let result = methodInfo.inputs.length
        ? web3.nts.abi.decodeParameters(
            methodInfo.inputs,
            item.input.replace(methodId, "")
          )
        : {};
      let dataName = methodInfo.inputs.map(i => i.name);
      let res = Object.keys(result).filter(i => !dataName.includes(i));
      res.map(i => {
        delete result[i];
      });
      return result;
    },
    async getAccountWitnessStatus() {
      let { code, result } = await api.getAccountWitnessStatus(
        this.curAccount.address
      );
      if (code === api.SUCCESS) {
        this.chainStatus = result;
      } else {
        this.$message.error(result);
      }
    },
    setTimer() {
      timer = setTimeout(() => {
        this.getTxList();
        this.getAccountWitnessStatus();
        // this.showToken();
        this.getWitnessList();
        this.setTimer();
      }, 1000);
    },
    async getTxList() {
      let { code, result } = await api.getTxList(
        [this.curAccount.address],
        "all",
        1,
        10
      );
      if (code === api.SUCCESS) {
        this.txList = result.list || [];
      } else {
        console.error(`${code}: ${result}`);
      }
    },

    copyAddress() {
      let address = this.curAccount.address;
      clipboard.writeText(address, "selection");
      Message.success(this.$t("system.copySuccess"));
    },

    async getAccountKeystore() {
      if (!this.$store.state.system.adminDatadir) return;
      const dirPath = path.join(
        this.$store.state.system.adminDatadir,
        "/keystore"
      );
      const files = await fs.readdir(dirPath);
      const keystoreFileName = files.filter(i =>
        i.toLowerCase().includes(this.curAccount.address.toLowerCase())
      )[0];
      const keystore = await fs.readJson(path.join(dirPath, keystoreFileName));
      this.keystoreString = "NerthusQRKeystore&" + JSON.stringify(keystore);
    }
  },
  mounted() {
    this.showToken();
    this.getAccountWitnessStatus();
    this.getTxList();
    this.setTimer();
    this.getWitnessList();
    this.new_name = this.curAccount.name;
    setTimeout(() => {
      this.getAccountKeystore();
    }, 200);
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  }
};
</script>

<style scoped lang="scss">
@import "../styles/index";
.tokenItem {
  position: relative;
}
.token {
  width: 58%;
  margin-top: 20px;
  margin-left: 85px;
  color: rgb(51, 51, 51);
  font-size: 14px;
  li {
    height: 30px;
    line-height: 28px;
    cursor: pointer;
    p {
      font-size: 14px;
      float: left;
      span:last-child {
        margin-left: 10px;
        font-size: 12px;
        margin-right: 6px;
      }
      &:first-child {
        width: 200px;
        @include ellipsis();
      }
      &:nth-child(2) {
        position: absolute;
        left: 230px;
        top: 0;
      }
      &:last-child {
        float: right;
        display: none;
      }
    }
    &:hover p:last-child {
      display: block;
    }
  }
  li:nth-child(2n + 1) {
    background: rgb(250, 250, 250);
  }
}

.tokenItsem {
  display: flex;
  position: relative;
  /*flex-direction: r;*/
  /*margin-top: 10px;*/
  justify-content: space-between;
  p {
    &:first-child {
      font-size: 20px;
    }
    &:nth-child(2) {
      font-size: 16px;
      span {
        font-size: 12px;
      }
    }
  }
  .sendBtn {
    position: absolute;
    right: -50px;
    font-size: 14px;
    cursor: pointer;
  }
}
@import "../styles/index";
.qrcodeWords {
  width: 100%;
  margin-top: 4px;
  background-color: #f3f5f6;
  border-radius: 5px;
  line-height: 30px;
}
.qrcodeContainer {
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .el-dialog__body {
    padding: 20px;
  }
}
.unNormal {
  color: red !important;
}

.icon-bianji1,
.icon-qrcode {
  margin-left: 10px;
  color: #777;
  cursor: pointer;
}

.icon-bianji1 {
  font-size: 20px;
}

.accountContainer {
  display: flex;
  height: 30px;
  line-height: 30px;
}

.editAccount {
  width: 100px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.changeBtn {
  font-size: 22px;
  margin-left: 20px;
  position: relative;
  left: 2px;
  top: 6px;
}

.accountBg {
  background: #fff;
  margin-bottom: 14px !important;
}

.bg {
  background: #f3f5f6;
}

.bgWhite {
  background: #fff;
}

.header {
  margin-top: 30px;
  margin-bottom: 20px;
  display: flex;
  position: relative;
}

.icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -24px;
}

.detail {
  margin-left: 20px;
  .op {
    margin-left: 10px;
  }
}

.account {
  height: 30px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.balance {
  line-height: 2.5;
  font-weight: bold;
}

.unit {
  margin-left: 4px;
  font-size: 12px;
}

.address {
  font-size: 13px;
  color: #777;
}

.viewWitness {
  color: #666666;
  position: absolute;
  top: 16px;
  right: 20px;
  line-height: 40px;
  font-size: 14px;
  transition: 0.2s;
  cursor: pointer;
  .icon-next {
    position: relative;
    top: 2px;
    left: -2px;
    font-size: 18px;
  }
  &:hover {
    color: $themeColor;
  }
}

.btn-container {
  margin-top: 30px;
  text-align: center;
}

.operate {
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22px;
  user-select: none;
  .operate-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 14px;
      padding-left: 10px;
    }
    .iconfont {
      font-size: 22px;
      &.icon-heyue {
        font-size: 24px;
      }
    }
  }
  li {
    margin-bottom: 56px;
    transition: 0.3s;
    color: #4f4f4f;
    &:hover {
      color: $themeColor;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &:nth-child(2) {
      .operate-item span {
        padding-left: 9px;
      }
    }
  }
}

.copyAddress {
  margin-left: 10px;
}

.applyWitness {
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: $themeColor;
  }
}

.qrcode {
  text-align: center;
}
</style>
