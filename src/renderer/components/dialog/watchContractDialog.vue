<template>

  <el-dialog :title="$t('contract.watchContract')" :visible.sync="visible" width="550px" :close-on-click-modal="false" center>

    <ul>
      <li>
        <h4>{{$t('contract.contractAddress')}}</h4>
        <div class="address">
          <el-input size="small" v-model="form.address"/>
        </div>
      </li>

      <li>
        <h4>{{$t('contract.contractName')}}</h4>
        <div class="name">
          <el-input size="small" v-model="form.name"/>
        </div>
      </li>

      <li>
        <h4>JSON Interface</h4>
        <div>
          <el-input :rows="6"  resize="none"  type="textarea" v-model="form.jsonInterface"/>
        </div>
      </li>

    </ul>

    <div slot="footer">
      <el-button class="btnThemeColor"  @click="submit">{{$t('transaction.sure')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { Message } from "element-ui";
import i18n from "../../lang/index";

import { web3 } from "../../main";

const CONTRACT_ADDRESS_SUFFIX = "nsc1";

export default {
  name: "watch-contract-dialog",
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
        address: "",
        name: "",
        jsonInterface: ""
      }
    };
  },
  computed: {
    isLegalContractAddress() {
      return (
        web3.utils.isAddress(this.form.address) &&
        this.form.address.slice(0, 4) === CONTRACT_ADDRESS_SUFFIX
      );
    },
    isLegalContractName() {
      return this.form.name.trim() !== "";
    },
    isLegalJsonInterface() {
      try {
        new web3.nts.Contract(JSON.parse(this.form.jsonInterface.trim()));
        return true;
      } catch (e) {
        return false;
      }
    },
    errorMsg() {
      const strategies = [
        {
          condition: !this.isLegalContractAddress,
          message: i18n.t("contract.isLegalContractAddress")
        },
        {
          condition: !this.isLegalContractName,
          message: i18n.t("contract.isLegalContractName")
        },
        {
          condition: !this.isLegalJsonInterface,
          message: i18n.t("contract.isLegalJsonInterface")
        }
      ];
      return (
        strategies.filter(i => i.condition)[0] &&
        strategies.filter(i => i.condition)[0].message
      );
    }
  },
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
      if (this.errorMsg) {
        return Message.error(this.errorMsg);
      }
      this.$emit("submit", {
        address: this.form.address,
        name: this.form.name,
        jsonInterface: this.form.jsonInterface
      });
      this.resetForm();
      this.visible = false;
    },
    resetForm() {
      this.form.address = "";
      this.form.name = "";
      this.form.jsonInterface = "";
    }
  }
};
</script>

<style scoped lang="scss">
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
