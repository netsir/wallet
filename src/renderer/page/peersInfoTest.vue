<template>
  <div>
    <h2>peers Info</h2>
    <table class="table">
      <tbody>
      <tr v-for="(item,index) in infoList" :key="index">
        <td>
          <!--{{item}}-->
          <ul>
            <li v-for="(value,key) in item" :key="value.id">
              {{key}} : {{value}}
            </li>
          </ul>
        </td>
        <hr />
      </tr>
      </tbody>
    </table>

  </div>
</template>


<script>
import * as api from "../../api";

export default {
  name: "peers-info-test",
  data() {
    return {
      infoList: []
    };
  },
  methods: {
    async getInfo() {
      let { code, result } = await api.getPeersInfo();
      if (code === api.SUCCESS) {
        this.infoList = result;
      } else {
        console.error(`${code}, ${result}`);
      }
    }
  },
  created() {
    this.getInfo();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
h2 {
  height: 40px;
  font-size: 30px;
  line-height: 40px;
  padding: 40px 0;
}
.table {
  tr {
    display: block;
  }
}
</style>
