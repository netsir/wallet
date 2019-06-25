
# nerthus-wallet

### 环境安装

```
npm install
```

### 运行

```
npm run dev-testnet
```


### 注意事项

1. 可能会遇到一个node的错误(具体什么错误我也忘记了, 大概问题是下载的electron和你的node版本不匹配这种), 这时候可以用 electron-rebuild 这个包来解决, 依赖里已经有了这个包了, 只需在根目录下运行 `npx run electron-rebuild` 即可

2. npm install 时请确保已经翻墙了, 不然有些包可能安装不上

### Windows 系统

如果在 npm install 期间遇到关于 node-gyp 的错误，那么你很有可能没有在你的系统上安装正确的构建工具。构建工具包括 Python 和 Visual Studio 等等。

我们需要检查的第一项是 npm 的版本，并确保它是最新的。这个可以使用 npm-windows-upgrade 来完成。

若上一项检查完成，我们可以继续设置所需的构建工具。使用 windows-build-tools 来为我们完成大部分烦人的工作。全局安装此工具将依次设置 Visual C++ 软件包、Python 等等。

总之, windows的环境很麻烦. 你要做好心理准备. 

### 目录说明(带*号的文件应该重点关注)

```
├── .babelrc    babel配置
├── .electron-vue   打包的相关配置
├── .gitignore
├── build   打包完后应用所在目录
├── README.md
├── cnts    cnts及cnts配置文件所存放的目录
├── package-lock.json
├── package.json
├── src     项目源码
│   ├── api 
│   │   ├── index.js    向cnts请求的所有api
│   │   └── request.js  一些底层封装
│   ├── cnts
│   │   └── index.js    应用中启动cnts的相关代码
│   ├── index.ejs       主页面的模板
│   ├── init.html       启动界面的模板
│   ├── main            主进程相关代码
│   │   ├── compile.js  合约代码编译相关
│   │   ├── index.dev.js
│   │   ├── index.js
│   │   └── listener.js 主进程所有的监听事件
│   ├── modules     分隔出来的一些模块
│   │   ├── db      存储相关
│   │   │   ├── account.js      账户的存储操作
│   │   │   ├── contract.js     合约的存储操作
│   │   │   ├── index.js        存储相关的初始化
│   │   │   └── tokenCoin.js    币种的存储操作
│   │   ├── menu.js     应用顶部的菜单
│   │   ├── setting.js  Setting类, 可以获得一些相关设置参数, 比如获取应用根目录,cnts启动设置等等 
│   │   └── window.js   一共有两个window, 一个是启动页,一个是主页面
│   ├── renderer    *渲染进程相关
│   │   ├── App.vue  顶级组件
│   │   ├── components  业务组件(基础组件用的是element-ui) 
│   │   │   ├── accountList 账户列表
│   │   │   ├── avatar 身份标识
│   │   │   ├── card   卡片
│   │   │   ├── createButton  首页那个新建账户的按钮
│   │   │   ├── dialog  对话框
│   │   │   │   ├── helpWitnessDialog.vue   帮助他人申请见证人的对话框
│   │   │   │   ├── riskTipsDialog.vue      风险提示的对话框
│   │   │   │   ├── transactionDialog.vue   *交易的对话框 
│   │   │   │   ├── watchContractDialog.vue 观察合约的对话框
│   │   │   │   ├── watchTokenDialog.vue    观察代币的对话框
│   │   │   │   └── witnessDialog.vue       申请见证人的对话框
│   │   │   ├── item            交易详情页和单元详情页的key-value条
│   │   │   ├── mainHeader      整个应用的头部, 就是有logo的那一条
│   │   │   ├── navMenu         整个应用的左侧导航
│   │   │   ├── proposalList    议案列表
│   │   │   ├── smallTip        pow计算中的提示框
│   │   │   ├── tip             单元同步中的提示框
│   │   │   ├── transactionList     交易列表
│   │   │   └── witnessCampaignList 见证人竞选的列表
│   │   ├── config
│   │   │   └── proposal.js     议案种类所对应的系统合约方法名
│   │   ├── const   一些常量, 避免magic number/string
│   │   │   ├── account.js      账户身份相关
│   │   │   ├── proposal.js     议案相关
│   │   │   ├── system.js       系统合约方法相关
│   │   │   └── token.js        代币相关
│   │   ├── contract            系统合约
│   │   │   └── index.js        初始化系统合约
│   │   ├── filters             vue里的filters
│   │   ├── initApp.js          初始化应用, 比如安装element-ui, 初始化DB等
│   │   ├── lang                语言包
│   │   ├── loadingPage.vue     初始化页面, 就开始的那个小窗口
│   │   ├── loadingPageMain.js  初始化的主入口
│   │   ├── main.js 主入口
│   │   ├── map     一些映射
│   │   │   ├── proposal.js     议案种类所对应的系统合约方法名, 基本同 config/proposal 只是不需要写sysType了
│   │   │   └── system.js       同 const/system, 我也不知道为什么有两个, 项目变更太多次了
│   │   ├── mixins  vue的mixins
│   │   │   ├── emitter.js      这个mixin只有在 components/navMenu 用了,当初因为觉得其他组件也可能用,就放这了
│   │   │   └── vuexData.js     vuex上的数据, 我只是不想每个组件都写一遍..
│   │   ├── page
│   │   │   ├── accountDetail.vue   用户详情页
│   │   │   ├── contract    合约相关
│   │   │   │   ├── create.vue      新建合约页面(这个页面极其睿智, 用来写 Solidity 代码的)
│   │   │   │   └── detail.vue      *合约详情页
│   │   │   ├── councilDetail.vue   理事会账户详情
│   │   │   ├── createPage.vue      新建页(合约/议案/代币)
│   │   │   ├── index.vue           主页面
│   │   │   ├── peersInfoTest.vue   之前用来看peers的页面, 测试用的
│   │   │   ├── proposal    议案相关
│   │   │   │   ├── councilList.vue 理事审批列表
│   │   │   │   ├── create.vue      *新建议案页
│   │   │   │   ├── detail.vue      *议案详情页
│   │   │   │   ├── detailHeader.vue 议案详情页上面的信息,相当于一个小组件
│   │   │   │   ├── detailList.vue  议案下面的审批列表(一个动态组件, 根据议案状态显示出是councilList还是voteList)
│   │   │   │   ├── list.vue        议案列表页
│   │   │   │   └── voteList.vue    公共投票列表页
│   │   │   ├── sendCampaign.vue    支付竞选金额页
│   │   │   ├── sendTransaction.vue *发送交易页
│   │   │   ├── test.vue            测试页
│   │   │   ├── transactionDetail   交易详情页
│   │   │   ├── transactionList.vue 交易列表页
│   │   │   ├── unitDetail          单元详情页
│   │   │   ├── witnessCampaign.vue 见证人竞选页
│   │   │   ├── witnessDetail.vue   见证人详情页
│   │   │   └── witnessManage.vue   见证人管理页
│   │   ├── router  路由
│   │   ├── store   vuex的store
│   │   ├── styles  样式
│   │   │   ├── animate.scss    动画相关
│   │   │   ├── hack.scss       element-ui的hack
│   │   │   ├── icon-font       字体图标
│   │   │   ├── mixins.scss     sass中的mixins
│   │   │   ├── reset.scss      css reset
│   │   │   └── vars.scss       sass中的变量
│   │   └── utils.js    一些工具方法
│   └── web3.js         web3
```

