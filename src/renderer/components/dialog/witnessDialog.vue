<template>

  <el-dialog :title="$t('transaction.transactionTips')" :visible.sync="visible" width="500px" center>

    <ul class="form-container">
      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{curAccount.name}}</p>
          <div class="form-item"><p>{{curAccount.address}}</p></div>
        </div>
        <div class="form-item-slot"></div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{$t('transaction.payType')}}</p>
          <!--<div class="form-item">{{$t('account.workPow')}}</div>-->
          <div class="form-item">{{$t('account.freeWorkPow')}}</div>
        </div>
        <div class="form-item-slot"></div>
      </li>

      <li>
        <div class="form-item-wrapper">
          <p class="form-label">{{$t('transaction.password')}}</p>
          <el-input type="password" size="small" v-model="form.password"/>
        </div>
        <p class="fz14">{{$t('account.witnessChangeOnlyOnce')}}</p>
      </li>
    </ul>
    <div slot="footer">
      <el-button class="btnThemeColor"  @click="submit" :loading="loading">{{$t('transaction.sure')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import vuexData from "../../mixins/vuexData";

export default {
  name: "witness-dialog",
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
        password: ""
      },

      loading: false
    };
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
      this.loading = true;
      this.$emit(
        "submit",
        {
          password: this.form.password
        },
        this
      );
    },
    resetForm() {
      this.form.password = "";
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
