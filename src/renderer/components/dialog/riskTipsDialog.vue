<template>
  <el-dialog :title="$t('riskTips.tips')" :visible.sync="visible" width="550px" :close-on-click-modal="false" >
        <div class="riskTips" v-if="identity === 2">
          <h3>{{$t('riskTips.cancelUserWitness')}}</h3>
          <p>{{$t('riskTips.cancelUserWitnessText1')}}</p>
          <!--<p>{{$t('riskTips.cancelWitnessText2')}}</p>-->
        </div>
    <div class="riskTips" v-if="identity === 3">
          <h3>{{$t('riskTips.cancelSysWitness')}}</h3>
           <p>{{$t('riskTips.cancelSysWitnessText1')}}</p>
           <!--<p>{{$t('riskTips.cancelWitnessText2')}}</p>-->
    </div>
    <div class="riskTips" v-if="identity === 4">
      <h3>{{$t('riskTips.cancelCouncil')}}</h3>
          <p>{{$t('riskTips.cancelCouncilText1')}}</p>
          <p>{{$t('riskTips.cancelCouncilText2')}}</p>
        </div>
    <div slot="footer">
      <el-button class="btnThemeColor" @click="submit">{{$t('riskTips.iKnow')}}</el-button>
      <el-button  @click="visible = false">{{$t('riskTips.cancel')}}</el-button>
    </div>

  </el-dialog>
</template>

<script>
import vuexData from "../../mixins/vuexData";
export default {
  name: "risk-tips-dialog",
  mixins: [vuexData],
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  computed: {
    identity() {
      return this.curAccount.role.identity;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit() {
      this.$emit("riskRead", true);
    }
  }
};
</script>

<style scoped lang="scss">
.riskTips {
  h3 {
    margin-bottom: 20px;
    color: #333333;
    font-size: 16px;
  }
  p {
    line-height: 20px;
  }
}
</style>
