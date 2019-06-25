import * as api from "../../../api";

const { SUCCESS } = api;

const state = {
  sysChainAddress: "",
  sysWitnessList: [],
  councilList: [],
  sysChainHeight: 0,
  lastBlockTimeStamp: 0,
  lastBlockHash: "",
  consensualConfig: {},
  adminDatadir: ""
};

const mutations = {
  set_sys_witness_list(state, list) {
    state.sysWitnessList = list;
  },
  set_sys_chain_address(state, address) {
    state.sysChainAddress = address;
  },
  // set_council_list(state, list) {
  //   state.councilList = list;
  // },
  set_sys_chain_height(state, height) {
    state.sysChainHeight = height;
  },
  set_sys_chain_time_stamp(state, timeStamp) {
    state.lastBlockTimeStamp = timeStamp;
  },
  set_sys_chain_unit_hash(state, hash) {
    state.lastBlockHash = hash;
  },
  set_consensual_config(state, configs) {
    configs.forEach(i => {
      state.consensualConfig[i.key] = i;
    });
  },
  set_admin_datadir(state, path) {
    state.adminDatadir = path;
  }
};
const actions = {
  async getSysWitnessAddress({ commit }) {
    let { code, result } = await api.getAllSysWitness();
    if (code === SUCCESS) {
      commit("set_sys_witness_list", result);
    } else {
      console.error(code, result);
    }
  },
  async getSysChainAddress({ commit }) {
    return new Promise(async resolve => {
      let { code, result } = await api.getSysChainAddress();
      if (code === SUCCESS) {
        commit("set_sys_chain_address", result);
        resolve();
      } else {
        console.error(code, result);
      }
    });
  },
  // async getCouncilList({ commit }) {
  //   let { code, result } = await api.getCouncilList();
  //   if (code === SUCCESS) {
  //     commit("set_council_list", result);
  //   } else {
  //     console.error(code, result);
  //   }
  // },
  async getSystemChainHeight({ state, commit }) {
    let { code, result } = await api.getLastUnits(state.sysChainAddress);
    if (code === SUCCESS) {
      commit("set_sys_chain_height", parseInt(result.header.number));
      commit("set_sys_chain_time_stamp", parseInt(result.header.timestamp));
      commit("set_sys_chain_unit_hash", result.header.hash);
    } else {
      console.error(code, result);
    }
  },
  async getConsensualConfig({ commit }) {
    let { code, result } = await api.getConsensualConfig();
    // console.log(result)
    if (code === api.SUCCESS) {
      commit("set_consensual_config", result);
    } else {
      console.error(`${code}: ${result}`);
    }
  },
  async getAdminDatadir({ commit }) {
    let { code, result } = await api.getAdminDatadir();
    if (code === api.SUCCESS) {
      commit("set_admin_datadir", result);
    } else {
      console.error(`${code}: ${result}`);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