#### 一些依赖包的说明

- bignumber.js 由于js的数字精度的问题,有些大数无法准确的处理, 所以引入了这个包
- bip39, bitcoinjs-lib 这两个包主要跟创建账户相关, 作用是生成私钥与助记词
- nedb 前端相关的存储
- solc 编译solidity的包
- sntp 这个好像是跟判断电脑本地时间和标准时间用的, 由于这个功能不是我做得, 所以不太清楚, 但我记得后期这个功能好像是给注释掉了

### 后端交互

我们是没有中心服务器的, 前端都是通过ipc与后端提供的cnts做交互. 可以理解为cnts就是一个前端看来的"服务器". 每个钱包都一个"服务器".

应用启动时, 前端通过node中的child_process模块启动了cnts (具体代码见 src/cnts/index.js), 相关的启动参数见Setting类的cntsStartCfg

实际上这里的启动相当于你在command line中 输入 ```nerthus-wallet/cnts/cnts --testnet --verbosity 4 ...```

启动cnts后, cnts会自动创建一个 cnts.ipc 文件( 路径在不同系统下不同, 具体见 Setting类的 ipcPath ), 我们便是用ipc与这个文件做交互的. 若已经启动了cnts则应用不会再次启动cnts.

前面目录说明中有提到api目录下有个request的文件是一些底层封装, 其实就是封装了与ipc通讯的一些方法, 但后面发现web3支持与ipc直接通讯, 所以基本在
api/index 下的方法从原本的 ipcRequest 都转为 web3调用的形式 (若web3无此方法则说明web3没有及时更新,找瓦西里即可). 当然因为cnts也支持rpc的模式, 所以底层也暴露了rpc的方法, 只需把请求的方法换成httpRequest即可.

