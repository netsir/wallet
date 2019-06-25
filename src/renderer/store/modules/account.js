import * as api from "../../../api";
import intersection from "lodash/intersection";

const { SUCCESS } = api;

const state = {
  curAccountIdx: 0,
  accountAddresses: [],
  userWitnessList: [],
  addressToBalanceMap: {},
  accountsByDB: [],
  accountChainHeight: 0,
  tokenCoin: [],
  addressToRoleMap: {}
};

const mutations = {
  set_account_addresses(state, list) {
    state.accountAddresses = list;
  },
  set_balance_map(state, map) {
    state.addressToBalanceMap = map;
  },
  set_role_map(state, map) {
    state.addressToRoleMap = map;
  },
  update_balance_map(state, map) {
    Object.entries(map).forEach(({ account, balance }) => {
      state.addressToBalanceMap[account] = balance;
    });
  },
  add_account_address(state, address) {
    state.accountAddresses.push(address);
    state.addressToBalanceMap[address.toLowerCase()] = 0;
  },
  set_account_idx(state, idx) {
    state.curAccountIdx = idx;
  },
  set_user_witness_list(state, list) {
    state.userWitnessList = list;
  },
  set_accounts_by_db(state, list) {
    state.accountsByDB = list;
  },
  set_account_chain_height(state, n) {
    state.accountChainHeight = n;
  },
  set_token_coin(state, tokenItem) {
    state.tokenCoin.push(tokenItem);
  },
  update_token_coin(state, tokenItem) {
    let accountTokenArr = state.tokenCoin.find(
      i => i.address === tokenItem.address
    ).token;
    let updatedContract = accountTokenArr.find(
      i => i.address === tokenItem.token[0].address
    );
    updatedContract
      ? (state.tokenCoin.find(i => i.address === tokenItem.address).token =
          tokenItem.token)
      : accountTokenArr.push(tokenItem.token[0]);
  }
};

const actions = {
  getAccountAddresses({ commit }) {
    return new Promise(async resolve => {
      let { code, result } = await api.getAccountAddresses();
      if (code === SUCCESS) {
        commit("set_account_addresses", result);
        resolve(result);
      } else {
        console.error(code, result);
      }
    });
  },
  async getBalances({ state, commit }, update = false) {
    return new Promise(async resolve => {
      let { code, result } = await api.getBalances(state.accountAddresses);
      if (code === SUCCESS) {
        commit("set_balance_map", result);
        resolve();
      } else {
        console.error(code, result);
      }
    });
  },
  async getActiveWitnessList({ state, commit }) {
    let { code, result } = await api.getActiveWitnessList();
    if (code === SUCCESS) {
      // 用全网用户见证人和当前用户的所有账户做交集
      let userWitnessList = intersection(
        result.map(i => i.toLowerCase()),
        state.accountAddresses.map(i => i.toLowerCase())
      );
      commit("set_user_witness_list", userWitnessList);
    } else {
      console.error(code, result);
    }
  },
  async getCurAccountChainHeight({ state, commit, rootGetters }) {
    if (!state.accountAddresses.length) return
    let curAccountAddress = rootGetters.accounts[state.curAccountIdx].address;
    let { code, result } = await api.getLastUnits(curAccountAddress);
    if (code === SUCCESS) {
      commit("set_account_chain_height", parseInt(result.header.number));
    } else {
      console.error(code, result);
    }
  },
  async getAccountStatus({ state, commit }) {
    let { code, result } = await api.getAccountStatus(state.accountAddresses);
    if (code === SUCCESS) {
      commit("set_role_map", result || {});
    } else {
      console.error(code, result);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
