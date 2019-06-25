import net from "net";
import request from "./request";
import Setting from "../modules/setting";
const web3 = new Web3(Setting.ipcPath, net);

const lang = require("../renderer/lang/cn");
const errorInfo = { "zh-CN": 0, en: 1, fr: 2 };
let i = 1;
export const SUCCESS = 0;
export const ERROR = -1;

function formatSuccessResult(result, handle) {
  return {
    code: SUCCESS,
    result: handle(result)
  };
}

function formatErrorResult(e) {
  i = errorInfo[window.localStorage.getItem("curLang")];
  let errorMsg = e.toString().replace(/^Error: Returned error: /, "");
  return {
    code: ERROR,
    result: lang.errorInfo[errorMsg] ? lang.errorInfo[errorMsg][i] : errorMsg
  };
}
async function requestByWeb3(options) {
  let defaultOptions = {
    params: [],
    handleResult: result => result
  };
  options.handleResult = options.handleResult || defaultOptions.handleResult;

  // todo 监测不完善
  if (!options.method) throw Error("必须传递web3中的方法");
  if (typeof options.handleResult !== "function") throw Error("handleResult必须为函数");

  options.params = options.params || defaultOptions.params;

  try {
    let result = await options.method(...options.params);
    return formatSuccessResult(result, options.handleResult);
  } catch (e) {
    return formatErrorResult(e);
  }
}

// 用户
export function getAccountAddresses() {
  return requestByWeb3({
    method: web3.nts.getAccounts
  });
}

// 用户对应的余额
export function getBalances(accounts) {
  return requestByWeb3({
    method: web3.nts.getBalances,
    params: [accounts]
  });
}

export function subscribe() {
  web3.nts.subscribe(...arguments)
}

export function clearSubscriptions() {
  return web3.nts.clearSubscriptions();
}

// 发送私钥
export function importRawKey(privateKey, password) {
  return request({
    method: "personal_importRawKey",
    params: [privateKey, password]
  });
}

// 发送keystore
export function importKeystore(keystore, oldPassword, newPassword) {
  return request({
    method: "personal_importKeystore",
    params: [keystore, oldPassword, newPassword]
  });
}

// 系统链地址
export function getSysChainAddress() {
  return request({
    method: "nts_systemChain"
  });
}

// 预估gas
export function getEstimateGas(data) {
  return requestByWeb3({
    method: web3.nts.estimateGas,
    params: [data]
  });
}

// 合约interface
export function getContractInterface() {
  return requestByWeb3({
    method: web3.nts.getContractInterface
  });
}

// 发送交易
export function sendTransaction(tx, password) {
  return requestByWeb3({
    method: web3.nts.personal.sendTransaction,
    params: [tx, password]
  });
}

// 见证人信息
export function getWitnessInfo(address) {
  return request({ method: "nts_getWitness", params: [address] });
}
// 理事信息
export function getCouncilInfo(address) {
  return request({ method: "nts_getCouncil", params: [address] });
}

// 交易记录
export function getTxList(addresses, type, page, pageSize) {
  return requestByWeb3({
    method: web3.nts.getTxList,
    params: [addresses, type, page, pageSize]
  });
}

// 根据用户地址获取其见证人
export function getAccountWitnessList(address) {
  return requestByWeb3({
    method: web3.nts.getAccountWitnessList,
    params: [address]
  });
}
// 获取见证人状态
export function getChainWitnessInfo(address) {
  return requestByWeb3({
    method: web3.nts.getChainWitnessInfo,
    params: [address]
  });
}
// 获取Pow计算的地址
export function getPowAddr() {
  return request({ method: "personal_getPowAddr", params: [] });
}

// 议案列表
export function getProposalList(page, pageSize, status) {
  return requestByWeb3({
    method: web3.nts.getProposalList,
    params: [page, pageSize, status]
  });
}
// 竞选列表
export function getCampaignList(hash, page, pageSize) {
  return request({
    method: "nts_getCampaignList",
    params: [hash, page, pageSize]
  });
}
// 竞选列表排名
export function getCampaignRanking(hash, address) {
  return request({
    method: "nts_getCampaignRanking",
    params: [hash, address]
  });
}

// 议案详情
export function getProposalDetail(hash) {
  return requestByWeb3({
    method: web3.nts.getProposalDetail,
    params: [hash]
  });
}