需要注意的是, 因为cnts启动需要一定时间, 而如果没有完全启动(即cnts.ipc文件尚未生成), 程序会报错. 故我在 loadingPage.vue(即开始的小窗口) 中使用了 
api/request 的 initSocket 方法, 以确保cnts已经完全启动. 该方法比较暴力, 我尝试过节流, 但似乎是v8的问题,导致无法resolve(也可能是我姿势不对). 


### 业务说明

首先要明确的一点就是, 我们系统中几乎所有的操作都是交易, 转账是一笔交易, 创建合约是一笔交易, 执行合约是一笔交易, 新建议案是一笔交易....(如果这里理解不了的话问双齐)

所以想要正确的操作, 必须知道如何构建一笔交易并发送. 


#### 发送的接口是 api/index中的sendTransaction.

参数1: tx 交易对象 --即你要构建的交易

结构如下
```
{
   gas: web3.utils.toHex(1000), // 本次交易能用的gas上限, 16进制数
   gasPrice: web3.utils.toHex(1), // gas的单价, 16进制数
   amount: web3.utils.toHex(10000), // 转账的金额,单位为Dot, 16进制数
   timeout: web3.utils.toHex(60 * 60) // 本次交易的超时时间,单位为秒, 16进制数
   from: 'nts198rph27nsfw75k0g68jyrzn4aula6t22uvrkqw', // from 账户地址
   to: 'nts198rph27nsfw75k0g68jyrzn4aula6t22uvrkqw', // to 账户地址
   data: web3.utils.utf8ToHex('') // 备注信息, 也是16进制数
}
// 该交易对象表示 从 账户nts198rph27nsfw75k0g68jyrzn4aula6t22uvrkqw 中转账至 账户nts198rph27nsfw75k0g68jyrzn4aula6t22uvrkqw (自己给自己转账)
// 10000 Dot (1 NTS = 1e12 Dot), 消耗的最高上限为1000gas, gas单价为1dot. 交易有效期是1小时. 附带的备注信息为 ''(空字符串)
```

参数2: 当前账户的密码

#### 举个最简单的转账例子

A账户(交易密码为123123) 要转给 B账户 10 DOT, 备注内容为 还欠款10Dot

那么下面的就是发送该交易的代码
```
let tx = {
   gas: web3.utils.toHex(21000), // 转账的gas是固定的, 如果是其他的交易gas是不确定的,需要通过另外的接口去得到gas值, 后面会说
   gasPrice: web3.utils.toHex(1), // 单价就为 1gas/dot 好了 
   amount: web3.utils.toHex(10), // 金额 10dot
   timeout: web3.utils.toHex(60 * 60)
   from: A的地址,
   to: B的地址,
   data: web3.utils.utf8ToHex('还欠款10Dot')
}
api.sendTransaction(tx, '123123');
```

 前面说过, 几乎所有的操作都是一笔交易, 那么那些交易与转账最大的区别就是 to 和 data 不同
 
 我们的业务实际上就是调用系统合约的各种方法, 类似发起议案阿, 参与见证人竞选阿, 本质都只是调用了合约的方法
 
 系统合约也是合约, 只不过是一开始就存在的, 跟用户创建的合约没有任何差别. 
 
 所以要执行合约的方法, 其实也就是更改了 tx 对象中的 to 和 data . 当然 gas, gasPrice等其他字段, 都取决你自己的设置而已.

 to 变成了合约地址, 而 data 备注信息, 实际上就是让 合约 知道 到底是调用了哪个方法, 参数是什么. 

 打个比方, A 现在要申请一个议案, 议案内容为 修改共识配置 交易最低燃料单价gasPrice 2 ( 本质上是 A 要调用一个 系统方法, 只是我们把 系统合约中某几个方法的调用 统一叫 申请议案,方便用户理解 )
 
 由于这是调用系统合约, 故 to 为系统合约地址(系统链地址), 业务里基本都是调系统合约. 除非你是在调用其他合约, 那么 to 就是那个合约的地址了
 
 系统合约的地址是由cnts决定的, 所以是通过接口去拿的, 我把它存在了store的system模块中. 
 
