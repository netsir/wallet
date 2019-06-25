<template>
  <div :class="$style.header">
    <p :class="$style.time">{{time / 1e9 | formatTime}}</p>
    <table :class="$style.detail">
      <tr>
        <td>{{$t('proposal.proposalType')}}</td>
        <td>{{$t(`proposal.${type}`)}}</td>
      </tr>
      <tr>
        <td>{{$t('transaction.hash')}}</td>
        <td>{{hash}}</td>
      </tr>
      <tr>
        <td>{{$t('transaction.paramsText')}}</td>
        <td>{{paramsText}}</td>
      </tr>
      <tr>
        <td>{{$t('proposal.proposalCreater')}}</td>
        <td>{{proposalInfo.creater}}</td>
      </tr>
      <tr>
        <td>{{$t('transaction.status')}}</td>
        <td>{{$t(`proposal.${status}`)}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { type } from "../../const/proposal";

export default {
  name: "detail-header",
  props: ["time", "type", "hash", "proposalInfo", "status"],
  computed: {
    paramsText() {
      if (this.proposalInfo.type === type.config_change) {
        return (
          this.$t(`proposal.${this.proposalInfo.config_key}`) +
          ":" +
          `${this.proposalInfo.config_value}`
        );
      } else if (this.proposalInfo.type === type.council_fire) {
        return this.proposalInfo.fire_address;
      } else {
        return this.proposalInfo.creater;
      }
    }
  }
};
</script>

<style module lang="scss">
.header {
  background: #fff;
}

.time {
  margin: 20px 0;
  font-size: 14px;
}

.detail {
  font-size: 14px;
  color: #494949;
  width: 100%;
  border-collapse: collapse;
  tr {
    height: 44px;
    line-height: 44px;
    &:nth-child(2n + 1) {
      background: rgb(250, 250, 250);
    }
  }
  td {
    padding-left: 14px;
  }
}
</style>
