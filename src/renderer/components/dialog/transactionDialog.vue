<template>

  <el-dialog :title="$t('transaction.transactionTips')" class="ft20" :visible.sync="visible" width="500px" :close-on-click-modal="false" center>

    <ul class="form-container">
      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{$t('account.accountUser')}}</p>
          <div class="form-item"><p class="account">{{curAccount.name}}</p></div>
        </div>
        <div class="form-item-slot"></div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{$t('transaction.gasPrice')}}</p>
          <div class="form-item">
            <p>{{form.gasPrice}}<span class="unit">DOT / gas</span></p>
          </div>
        </div>
        <div class="form-item-slot dialogWidth">
          <el-slider v-model="form.gasPrice" :step="1" :min="minGasPrice" :max="minGasPrice * 100"/>
          <div style="margin-top: 6px;">
            <div style="display: flex;justify-content: space-between">
              <span>{{$t('transaction.slow')}}</span>
              <span>{{$t('transaction.normal')}}</span>
              <span>{{$t('transaction.fast')}}</span>
              <span>{{$t('transaction.emergency')}}</span>
              <span>{{$t('transaction.Urgent')}}</span>
            </div>
          </div>
        </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{$t('transaction.transactionNeedGas')}}</p>
          <div class="form-item">
            <span v-if="gettingNeedGas">{{$t('transaction.gettingNeedGas')}}</span>
            <template v-else>
              <span>{{transactionNeedGas+10000}}</span>
              <span class="unit">gas</span>
            </template>
          </div>
        </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{$t('transaction.gasLimitWill')}}</p>
          <div class="form-item">
            <span v-if="gettingNeedGas">{{$t('transaction.gasLimitWill')}}</span>
            <template v-else>
              <el-input size="small" style="width: 100px" v-model="form.gasLimit"/>
              <span class="unit">gas</span>
            </template>
          </div>
        </div>
            <p v-if="isFloat" class="gasFailTip">{{$t('transaction.isFloat')}}</p>
            <div v-if="showGasFailTip" class="gasFailTip">
            <p class="mb10">{{$t('transaction.gasFailTip')}}</p>
             <span> {{$t('transaction.errMsg')}}: </span>{{errorMsg}}
            </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <span class="form-label">{{$t('transaction.totalGasPrices')}}</span>
          <div class="form-item">{{totalGasPrices.toString()}} <span class="unit">DOT</span></div>
        </div>
      </li>

      <li v-if="needAmount">
        <div class="form-item-wrapper">
          <span class="form-label">{{amountLabel}}</span>
          <div v-if="canModifyAmount">
            <el-input size="small" class="amountInput" v-model="amount"/>
            <span class="unit">NTS</span>
          </div>
          <div v-else>
            <span>{{form.amount | toNts}}</span><span class="unit">NTS</span>
          </div>
        </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <span class="form-label">{{$t('transaction.validDate')}}</span>
          <el-input-number size="mini" v-model="form.periodOfValidity" :min="10" :max="100000000" :step="10" :precision="0"/>&nbsp;&nbsp;{{$t('system.minutes')}}
        </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <span class="form-label">{{$t('transaction.totalPrices')}}</span>
          <div class="form-item">{{totalPrices | toNts}} <span class="unit">NTS</span></div>
        </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <span class="form-label">{{$t('transaction.password')}}</span>
          <el-input type="password" size="small" style="width: 200px" v-model="form.password"/>
        </div>
      </li>

    </ul>

    <div slot="footer">
      <el-button class="btnThemeColor submitBtn"  @click="submit" :loading="loading" :disabled="gettingNeedGas">{{$t('transaction.sure')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { toBigNumber, toDotBN } from "../../utils";
import vuexData from "../../mixins/vuexData";
import { Message } from "element-ui";
import i18n from "../../lang/index";
export default {
  name: "transaction-dialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    errorMsg: {
      type: String,
      default: ""
    },
    amountLabel: {
      type: String,
      default: i18n.t("transaction.deposit")
    },
    amount: {
      // type: String,
      default: "0"
    },
    canModifyAmount: {
      type: Boolean,
      default: false
    },
    transactionNeedGas: {
      type: Number,
      default: 0
    },
    gettingNeedGas: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFloat: false,
      visible: this.value,
      loading: false,
      form: {
        gasPrice: 1,
        gasLimit: this.transactionNeedGas + 10000,
        amount: toDotBN(this.amount),
        password: "",
        periodOfValidity: 60
      }
    };
  },
  mixins: [vuexData],
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      if (val === false) {
        setTimeout(() => {
          this.resetForm();
        }, 300);
      }
    },
    "form.gasLimit"(val) {
      let reg = /^[0-9]\d*$/;
      this.isFloat = !reg.test(val);
    },
    transactionNeedGas(val) {
      this.form.gasLimit = val + 10000;
    },
    amount(val) {
      this.form.amount = toDotBN(val);
    }
  },
  computed: {
    totalGasPrices() {
      return toBigNumber(this.form.gasLimit).multipliedBy(
        toBigNumber(this.form.gasPrice)
      );
    },
    totalPrices() {
      return this.totalGasPrices.plus(this.form.amount);
    },
    needAmount() {
      return parseFloat(this.form.amount) > 0;
    },
    minGasPrice() {
      return this.$store.state.system.consensualConfig.lowestGasPrice
        .current_val;
    },
    showGasFailTip() {
      return !this.gettingNeedGas && this.transactionNeedGas === 0;
    }
  },
  methods: {
    submit() {
      if (this.isFloat) {
        Message.error(this.$t("transaction.isFloat"));
        return;
      }
      if (!this.form.password) {
        Message.error(this.$t("transaction.isLegalPwd"));
        return;
      }
      this.loading = true;
      this.$emit(
        "submit",
        {
          gasPrice: this.form.gasPrice,
          amount: this.form.amount,
          gas: this.form.gasLimit,
          password: this.form.password,
          periodOfValidity: this.form.periodOfValidity
        },
        this
      );
    },
    resetForm() {
      this.form.password = "";
      // this.form.gasLimit = 0;
      this.form.gasPrice = 1;
    },
    close() {
      this.loading = false;
      this.visible = false;
    },
    stopLoading() {
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="scss">
.mb10 {
  margin-bottom: 10px;
}
.ft20 {
  /deep/ .el-dialog__title {
    font-size: 20px;
    font-weight: bold;
  }
}
.dialogWidth {
  margin: 15px auto;
}
.form-container {
  li {
    .form-item-wrapper {
      display: flex;
      align-items: center;
    }
    .form-item {
      display: flex;
      align-items: center;
    }
    .form-label {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
  li + li {
    margin-top: 30px;
  }
}

.account {
  line-height: 24px;
}

.unit {
  font-size: 10px;
  color: #333;
  margin-left: 6px;
}
.submitBtn {
  width: 160px;
}
.amountInput {
  width: 100px;
}

.gasFailTip {
  margin-top: 10px;
  color: #f56c6c;
  font-size: 12px;
}
</style>
