import * as contractDB from "../../modules/db/contract";
import store from "../store";
let web3 = new Web3();
let contract;
export function initContract(json) {
  contractDB.insert({
    name: "",
    contractAddress: store.state.system.sysChainAddress,
    jsonInterface: json
  });
  contract = new web3.nts.Contract(json);
}

export function getTransactionABI(method, params = []) {
  if (!contract)
    return console.error("The Contract has not yet been initialized");
  return contract.methods[method](...params).encodeABI();
}
