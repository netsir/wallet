<template>

  <el-dialog :visible.sync="visible" width="500px" style="margin-top: 10vh" center>

    <ul class="form-container">
      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{ curAccount.name }}</p>
          <div class="form-item"><p>{{ curAccount.address }}</p></div>
        </div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{ $t('account.helpWitnessAddress') }}</p>
          <el-input size="small" v-model="form.helpAddress"/>
        </div>
      </li>

    </ul>
    <div slot="footer">
      <el-button class="btnThemeColor"  @click="submit" :loading="loading">{{$t('transaction.sure')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import vuexData from "../../mixins/vuexData";
import { web3 } from "../../main";
import { Message } from "element-ui";
export default {
  name: "help-witness-dialog",
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      visible: this.value,
      form: {
        helpAddress: ""
      },

      loading: false
    };
  },
  computed: {
    isLegalAddress() {
      return web3.utils.isAddress(this.form.helpAddress);
    },
    isSameAsCurAddress() {
      return this.form.helpAddress === this.curAccount.address;
    }
  },
  mixins: [vuexData],
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      this.resetForm();
    }
  },
  methods: {
    submit() {
      if (!this.isLegalAddress)
        return Message.error(this.$t("transaction.addressIllegal") + "!");
      if (this.isSameAsCurAddress)
        return Message.error(this.$t("transaction.addressIllegal2") + "!");
      this.loading = true;
      this.$emit(
        "submit",
        {
          helpAddress: this.form.helpAddress
        },
        this
      );
    },
    resetForm() {
      this.form.helpAddress = "";
    },
    close() {
      this.visible = false;
      this.loading = false;
    },
    stopLoading() {
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="scss">
.fz14 {
  font-size: 14px;
  color: #333333;
  margin-top: 20px;
}
.form-container {
  margin: 0 5px;

  li {
    .form-item-wrapper {
      .el-input /deep/ input {
        height: 40px;
        line-height: 40px;
      }
    }
    .form-item {
      display: flex;
      align-items: center;
    }
    .form-label {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
  li + li {
    margin-top: 20px;
  }
}
</style>
