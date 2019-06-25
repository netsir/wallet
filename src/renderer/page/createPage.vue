<template>
  <nts-card :spStyle="{marginBottom: 0, height: 100 + '%'}">
    <ul class="container">
      <li>
        <nts-create-button :text="$t('contract.newContract')" @click="$router.push('/createContract')"/>
        <div v-if="deployContracts.length">
          <h3 class="title">{{$t('contract.myContract')}}</h3>
          <ul class="contract-list">
            <li v-for="i in deployContracts" @click="jumpToDetail(i._id, 1)">
              <i class="iconfont icon-heyue"></i>
              <span>{{i.name}}</span>
            </li>
          </ul>
        </div>
      </li>

      <li>
        <nts-create-button :text="$t('contract.watchContract')" @click="toggleWatchContractDialogVisible"/>
        <div v-if="watchContracts.length">
          <h3 class="title">{{$t('contract.myContract')}}</h3>
          <ul class="contract-list">
            <li v-for="i in watchContracts" @click="jumpToDetail(i._id, 2, false)">
              <i class="iconfont icon-heyue"></i>
              <span>{{i.name}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <nts-create-button text="TOKEN" @click="toggleWatchTokenDialogVisible"/>
        <div v-if="tokens.length">
          <h3 class="title">TOKEN</h3>
          <ul class="contract-list">
            <li v-for="i in tokens" @click="editToken(i)">
              <i class="iconfont icon-heyue"></i>
              <span>{{i.name}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <watch-contract-dialog v-model="watchContractDialogVisible" @submit="saveWatchContractToDB"/>
    <watch-token-dialog v-model="watchTokenDialogVisible"
                        :address="tokenItem.address"
                        :name="tokenItem.name"
                        :symbol="tokenItem.symbol"
                        :decimals="tokenItem.decimals"
                        :id="tokenItem._id"
                        @submit="saveWatchTokenToDB"
                        @del="delToken"/>

    <transaction-dialog v-model="transactionDialogVisible"
                        :amount-label="$t('transaction.amount')"
                        :amount="amount"
                        :errorMsg="errorMsg"
                        :transaction-need-gas="transactionNeedGas"
                        :gettingNeedGas="gettingNeedGas"
                        @submit="sendTransaction"/>

  </nts-card>
</template>

<script>
import card from "../components/card";
import createButton from "../components/createButton";
import watchContractDialog from "../components/dialog/watchContractDialog";
import watchTokenDialog from "../components/dialog/watchTokenDialog";
import transactionDialog from "../components/dialog/transactionDialog";
import * as contractDB from "../../modules/db/contract";
import * as tokenCoinDB from "../../modules/db/tokenCoin";
import vuexData from "../mixins/vuexData";
import * as api from "../../api";
import i18n from "../lang/index";
import { Message } from "element-ui";
import { getTx, toDotBN, toNtsBN } from "../utils";
import { ipcRenderer } from "electron";

const [DEPLOY, WATCH] = [1, 2];

export default {
  name: "createPage",
  components: {
    [card.name]: card,
    [createButton.name]: createButton,
    [watchContractDialog.name]: watchContractDialog,
    [watchTokenDialog.name]: watchTokenDialog,
    [transactionDialog.name]: transactionDialog
  },
  mixins: [vuexData],
  data() {
    return {
      contracts: [],
      tokens: [],
      tokenItem: {
        address: "",
        name: "",
        symbol: "",
        decimals: "",
        _id: ""
      },
      watchContractDialogVisible: false,
      watchTokenDialogVisible: false,
      transactionDialogVisible: false,
      amount: "0",
      errorMsg: "",
      transactionNeedGas: 0,
      gettingNeedGas: false,
      abi: ""
    };
  },
  computed: {
    deployContracts() {
      return this.contracts.filter(i => i.type === DEPLOY);
    },
    watchContracts() {
      return this.contracts.filter(i => i.type === WATCH);
    }
  },
  methods: {
    resetForm() {
      this.tokenItem.address = "";
      this.tokenItem.symbol = "";
      this.tokenItem.name = "";
      this.tokenItem.decimals = "";
      this.tokenItem._id = "";
    },
    toggleWatchContractDialogVisible() {
      this.watchContractDialogVisible = !this.watchContractDialogVisible;
    },
    toggleWatchTokenDialogVisible() {
      this.resetForm();
      this.watchTokenDialogVisible = !this.watchTokenDialogVisible;
    },
    async jumpToDetail(id, type, needCheck = true) {
      const address = await this.getContractAddress(id);
      if (needCheck) {
        const hasReady = await this.checkContractHasReady(address);
        if (!hasReady) {
          return Message.error(this.$t("contract.contractDeploying"));
        }
      }
      this.$router.push(`/contractDetail/${address}/${type}`);
    },
    async getContractAddress(id) {
      const contract = await contractDB.getContract({ _id: id });
      let address = "";
      if (contract.contractAddress) {
        address = contract.contractAddress;
      } else {
        const { code, result } = await api.getContractAddress(contract.txHash);
        if (code === api.SUCCESS) {
          address = result;
          await contractDB.update(id, address);
        } else {
          console.error(`${code}: ${result}`);
        }
      }
      return address;
    },
    async checkContractHasReady(contractAddress) {
      let { code, result } = await api.getLastUnits(contractAddress);
      return code === api.SUCCESS
        ? parseInt(result.header.number) > 0
        : !!console.error(`${code}: ${result}`);
    },
    async saveWatchContractToDB(data) {
      let item = await contractDB.getContract({
        contractAddress: data.address
      });
      if (item) return Message.error(i18n.t("contract.alreadyExist"));
      await contractDB.insert({
        name: data.name,
        contractAddress: data.address,
        jsonInterface: JSON.parse(data.jsonInterface),
        type: WATCH
      });
      Message.success(this.$t("contract.importSuccess"));
      this.contracts = (await contractDB.getContracts()).sort(
        (a, b) => a.time - b.time
      );
    },
    async getNeedGas() {
      this.transactionNeedGas = 0;
      this.gettingNeedGas = true;
      let tx = {
        ...getTx(0, 0, toDotBN(this.amount), 0),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.abi
      };
      let { code, result } = await api.getEstimateGas(tx);
      if (code === api.SUCCESS) {
        this.transactionNeedGas = parseInt(result);
      } else {
        this.errorMsg = result;
      }
      this.gettingNeedGas = false;
    },
    async sendTransaction(data, dialog) {
      let tx = {
        ...getTx(data.gas, data.gasPrice, data.amount, data.periodOfValidity),
        from: this.curAccount.address,
        to: this.sysChainAddress,
        data: this.abi
      };
      let { code, result } = await api.sendTransaction(tx, data.password);
      if (code === api.SUCCESS) {
        Message.success(this.$t("contract.contractDeploying"));
        this.saveContractToDB(result);
        dialog.close();
        this.$router.push("/transactionList");
      } else {
        dialog.stopLoading();
        Message.error(`${result}`);
      }
    },
    async saveWatchTokenToDB(data) {
      if (this.tokens.filter(i => i.address === data.address).length) {
        await tokenCoinDB.TokenUpdate(
          data.id,
          data.address,
          data.name,
          data.symbol,
          data.decimals
        );
        Message.success(this.$t("token.changeSuccess"));
      } else {
        await tokenCoinDB.TokenInsert({
          address: data.address,
          name: data.name,
          symbol: data.symbol,
          decimals: data.decimals
        });
        Message.success(this.$t("contract.importSuccess"));
      }
      this.tokens = (await tokenCoinDB.getTokenCoins())
        .filter(i => !!i.name)
        .sort((a, b) => a.time - b.time);
    },
    async delToken(v) {
      Message.success(this.$t("token.delSuccess"));
      let index = this.tokens.findIndex(i => i._id === v);
      this.tokens.splice(index, 1);
      await tokenCoinDB.removeToken(v);
    },
    editToken(i) {
      this.tokenItem = JSON.parse(JSON.stringify(i));
      this.watchTokenDialogVisible = true;
    }
  },
  async created() {
    this.tokens = (await tokenCoinDB.getTokenCoins())
      .filter(i => !!i.name)
      .sort((a, b) => a.time - b.time);
    this.contracts = (await contractDB.getContracts())
      .filter(i => !!i.name)
      .sort((a, b) => a.time - b.time);
  }
};
</script>

<style scoped lang="scss">
@import "../styles/index";
.container {
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}
.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 26px 0;
}

.contract-list {
  display: flex;
  flex-wrap: wrap;
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 30px 40px 0;

    i {
      font-size: 40px;
      margin-right: 4px;
    }
    span {
      flex: 1;
      max-width: 120px;
      line-height: 1.5;
      @include ellipsis;
    }
  }
}
</style>
