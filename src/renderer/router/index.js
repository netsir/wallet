import Vue from "vue";
import Router from "vue-router";

const index = () => import("../page/index");
const createPage = () => import("../page/createPage");
const sendTransaction = () => import("../page/sendTransaction");
const accountDetail = () => import("../page/accountDetail");
const transactionList = () => import("../page/transactionList");
const witnessManage = () => import("../page/witnessManage");
const transactionDetail = () => import("../page/transactionDetail");
const unitDetail = () => import("../page/unitDetail");

const createProposal = () => import("../page/proposal/create");
const proposalDetail = () => import("../page/proposal/detail");
const proposalList = () => import("../page/proposal/list");

const createContract = () => import("../page/contract/create");
const contractDetail = () => import("../page/contract/detail");

const councilDetail = () => import("../page/councilDetail");
const witnessDetail = () => import("../page/witnessDetail");

const test = () => import("../page/test");

const peersInfoTest = () => import("../page/peersInfoTest");
const witnessCampaign = () => import("../page/witnessCampaign");
const sendCampaign = () => import("../page/sendCampaign");

Vue.use(Router);

export default new Router({
  routes: [
    // 首页
    {
      path: "/",
      component: index
    },
    {
      path: "/create_page",
      component: createPage
    },
    // 议案
    {
      path: "/proposal/create/:cancel?",
      component: createProposal
    },
    {
      path: "/proposal/list",
      component: proposalList
    },
    {
      path: "/proposal/detail/:hash",
      component: proposalDetail
    },
    // 转账
    {
      path: "/sendTransaction/:address?",
      component: sendTransaction
    },
    // 账户详情
    {
      path: "/account/:address",
      component: accountDetail
    },
    // 最近交易
    {
      path: "/transactionList",
      component: transactionList
    },
    // 交易详情
    {
      path: "/transactionDetail/:hash",
      component: transactionDetail
    },
    // 单元详情
    {
      path: "/unitDetail/:hash",
      component: unitDetail
    },
    // 见证人管理
    {
      path: "/witnessManage/:address",
      component: witnessManage
    },
    // 创建合约
    {
      path: "/createContract",
      component: createContract
    },
    // 合约详情
    {
      path: "/contractDetail/:hash/:type",
      component: contractDetail
    },
    // 理事账户详情
    {
      path: "/councilDetail/:address",
      component: councilDetail
    },
    // 见证人详情
    {
      path: "/witnessDetail/:address",
      component: witnessDetail
    },
    // 见证人详情
    {
      path: "/test",
      component: test
    },
    //peers 测试信息
    {
      path: "/peersInfoTest",
      component: peersInfoTest
    },
    {
      path: "/witnessCampaign/:hash",
      component: witnessCampaign
    },
    {
      path: "/sendCampaign/:type/:hash",
      component: sendCampaign
    }
  ]
});
