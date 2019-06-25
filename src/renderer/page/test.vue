<template>
  <div style="padding:0 20px;overflow: hidden">
    <h3>转账</h3>
    <el-table :data="testCase_transfer">
      <el-table-column label="测试账户">
        <el-table-column prop="from" label="地址" width="330px"/>
        <el-table-column label="身份" width="120px">
          <template slot-scope="scope">
            {{ identities[scope.row.from] && identitiesMap[identities[scope.row.from].role] }}
          </template>
        </el-table-column>
        <el-table-column label="激活" width="60px">
          <template slot-scope="scope">
            {{ identities[scope.row.from] && identities[scope.row.from].active ? '是' : (identities[scope.row.from] &&
            identities[scope.row.from].role === 'normal' ? '-' : '否') }}
          </template>
        </el-table-column>
        <el-table-column label="余额(NTS)" width="100px">
          <template slot-scope="scope">
            {{ parseInt(balances[scope.row.from]) | toNts }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="caseName" label="测试用例"/>
      <el-table-column prop="expect" label="期待"/>
      <el-table-column label="测试结果" width="100px">
        <template slot-scope="scope">
          <span class="testStatus" :class="scope.row.result">
            {{ testResultMap[scope.row.result] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button :loading="scope.row.loading" size="mini" @click="test(scope.$index, scope.row)">测试</el-button>
          <!--          <el-button size="mini" @click="test(scope.$index, scope.row)">重置</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <h3>议案相关</h3>
    <el-table :data="testCase_proposal">
      <el-table-column label="测试账户">
        <el-table-column prop="from" label="地址" width="330px"/>
        <el-table-column label="身份" width="120px">
          <template slot-scope="scope">
            {{ identities[scope.row.from] && identitiesMap[identities[scope.row.from].role] }}
          </template>
        </el-table-column>
        <el-table-column label="激活" width="60px">
          <template slot-scope="scope">
            {{ identities[scope.row.from] && identities[scope.row.from].active ? '是' : (identities[scope.row.from] &&
            identities[scope.row.from].role === 'normal' ? '-' : '否') }}
          </template>
        </el-table-column>
        <el-table-column label="余额(NTS)" width="100px">
          <template slot-scope="scope">
            {{ parseInt(balances[scope.row.from]) | toNts }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="caseName" label="测试用例"/>
      <el-table-column label="测试abi">
        <template slot-scope="scope">
          {{ scope.row.abi | ellipsis}}
        </template>
      </el-table-column>
      <el-table-column prop="abiTip" label="注意事项">
        <template slot-scope="scope">
          {{ scope.row.abiTip || '无' }}
        </template>
      </el-table-column>
      <el-table-column prop="expect" label="期待"/>
      <el-table-column label="测试结果" width="100px">
        <template slot-scope="scope">
          <span class="testStatus" :class="scope.row.result">
            {{ testResultMap[scope.row.result] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button :loading="scope.row.loading" size="mini" @click="test(scope.$index, scope.row)">测试</el-button>
          <!--          <el-button size="mini" @click="test(scope.$index, scope.row)">重置</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <h3>见证人相关</h3>
    <el-table :data="testCase_witness">
      <el-table-column label="测试账户">
        <el-table-column prop="from" label="地址" width="330px"/>
        <el-table-column label="身份" width="120px">
          <template slot-scope="scope">
            {{ identities[scope.row.from] && identitiesMap[identities[scope.row.from].role] }}
          </template>
        </el-table-column>
        <el-table-column label="激活" width="60px">
          <template slot-scope="scope">
            {{ identities[scope.row.from] && identities[scope.row.from].active ? '是' : (identities[scope.row.from] &&
            identities[scope.row.from].role === 'normal' ? '-' : '否') }}
          </template>
        </el-table-column>
        <el-table-column label="余额(NTS)" width="100px">
          <template slot-scope="scope">
            {{ parseInt(balances[scope.row.from]) | toNts }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="caseName" label="测试用例"/>
      <el-table-column label="测试abi">
        <template slot-scope="scope">
          {{ scope.row.abi | ellipsis}}
        </template>
      </el-table-column>
      <el-table-column prop="abiTip" label="注意事项">
        <template slot-scope="scope">
          {{ scope.row.abiTip || '无' }}
        </template>
      </el-table-column>
      <el-table-column prop="expect" label="期待"/>
      <el-table-column label="测试结果" width="100px">
        <template slot-scope="scope">
          <span class="testStatus" :class="scope.row.result">
            {{ testResultMap[scope.row.result] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button :loading="scope.row.loading" size="mini" @click="test(scope.$index, scope.row)">测试</el-button>
          <!--          <el-button size="mini" @click="test(scope.$index, scope.row)">重置</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <h3>合约相关</h3>
    <el-table :data="testCase_contract">
      <el-table-column label="测试账户">
        <el-table-column label="地址" width="330px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">{{i}}</li>
            </ul>
            <p v-else>{{scope.row.from}}</p>
          </template>
        </el-table-column>
        <el-table-column label="身份" width="120px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">{{identities[i] && identitiesMap[identities[i].role]}}</li>
            </ul>
            <p v-else>{{identities[scope.row.from]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="激活" width="60px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">
                {{ identities[i] && identities[i].active ? '是' : (identities[i] && identities[i].role === 'normal' ? '-' : '否')}}
              </li>
            </ul>
            <p v-else>
              {{ identities[scope.row.from] && identities[scope.row.from].active ? '是' : (identities[scope.row.from] && identities[scope.row.from].role === 'normal' ? '-' : '否') }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="余额(NTS)" width="180px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">
                {{ parseInt(balances[i]) | toNts }}
              </li>
            </ul>
            <p v-else>{{ parseInt(balances[scope.row.from]) | toNts }}</p>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="caseName" label="测试用例"/>
      <el-table-column label="测试abi">
        <template slot-scope="scope">
          {{ scope.row.abi | ellipsis}}
        </template>
      </el-table-column>
      <el-table-column prop="contractName" label="合约名字"/>
      <el-table-column prop="to" label="合约地址"/>
      <el-table-column prop="abiTip" label="注意事项">
        <template slot-scope="scope">
          {{ scope.row.abiTip || '无' }}
        </template>
      </el-table-column>
      <el-table-column prop="expect" label="期待"/>
      <el-table-column label="测试结果" width="100px">
        <template slot-scope="scope">
          <span class="testStatus" :class="scope.row.result">
            {{ testResultMap[scope.row.result] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button :loading="scope.row.loading" size="mini" @click="test(scope.$index, scope.row)">测试</el-button>
          <!--          <el-button size="mini" @click="test(scope.$index, scope.row)">重置</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <h3>注销相关</h3>
    <el-table :data="testCase_logout">
      <el-table-column label="测试账户">
        <el-table-column label="地址" width="340px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from"> {{ i }}</li>
            </ul>
            <p v-else>{{scope.row.from}}</p>
          </template>
        </el-table-column>
        <el-table-column label="身份" width="120px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">
                {{identities[i] && identitiesMap[identities[i].role]}}
              </li>
            </ul>
            <p v-else>{{identities[scope.row.from] && identitiesMap[identities[scope.row.from].role]}}</p>
          </template>

        </el-table-column>
        <el-table-column label="激活" width="60px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">
                {{ identities[i] && identities[i].active ? '是' : (identities[i] && identities[i].role === 'normal' ? '-' : '否')}}
              </li>
            </ul>
            <p v-else>
              {{ identities[scope.row.from] && identities[scope.row.from].active ? '是' : (identities[scope.row.from] && identities[scope.row.from].role === 'normal' ? '-' : '否') }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="余额(NTS)" width="180px">
          <template slot-scope="scope">
            <ul v-if="Array.isArray(scope.row.from)">
              <li v-for="i in scope.row.from">
                {{ parseInt(balances[i]) | toNts }}
              </li>
            </ul>
            <p v-else>{{ parseInt(balances[scope.row.from]) | toNts }}</p>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="测试用例">
        <template slot-scope="scope">
          <ul v-if="Array.isArray(scope.row.caseName)">
            <li v-for="i in scope.row.caseName"> {{ i }}</li>
          </ul>
          <p v-else>{{ scope.row.caseName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="测试abi">
        <template slot-scope="scope">
          <ul v-if="Array.isArray(scope.row.abi)">
            <li v-for="i in scope.row.abi">{{ i }}</li>
          </ul>
          <p v-else>{{ scope.row.abi }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="expect" label="期待"/>
      <el-table-column label="测试结果" width="100px">
        <template slot-scope="scope">
          <span class="testStatus" :class="scope.row.result">
            {{ testResultMap[scope.row.result] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button :loading="scope.row.loading" size="mini" @click="test(scope.$index, scope.row)">测试</el-button>
          <!--          <el-button size="mini" @click="test(scope.$index, scope.row)">重置</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import vuexData from "../mixins/vuexData";
import * as api from "../../api";
import { toDotBN } from "../utils";

const testMode = {
  M2S: 1, // 多对单
  S2S: 2 // 单对单
};

const proposalHash = "0x79861448dd189a81cf5911ad8837a061ede33913d148e85711f01720388896e1".slice(
  2
);

const funcToSignature = {
  SetMemberJoinApply: "0xe087d7bf",
  SetMemberRemoveApply: "0xdd163940",
  councilExit: "0x0bd5f72c",
  SetConfigApply: "0x6bd13b64",
  SetConfigApplyVote: "0x528781f1",
  SetConfigVote: "0x6625f65e",
  SetConfigFinalize: "0x0f8161ad",
  SetSystemWitness: "0x623f1b9e",
  SetUserWitness: "0x1e7ea747",
  SetSystemWitnessApply: "0x86e21b83",
  SetSystemWitnessAddMargin: "0x90ccf25e",
  SetSystemWitnessFinalize: "0x6f659b61",
  removeInvalid: "0xd81b740e",
  AllSystemWitnessReplace: "0xf82263f5",
  SystemHeartbeat: "0x6bb43e01",
  MemberHeartbeat: "0x9a42f192",
  GetAdditional: "0x86bcccb5",
  Settlement: "0xcda70ec5",
  ApplyWitness: "0x778c2cad",
  applyWitnessWay2: "0x4360748c",
  CancelWitness: "0xb0c6afd4",
  ReplaceWitness: "0x6f410bb7",
  ReplaceWitnessExecute: "0xf05b5cf3",
  ReportDishonest: "0xfd4322ea",
  CreateContract: "0x09e46464"
};

const groupBuyAddress = "nsc1qyqszq2259pmwtf27ljv8wnl3wvv4hlkslx6h9";

function getTx(hash) {
  return new Promise(resolve => {
    let timer = setInterval(async () => {
      let { result } = await api.getTransactionDetail(hash);
      if (result.status !== "underway") {
        resolve(result);
        clearInterval(timer);
      }
    }, 2000);
  });
}

let testAccount = {
  normal: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
  normal2: "nts14e7x3dpjtl2anrk7km2r8hwtcuq2dry0wke0zy",
  council: "nts1gjxw3wtnxg49scvvru0qz5dulpcs3q4fv9t52u",
  witness: "nts10mexyv9s44xlcs0canycqmxgzpjeawrjynmdql"
};

function getTxs(hashes) {
  return new Promise(resolve => {
    let timer = setInterval(async () => {
      let results = await Promise.all(
        hashes.map(hash => api.getTransactionDetail(hash))
      );
      let status = results.map(i => i.result.status);
      if (!status.includes("underway")) {
        resolve(results.map(result => result.result));
        clearInterval(timer);
      }
    }, 2000);
  });
}

export default {
  name: "test",
  mixins: [vuexData],
  data() {
    return {
      balances: {},
      identities: {},
      identitiesMap: {
        main_system_witness: "系统见证人",
        second_system_witness: "备用系统见证人",
        normal: "普通账户",
        council: "理事会成员",
        contract: "合约地址",
        user_witness: "用户见证人"
      },

      testResultMap: {
        unCheck: "-",
        success: "正确",
        fail: "错误"
      },

      testCase_transfer: [
        {
          caseName: "转账至系统链合约",
          amount: 1,
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        }
      ],
      testCase_proposal: [
        {
          caseName: "非理事发起 系统见证人 竞选",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi: funcToSignature.SetSystemWitness,
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "非理事发起 用户见证人 竞选",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi: funcToSignature.SetUserWitness,
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "发起不存在的共识配置修改",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi:
            funcToSignature.SetConfigApply +
            "000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000007a120a000000000000000000000000000000000000000000000000000000000000000d75634761734c696d646464697400000000000000000000000000000000000000",
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "非理事审核",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi:
            funcToSignature.SetConfigApplyVote +
            proposalHash +
            "0000000000000000000000000000000000000000000000000000000000000001",
          abiTip:
            "该abi会变,每次测试请确保有议案是处于审批中,并且abi是根据议案哈希生成的",
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "重复审批(3次)",
          from: "nts1gjxw3wtnxg49scvvru0qz5dulpcs3q4fv9t52u",
          abi:
            funcToSignature.SetConfigApplyVote +
            proposalHash +
            "0000000000000000000000000000000000000000000000000000000000000001",
          abiTip:
            "该abi会变,每次测试请确保有议案是处于审批中,并且abi是根据议案哈希生成的",
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          time: 3,
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "重复投票(3次)",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi:
            funcToSignature.SetConfigVote +
            proposalHash +
            "0000000000000000000000000000000000000000000000000000000000000001",
          abiTip:
            "该abi会变,每次测试请确保有议案是处于投票中,并且abi是根据议案哈希生成的",
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          time: 3,
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "无币账户投票",
          from: "nts14e7x3dpjtl2anrk7km2r8hwtcuq2dry0wke0zy",
          abi:
            funcToSignature.SetConfigVote +
            proposalHash +
            "0000000000000000000000000000000000000000000000000000000000000001",
          abiTip:
            "该abi会变,每次测试请确保有议案是处于投票中,并且abi是根据议案哈希生成的",
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "不够票数定案",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi: funcToSignature.SetConfigFinalize + proposalHash,
          abiTip:
            "该abi会变,每次测试请确保有议案是处于 投票中 或 审批中,并且abi是根据议案哈希生成的",
          verifyFunction: async txHash => {
            const tx = await getTx(txHash);
            return tx.status === "failed";
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "重复定案(3次)",
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi: funcToSignature.SetConfigFinalize + proposalHash,
          abiTip:
            "该abi会变,每次测试请确保有议案是处于定案中,并且abi是根据议案哈希生成的",
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          time: 3,
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "重复参与系统见证人竞选(3次)",
          amount: 500000,
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi: funcToSignature.SetSystemWitnessApply + proposalHash,
          abiTip:
            "该abi会变,每次测试请确保有议案是处于竞选中,并且abi是根据议案哈希生成的",
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          time: 3,
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "重复参与用户见证人竞选(3次)",
          amount: 500000,
          from: "nts1hh568vkxz8jqtkv027cmf5e4fdfqvc5z3ecuqv",
          abi: funcToSignature.SetSystemWitnessApply + proposalHash,
          abiTip:
            "该abi会变,每次测试请确保有议案是处于竞选中,并且abi是根据议案哈希生成的",
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          time: 3,
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        }
      ],
      testCase_witness: [
        {
          caseName: "见证人已出单元数量",
          from: testAccount.normal,
          to: testAccount.normal,
          verifyFunction: async txHash => {
            const { result: witnessList } = await api.getAccountWitnessList(
              testAccount.normal
            );
            const pastWitnessReports = (await Promise.all(
              witnessList.map(i => api.getWitnessReport(i))
            )).map(i => i.result);
            await getTx(txHash);
            const {
              result: [{ unit_hash }]
            } = await api.getTxUnit(txHash);
            const {
              result: {
                header: { proposer },
                witness_list: unitWitnessList
              }
            } = await api.getUnitDetail(unit_hash);
            const curWitnessReports = (await Promise.all(
              unitWitnessList.map(i => api.getWitnessReport(i))
            )).map(i => i.result);

            const { created_units: pastCreatedUnitNum } = pastWitnessReports[
              witnessList.indexOf(proposer)
            ];
            const { created_units: curCreatedUnitNum } = curWitnessReports[
              unitWitnessList.indexOf(proposer)
            ];
            return curCreatedUnitNum - pastCreatedUnitNum === 1;
          },
          expect: "提案者的出单元数量+1",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "见证人投票",
          from: testAccount.normal,
          to: testAccount.normal,
          verifyFunction: async txHash => {
            const { result: witnessList } = await api.getAccountWitnessList(
              testAccount.normal
            );
            const pastWitnessReports = (await Promise.all(
              witnessList.map(i => api.getWitnessReport(i))
            )).map(i => i.result);
            await getTx(txHash);
            const {
              result: [{ unit_hash }]
            } = await api.getTxUnit(txHash);
            const {
              result: { witness_list: unitWitnessList }
            } = await api.getUnitDetail(unit_hash);
            const curWitnessReports = (await Promise.all(
              unitWitnessList.map(i => api.getWitnessReport(i))
            )).map(i => i.result);

            return unitWitnessList.every((i, idx) => {
              const {
                voted_units: pastVoteNum,
                should_vote_units: pastShouldVoteNum
              } = pastWitnessReports[witnessList.indexOf(i)];
              const {
                voted_units: curVoteNum,
                should_vote_units: curShouldVoteNum
              } = curWitnessReports[idx];
              return (
                curVoteNum - pastVoteNum === 1 &&
                curShouldVoteNum - pastShouldVoteNum === 1
              );
            });
          },
          expect: "有参与投票的见证人的投票数量+1 与 应投票的数量+1",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "见证人手续费",
          from: testAccount.normal,
          to: testAccount.normal,
          beforeVerify: async () => {},
          verifyFunction: async txHash => {
            const { result: witnessList } = await api.getAccountWitnessList(
              testAccount.normal
            );
            const pastWitnessReports = (await Promise.all(
              witnessList.map(i => api.getWitnessReport(i))
            )).map(i => i.result);
            const { gasUsed, gasPrice } = await getTx(txHash);
            const gasFee = parseInt(gasUsed) * parseInt(gasPrice);
            const {
              result: [{ unit_hash }]
            } = await api.getTxUnit(txHash);
            const {
              result: {
                header: { proposer },
                witness_list: unitWitnessList
              }
            } = await api.getUnitDetail(unit_hash);
            const curWitnessReports = (await Promise.all(
              unitWitnessList.map(i => api.getWitnessReport(i))
            )).map(i => i.result);
            return unitWitnessList.every((i, idx) => {
              const { created_unit_fee: pastFee } = pastWitnessReports[
                witnessList.indexOf(i)
              ];
              const { created_unit_fee: curFee } = curWitnessReports[idx];
              return i === proposer
                ? curFee - pastFee === gasFee
                : curFee === pastFee;
            });
          },
          expect:
            "其他见证人获得的见证手续费不变，而该单元的手续费属于该提案者",
          result: "unCheck",
          loading: false
        }
      ],
      testCase_contract: [
        {
          caseName: "抢购测试-单个账户抢多次",
          mode: testMode.M2S,
          contractName: "groupBuy",
          // from: [testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal, testAccount.normal],
          gas: new Array(5).fill(web3.utils.toHex("37246")),
          from: new Array(5).fill(testAccount.normal),
          gasPrice: [10, 11, 12, 13, 14],
          to: groupBuyAddress,
          abi: "0xa6f2ae3a",
          time: 5,
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const averageGasPrice =
              txs
                .map(i => parseInt(i.gasPrice))
                .reduce((sum, cur) => sum + cur, 0) / txs.length;
            const passAverageGasPrice =
              txs
                .filter(i => i.status === "pass")
                .map(i => parseInt(i.gasPrice))
                .reduce((sum, cur) => sum + cur, 0) /
              txs.filter(i => i.status === "pass").length;
            console.log(passAverageGasPrice, averageGasPrice);
            return passAverageGasPrice > averageGasPrice;
          },
          expect: "gasPrice高的大概率抢购成功",
          result: "unCheck",
          loading: false
        }
      ],
      testCase_logout: [
        {
          caseName: [
            "理事注销见证人",
            "见证人注销理事",
            "普通账户注销理事",
            "普通账户注销见证人"
          ],
          mode: testMode.M2S,
          from: [
            testAccount.council,
            testAccount.witness,
            testAccount.normal,
            testAccount.normal
          ],
          abi: [
            funcToSignature.CancelWitness,
            funcToSignature.councilExit,
            funcToSignature.councilExit,
            funcToSignature.CancelWitness
          ],
          time: 4,
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return status.every(i => i === "failed");
          },
          expect: "交易失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "理事-重复注销",
          mode: testMode.S2S,
          from: testAccount.council,
          abi: funcToSignature.councilExit,
          time: 3,
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        },
        {
          caseName: "见证人-重复注销",
          mode: testMode.S2S,
          from: testAccount.witness,
          abi: funcToSignature.CancelWitness,
          time: 3,
          verifyFunction: async (...txHashes) => {
            const txs = await getTxs(txHashes);
            const status = txs.map(tx => tx.status);
            return (
              status.filter(i => i === "pass").length === 1 &&
              status.filter(i => i === "failed").length === 2
            );
          },
          expect: "有且只有一个交易成功, 其他均失败",
          result: "unCheck",
          loading: false
        }
      ]
    };
  },
  filters: {
    ellipsis(text) {
      if (!text) return "";
      if (text.length > 24) return text.slice(0, 10) + "..." + text.slice(-10);
      else return text;
    }
  },
  methods: {
    async testM2S(test_case) {
      const isIllegal = parseInt(test_case.time) !== test_case.time;
      if (isIllegal) throw Error("M2S模式必须传入time参数且其必须为整数");
      let txs = new Array(test_case.time).fill(undefined).map((i, idx) => {
        return {
          amount: Array.isArray(test_case.amount)
            ? web3.utils.toHex(toDotBN(test_case.amount))
            : "0x0",
          gas: Array.isArray(test_case.gas)
            ? web3.utils.toHex(test_case.gas[idx])
            : "0xffff",
          gasPrice: Array.isArray(test_case.gasPrice)
            ? web3.utils.toHex(test_case.gasPrice[idx])
            : "0xf",
          timeout: "0xe10",
          from: Array.isArray(test_case.from)
            ? test_case.from[idx]
            : test_case.from,
          to: Array.isArray(test_case.to)
            ? test_case.to[idx]
            : test_case.to || this.sysChainAddress,
          data: Array.isArray(test_case.abi)
            ? test_case.abi[idx]
            : test_case.abi || ""
        };
      });
      return await Promise.all(
        new Array(test_case.time)
          .fill(undefined)
          .map((i, idx) => api.sendTransaction(txs[idx], "123123"))
      );
    },
    async testS2S(test_case) {
      let results = [];
      let tx = {
        amount: test_case.amount
          ? web3.utils.toHex(toDotBN(test_case.amount))
          : "0x0",
        gas: "0x6fffff",
        gasPrice: "0xf",
        timeout: "0xe10",
        from: test_case.from,
        to: test_case.to || this.sysChainAddress,
        data: test_case.abi || ""
      };
      test_case.time = test_case.time || 1;
      for (let i = 0; i < test_case.time; i++) {
        results.push(await api.sendTransaction(tx, "123123"));
      }
      return results;
    },
    async test(idx, test_case) {
      test_case.loading = true;
      test_case.haveSendError = !!test_case.haveSendError;
      // 获取所有交易
      let results;
      if (test_case.mode === testMode.M2S) {
        results = await this.testM2S(test_case);
      } else {
        results = await this.testS2S(test_case);
      }
      // 交易是否出错
      let sendError = !results.map(i => i.code).every(i => i === api.SUCCESS);
      if (sendError) {
        test_case.loading = false;
        // 该测试用例是否会在发送交易时报错
        if (!test_case.haveSendError) {
          console.error(results.filter(i => i.code !== api.SUCCESS));
        }
        return (test_case.result = test_case.haveSendError
          ? "success"
          : "fail");
      }
      // 拿到所有交易的哈希
      let hashes = results.map(i => i.result);
      // 将哈希给予verifyFunction对交易进行验证
      let isSuccess = await test_case.verifyFunction(...hashes);
      test_case.result = isSuccess ? "success" : "fail";
      test_case.loading = false;
    },
    async getTestAccountData() {
      const accounts = Object.values(testAccount);
      this.balances = (await api.getBalances(accounts)).result;
      this.identities = (await api.getAccountStatus(accounts)).result;
    }
  },
  mounted() {
    this.getTestAccountData();
  }
};
</script>

<style scoped lang="scss">
h3 {
  text-align: center;
  font-size: 24px;
  margin: 10px 0;
}

.testStatus {
  &.success {
    color: green;
  }

  &.fail {
    color: red;
  }
}
</style>