那么tx对象为
```
tx = {
   gas: web3.utils.toHex(304258), // 像这些gas的值就不是固定的了, 需要通过 api.getEstimateGas(tx) 去拿到, 传入的tx和你要发送的tx是一样的, 这个接口就是模拟合约执行, 然后算出gas需要多少, 这里算出来是304258
   gasPrice: web3.utils.toHex(1), // 单价就为 1gas/dot 好了 
   amount: web3.utils.toHex(0), // 因为这个方法不需要amount, 所以为 0, 当然, 有些合约的调用是需要amount的
   timeout: web3.utils.toHex(60 * 60) // 交易超时时间, 不解释啦, 基本都是写1小时
   from: A账户的地址, 
   to: $store.state.system.sysChainAddress, // 系统合约地址(系统链地址)
   data: '0x6bd13b6400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e6c6f776573744761735072696365000000000000000000000000000000000000'
}
```

#### data这一串东西是怎么得到的?

前面说过, 我们的业务实际上就是调用系统合约的各种方法. 所以应用启动的时候, 从后端拿到了系统合约的interface并初始化了, 代码在src/contract/index.js中, 该文件暴露出来的contract就是系统合约的实例

而获取对应的abi(即上面的data)则是通过文件中getTransactionABI这个函数得到的. 实际上这个函数就是调用了 contract.methods\[method\](...params).encodeABI()

method 为你所要调用的系统方法

params 为一个数组, 数组中为该方法的参数.

比如 修改共识配置 的系统方法为 SetConfigApply . 我们根据系统合约的interface发现该方法是有两个参数, 第一个参数 key 为要修改哪一个共识配置, 第二参数 value 为修改为多少

所以得到 abi(即上面的data) 的代码就是 
```
getTransactionABI('SetConfigApply', ['min_config_pvote_agree', 2]) 
```
即
```
contract.methods['SetConfigApply']('min_config_pvote_agree', 2).encodeABI() 
```

再比如 理事赞成或反对议案 的操作, 其系统方法为 SetConfigApplyVote. 根据interface得知需要两个参数, 第一个 hash 为 议案的哈希, 第二个 opinion 为赞成或反对, 值为 true 或 false

那么获得其abi的代码就是 

```
getTransactionABI('SetConfigApplyVote', [议案哈希, true 或 false]) 
``` 

当然该交易只有是 理事会成员发送的 且 议案是在审批阶段 才能成功. 其他情况该交易都是会失败的.

综上, 基本所有业务中的交易对象, 都是这么构建的
```
tx = {
   gas: api.getEstimateGas(tx), // 这里的tx就是你这个tx, 当然这是伪代码
   gasPrice: web3.utils.toHex(1), 
   amount: web3.utils.toHex(0),
   timeout: web3.utils.toHex(60 * 60) 
   from: 账户的地址, // 一般为当前账户
   to: $store.state.system.sysChainAddress
   data: getTransactionABI(系统合约的方法, [参数1, 参数2, ...])
}
```
得到交易对象后就跟转账一样, 直接用api.sendTransaction(tx, 账户密码) 发送即可. 

理解了上述内容, 大体基本就没问题啦. 下面是一些业务细节和代码说明.

## 账户创建

判断账户是否存在 -> bip39.generateMnemonic() 生成助记词 word -> bip39.mnemonicToSeed(word) 生成种子seed -> 

Array.from(root.derivePath("m/44'/60'/0'/0/0").privateKey).map(i => i.toString(16).padStart(2, "0")).join("") -> 生成私钥 privateKey

-> api.importRawKey(privateKey, password) 将私钥和密码发送给后端即可

账户必须要有见证人才能发送交易 至于为什么, 问双齐~

## 议案相关

议案是整个业务中最复杂的一块, 特别是议案详情页面. 创建议案的页面基本上把 data(abi)  弄懂怎么来的 就完全可以自己重写一个了

因为议案详情页涉及到审批和投票的权限问题还有UI的显示问题. 所以会比较复杂. 

审批阶段 只有 理事会成员 才能进行 同意/反对 操作

投票阶段 所有成员均可 进行 同意/反对 操作

开始进入详情页时, 是根据其议案状态来判断处于 审批阶段 还是 投票阶段 或者 定案阶段 , 但是其判断条件不单单是议案状态, 也涉及到议案的投票时间 过期时间等



