// 账户在议案中能进行的操作
export function getProposalNextActionForAccount(hash, address) {
  return requestByWeb3({
    method: web3.nts.getProposalNextActionForAccount,
    params: [hash, address]
  });
}

// 议案理事列表
export function getProposalCouncilList(hash) {
  return requestByWeb3({
    method: web3.nts.getProposalCouncilList,
    params: [hash]
  });
}

// 议案投票列表
export function getProposalVoteList(hash, start, end) {
  return requestByWeb3({
    method: web3.nts.getProposalVoteList,
    params: [hash, start, end]
  });
}

// 发送工作量证明
export function sendWitnessPow(sendAddress, chainAddress, password) {
  return request({
    method: "personal_sendWitnessPowTxRealTime",
    params: [sendAddress, chainAddress, password]
  });
}

// 交易详情
export function getTransactionDetail(hash) {
  return requestByWeb3({
    method: web3.nts.getTransactionDetail,
    params: [hash]
  });
}

// 交易单元
export function getTxUnit(hash) {
  return requestByWeb3({
    method: web3.nts.getTxUnit,
    params: [hash]
  });
}

// 单元详情
export function getUnitDetail(hash) {
  return request({ method: "nts_getUnitByHash", params: [hash] });
}

// 共识配置
export function getConsensualConfig() {
  return requestByWeb3({
    method: web3.nts.getConsensualConfig
  });
}

// 最后一个单元
export function getLastUnits(address) {
  return request({
    method: "nts_getChainLastUnit",
    params: [address]
  });
}

// 合约地址
export function getContractAddress(hash) {
  return requestByWeb3({
    method: web3.nts.getContractAddress,
    params: [hash]
  });
}

// 开始同步节点
export function startSyncNode(mode, address) {
  return request({
    method: "admin_startSync",
    params: [mode, address]
  });
}

// 停止同步节点
export function stopSyncNode() {
  return request({ method: "admin_stopSync", params: [] });
}

// 获取理事可审批议案
export function getProposalJoin(address, page, pageSize) {
  return requestByWeb3({
    method: web3.nts.getProposalJoin,
    params: [address, page, pageSize]
  });
}

// 获取理事已审批议案
export function getProposalHaveJoin(address, page, pageSize) {
  return requestByWeb3({
    method: web3.nts.getProposalHaveJoin,
    params: [address, page, pageSize]
  });
}

// 交易状态下允许重新广播交易
export function reBroadcastTx(txHash) {
  return request({
    method: "personal_reBroadcastTx",
    params: [txHash]
  });
}

// 获取见证人管理的用户
export function getWitnessCurrentUsers(address, pageIdx = 0, pageSize = 20) {
  return request({
    method: "nts_getWitnessCurrentUsers",
    params: [address, pageIdx, pageSize]
  });
}
// 获取投票率
export function getWitnessReport(address) {
  return requestByWeb3({
    method: web3.nts.getWitnessReport,
    params: [address, 0]
  });
}

export function getUnitReceipts(hash) {
  return request({
    method: "nts_getUnitReceipts",
    params: [hash]
  });
}

// test
export function getPeersInfo() {
  return request({ method: "admin_peers", params: [] });
}

// 获取理事心跳
export function getCouncilHeartbeat(address) {
  return request({
    method: "personal_getCouncilHeartbeat",
    params: [address, 0]
  });
}

// 获取备用见证人
export function getAllSysWitness() {
  return requestByWeb3({ method: web3.nts.getAllSysWitness, params: [] });
}

// 获取用户秘钥存储的地址
export function getAdminDatadir() {
  return request({ method: "admin_datadir", params: [] });
}

// 获取见证人提现费用
export function witnessGetWitnessFee(address) {
  return request({
    method: "witness_getWitnessFee",
    params: [address]
  });
}
// 获取合约执行output
export function ntsCall(data) {
  return requestByWeb3({
    method: web3.nts.call,
    params: [data]
  });
}
// 获取所有账户身份
export function getAccountStatus(addresses) {
  return request({
    method: "nts_getAccountStatus",
    params: [addresses]
  });
}

// 获取账户见证状态
export function getAccountWitnessStatus(addresses) {
  return request({
    method: "personal_getAccountStatus",
    params: [addresses]
  });
}

// 获取最后单元
export function getHeaderByHash(hash) {
  return request({
    method: "nts_getHeaderByHash",
    params: [hash]
  });
}
