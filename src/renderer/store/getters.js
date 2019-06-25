import { identity } from "../const/account";

function getRole(state, address) {
  let map = {
    main_system_witness: identity.sysWitness,
    second_system_witness: identity.sysWitness,
    normal: identity.normal,
    council: identity.council,
    contract: identity.contract,
    user_witness: identity.userWitness
  };
  if (Object.keys(state.account.addressToRoleMap).length === 0) {
    return {
      identity: identity.normal,
      active: true
    };
  }
  return {
    identity: state.account.addressToRoleMap[address]
      ? map[state.account.addressToRoleMap[address].role]
      : identity.normal,
    active: state.account.addressToRoleMap[address]
      ? state.account.addressToRoleMap[address].active
      : false
  };
}

export default {
  accounts(state) {
    let accountsByDBMap = state.account.accountsByDB.reduce((map, cur) => {
      map[cur._id] = { name: cur.name, color: cur.color, time: cur.time };
      return map;
    }, {});
    return state.account.accountAddresses
      .map(address => {
        return {
          name: accountsByDBMap[address] && accountsByDBMap[address].name,
          address: address,
          balance: state.account.addressToBalanceMap[address],
          color: accountsByDBMap[address] && accountsByDBMap[address].color,
          role: getRole(state, address),
          time: accountsByDBMap[address] && accountsByDBMap[address].time
        };
      })
      .sort((a, b) => a.time - b.time);
  },
  curAccount(state, getters) {
    return getters.accounts[state.account.curAccountIdx] || { role: {} };
  }
};
