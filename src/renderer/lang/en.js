module.exports = {
  //选择器部分映射
  status2TextMap: {
    underway: "In process",
    pass: "Success",
    failed: "Failed"
  },
  witnessStatus: {
    InBlackList: "BlackList",
    Normal: "Normal",
    LoggedOut: "Cancelled"
  },
  identity: {
    "2": "User Witness",
    "3": "System Witness",
    "4": "Councillor"
  },
  type2TextMap: {
    contract_run: "Execute Contract",
    transfer: "Transfer",
    contract_deploy: "Implement Contracts",
    proposal_council_apply: "Councillor Application Proposal",
    proposal_council_remove: "Councillor Cancellation Proposal",
    proposal_set_config: "Revision Of Consensus Configuration Proposal",
    proposal_sys_campaign: "System Witness Campaign Proposal",
    proposal_uc_campaign: "User Witness Campaign Proposal",
    proposal_council_vote: "Approval",
    proposal_public_vote: "Vote",
    proposal_campaign_join: "Join The Campaign",
    proposal_campaign_add_margin: "Additional Margin",
    proposal_finalize: "Proposal",
    witness_replace: "Replace The Witnesses",
    witness_cancel: "Cancellation Of Witnesses",
    settlement: "Withdrawals",
    witness_apply: "Apply For Witness"
  },
  type2TextMapMenu: {
    all: "All",
    contract_run: "Execute Contract",
    transfer: "Transfer",
    contract_deploy: "Implement Contracts",
    proposal_council_apply: "Councillor Application Proposal",
    proposal_council_remove: "Councillor Cancellation Proposal",
    proposal_set_config: "Revision Of Consensus Configuration Proposal",
    proposal_sys_campaign: "System Witness Campaign Proposal",
    proposal_uc_campaign: "User Witness Campaign Proposal",
    proposal_council_vote: "Approval",
    proposal_public_vote: "Vote",
    proposal_campaign_join: "Join The Campaign",
    proposal_campaign_add_margin: "Additional Margin",
    proposal_finalize: "Proposal",
    witness_replace: "Replace The Witnesses",
    witness_cancel: "Cancellation Of Witnesses",
    settlement: "Withdrawals",
    witness_apply: "Apply For Witness"
  },
  unitStatus2TextMap: {
    unstable: "Unstable",
    stabled: "Stabled"
  },
  executionResult: {
    true: "Fail",
    false: "Pass"
  },
  unitAction2TextMap: {
    transfer_payment: "Payment",
    transfer_receipt: "Receipt",
    contract_freeze: "Freeze",
    contract_deal: "Execute Contract",
    pow_tx_contract_deal: "Free Execution Of Contract",
    s_c_idle_contract_deal: "Execute Contract",
    sc_idle_contract_deal: "Execute Contract",
    contract_refund: "Refund",
    contract_receipt: "Receipt"
  },
  typeToTextMap: {
    all: "All",
    active: "Active",
    pass: "Pass",
    fail: "Fail"
  },
  resultToTextMap: {
    agree: "Agree",
    disagree: "Disagree",
    unknown: "Unknown"
  },
  recruit: {
    sys_witness_campaign: "Recruitment System Witness",
    user_witness_campaign: "Recruiting User Witnesses"
  },
  councilSysType: {
    config_change: "Change Consensus Configuration",
    council_fire: "Remove The Board Of Councillors",
    sys_witness_campaign: "Recruitment System Witness",
    user_witness_campaign: "Recruiting User Witnesses"
  },
  witnessSysType: {
    config_change: "Change Consensus Configuration",
    council_fire: "Dismiss Councillor"
  },
  commonSysType: {
    config_change: "Change Consensus Configuration",
    council_add: "Apply For Joining The Board Of Councillors",
    council_fire: "Dismiss Councillor"
  },
  consensusConfig: {
    ucWitnessCap: "Total Number Of Witnesses Of The Whole Network",
    minFreePoW: "The Difficult Of Pow For Free Transactions",
    ucGasLimit: "Unit Total Fuel Higher Limit",
    lowestGasPrice: "The Minimum Fuel Trading Price GasPrice",
    min_config_pvote_agree:
      "The Approval Voting Volume Minimum Requirements(NTS) for Changing Consensus Configuration",
    min_council_pvote_agree:
      "The Approval Voting Volume Minimum Requirements(NTS) for Councilors Join or Leave"
  },
  //账户
  account: {
    keystoreFromFile: "Import keystore content from a file",
    keystoreImport: "Import Keystore",
    keystoreIllegal: "The text of keystore is illegal",
    originalPsw: "original password",
    newPsw: "new password",
    originalPswTip: "Please enter your original password of the keystore",
    newPswTip: "Please enter a new password with a length of at least 6",
    helpOtherApplyWitness: "Helping others apply for witnesses",
    helpWitnessAddress: "Destination Address",
    mustAccountName: "Please input account name",
    sameName: "Account name can not be repeated.",
    accountUser: "Account ",
    userName: " Account",
    accountPreview: "Account Preview",
    accountDetail: "Account Details",
    newAccount: "Create a new account ",
    name: "Account Name",
    password: "Password",
    passwordConfirm: "Password Confirm",
    yes: "Yes",
    accountAssets: "Account Balance",
    nameChange: "Account name changed successfully",
    pwdDiffer: "The two password input is different. Please input again",
    pwdLength: "Password length is at least 6 bits",
    balanceInsufficient: "Sorry,insufficient fund",
    applySuccess: "Your application is success",
    witnessManage: "Witness Manage",
    score: "Ratings",
    witness: "Witness",
    curWitness: "Effective Witness Currently",
    witnessCancel: "Witness Cancel",
    witnessCost: "Witness Cost",
    workPow: "Work Pow",
    freeWorkPow: "Free Transaction",
    messageSent: "Message Sent",
    replace: "Replace ",
    apply: "Apply for ",
    witnessVote: "Witness Vote",
    systemChain: "System Chain",
    changeAccount: "Change account successfully",
    isLegalLengthAccount: "AccountName length is at most 15 bits",
    witnessChangeOnlyOnce:
      "Note:A witness can be changed free of charge every 4 hours.",
    witnessChangeDelay:
      "After 10 minutes, you can send applications or replace witnesses.",
    importAccountSuccess: "Import Account Successfully!",
    chainStatus: "Account Status",
    normal: "Normal",
    POWunderway: "Applying Witnesses...",
    witness_replace_underway: "Replacing Witnesses...",
    not_witness: "No witness",
    insufficient: "insufficient witness number",
    withdrawMoneyOperation:
      "Ordinary users can not carry out cash related operations.",
    withdrawMoney: "Withdrawals",
    withdrawDetail: "Details",
    canWithdrawMoney: "Withdrawalable Cash Amount",
    witnessFeeFreezed: "Freezing Amount",
    proposalTotalTitle: "Witness Statistics",
    toBeWitness: "Packaged Unit",
    notWitness: "Not Voting Unit",
    witnessed: "Voted Unit",
    lastBlockTimeStamp: "Last Unit Time",
    lastBlockHash: "The Last Unit",
    voteRate: "Voting Rate",
    cancelWitness: "Cancel",
    manageUser: "User Management",
    changeWitnessFail: "Failure to replace witnesses",
    applyWitnessFail: "Failure to apply witnesses",
    calPow:
      "In Pow computing, it's expected to take 20 minutes.Please don't shutdown the Nerthus Wallet.",
    calPow1: "The pow is computing...",
    applyingWitness: "Applying Witnesses...",
    changingWitness: "Replacing Witnesses...",
    current: "Currently,",
    noWitnessTips: "No Witness",
    toApply: "Go to apply",
    qrcodeWords: "Nerthus App can import account by scanning QR code",
    preReward: "Prereward for Work",
    canReward: "Work Rewards Available",
    costFeeFreezed: "Frozen Witness Fees",
    feeCost: "Withdrawalable Witness Fees",
    canTake: "Withdrawalable Cash Amount"
  },
  // 交易
  transaction: {
    isIntNumber: "The amount must be an integer.",
    validDate: "Transaction Validity Period",
    transfer: "Transfer",
    record: "Records",
    viewWitness: "Check Witness",
    transactionList: "Transaction List",
    recentTransactions: "Latest Transactions",
    transactionRecord: "Transactions",
    transactionTime: "Time",
    type: "Types",
    status: "Status",
    sum: "Amount(NTS)",
    accounts: "Accounts",
    operation: "Operation",
    hash: "Hash",
    transactionDetail: "Transaction Detail",
    transactionTransfer: "Transaction Transfer",
    validAddress: "Receipt Address",
    amountInput: "Please enter the transfer amount",
    description: "Describe the transaction info briefly",
    addressIllegal: "The address is illegal",
    addressIllegal2: "It can not be the current account address!",
    amountIllegal: "The amount of the input is illegal",
    floatIllegal: "After the decimal point up to 12 input",
    amountInsufficient: "The transfer balance is insufficient",
    transactionSent: "Transfer transactions have been sent",
    underway: "In Process",
    underway2: "In Process - Used {used} DOT (Remain {remain} DOT)",
    pass: " Success",
    failed: "Fail",
    unstable: "Unstable",
    stabled: "Stabled",
    gasLimit: "Gas Limit",
    gasPrice: "Gas Price",
    poundage: "Transaction Fees",
    transactionAmount: "Transaction Amount",
    randomNumber: "Random Number",
    transactionInput: "Transaction Input",
    transactionUnit: "Transaction Unit",
    unitHash: "Unit Hash",
    unitState: "Unit State",
    unitAction: "Unit Action",
    executionResult: "Result",
    reBroadcast:
      "In the execution of re broadcast transaction requests, please wait...",
    transferPayment: "Payment",
    transferReceipt: "Receipt",
    unitDetail: "Unit Details",
    unitTime: "Creation Time",
    unitHeight: "Unit Height",
    unitChainAddress: "Chain Address",
    systemHash: "System Chain Hash",
    parentHash: "Father Unit Hash",
    receiptHash: "Receipt Hash",
    resultHash: "Result Set Hash",
    transactionSetHash: "Transaction Set Hash",
    chainStateHash: "Chain Status Hash",
    gasUsed: "Gas Price",
    unitTransactionDetail: "Unit Transaction Details",
    TransactionStage: "Transaction Stage",
    preStepUnit: "Last Stage Unit",
    transactionHash: "Transaction Hash",
    executionOutput: "Execution Output",
    orderNumber: "Number",
    address: "Address",
    amount: "Amount",
    fundsFlow: "Funds Flow",
    transactionTips: "Transaction Tips",
    slow: "Slow",
    normal: "Normal",
    fast: "Quick",
    emergency: "Hurried",
    Urgent: "Urgent",
    transactionNeedGas: "Estimated Gas Price",
    gasLimitWill: "Maximum gas price willing to pay",
    totalGasPrices: "Total Gas Price",
    totalPrices: "Total Transaction Amounts",
    password: "Password",
    sure: "Yes",
    deposit: "Deposit",
    paramsText: "Params Text",
    payType: "Pay Type",
    gettingNeedGas: "Under Estimation",
    gasFailTip:
      "Failure to predict, continue the transaction may fail to execute and lose Commission.",
    isFloat: "Fuel input must be integer",
    errMsg: "Error Message",
    isLegalPwd: "The password can not be empty",
    totalAmount: "Total Amount"
  },
  // 风险提示
  riskTips: {
    delContract: "The contract will be deleted, will you continue?",
    tips: "Risk Warning",
    cancelUserWitness: "If user witnesses are cancelled",
    cancelSysWitness: "If the system witness is cancelled",
    cancelCouncil: "If a Councillor of the board is cancelled",
    cancelUserWitnessText1:
      "1.It will not be able to apply again, nor can it be applied to be a Councillor or system witness.",
    cancelSysWitnessText1:
      "1.It will not be able to apply again, nor can it be applied to be a Councillor or user witness.",
    cancelWitnessText2:
      "2.The amount frozen in the account will be deducted from the deposit paid at the time of application and the withdrawalable cash in the account.",
    cancelCouncilText1:
      "1.It will not be able to apply again, nor can it be applied as a witness or witness to the system.",
    cancelCouncilText2:
      "2.The amount frozen in the account will be deducted from the deposit paid at the time of application and the withdrawalable cash in the account.",
    iKnow: "I know",
    cancel: "Cancel",
    toCheckMnemonic: "Check Account Mnemonic Now",
    MnemonicNote:
      "Check the account mnemonic and sketch it in a safe place. Never save it on the Internet. Then try to move in and out of small assets and start using them.",
    jump: "Skip",
    checkMnemonic: "Look At Mnemonics",
    createMnemonic: "Generate Mnemonic Word",
    inputMnemonic: "Input Mnemonic Word",
    goToApplyWitness: "To Apply For The Witness",
    copyMnemonic: "Copy Account Mnemonics",
    copyMnemonicNote:
      "Mnemonic used to restore the wallet or purse to reset the password, it will be accurate in copy paper, and stored in a safe place only you know.",
    next: "Next",
    inputAccountMnemonic: "Input Account Mnemonic",
    pleaseOrder:
      "Please select the mnemonic words that appear in the previous interface and arrange them in the correct order.",
    applyWitness: "Apply For Witnesses Now",
    needWitness:
      "Accounts require witnesses to interact with other accounts / contracts.",
    notCorrectMnemonic: "Mnemonic input is not correct, please input again!",
    correctMnemonic: "Mnemonic check successful!",
    pwdLength: "Password length is at least 6 bits",
    repeatPwd: "Repeat password length is at least 6 bits",
    importMnemonics: "The mnemonic to recover your account",
    importAccount: "Import Mnemonics",
    spaceMnemonics: "Mnemonic words, according to the space separated",
    checkSpace:
      "The mnemonic format is incorrect. Please check the spaces and separators.",
    import: "Import"
  },
  // 合约
  contract: {
    new: "New",
    contractTo: "Contracts",
    contractName: "Contract Name",
    newContract: "Create a contract",
    myContract: "My Contract",
    watchContract: "Observe a contract",
    contractRun: "Contract Run",
    contractDeploy: "Contract Deploy",
    contractDeploying: "Just a moment, please. The contract is being deployed",
    importSuccess: "Successful import contracts",
    creator: "Creator",
    contractCode: "Contract Code",
    contractByteCode: "Contract ByteCodes",
    selectContract: "Select a contract",
    inputAmount: "Please enter the amount of transfer",
    NotSupported: "The contract deployment is not supported",
    constructorParametersInput:
      "Please enter the contract constructor parameter",
    constructorParametersError:
      "The contract constructor parameter is wrong, please try again",
    contractTransactionSent: "Deployment contract transaction has been sent",
    contractFreeze: "Freeze",
    contractDeal: "Execute Contract",
    contractRefund: "Refund",
    contractReceipt: "Receipt",
    contractAddress: "Contract Address",
    isLegalContractAddress:
      "It is illegal for you to enter the contract address. Please try again",
    isLegalContractName: "Please enter the contract name",
    isLegalJsonInterface: "The JSON Interface could not be parsed.",
    readContracts: "Read Contracts",
    curFuncName: "Please select the function to execute.",
    operator: "Operator",
    execute: "Execute",
    contractWitness: "Witness Of Contract",
    replaceWitness: "Replace Contract Witness",
    funcParamsWrong:
      "The contract structure parameters are wrong. Please verify.",
    sendTransaction:
      "The contract execution request has been sent. Please wait later.",
    alreadyExist: "The contract already exists.",
    readContract: "To read the contract"
  },
  //议案
  proposal: {
    proposalCreater: "Proposal Address",
    proposalHash: "Proposal Hash",
    isIntNumber: "Parameter input must be integer.",
    RecruitingSum: "Number Of Recruitment",
    atLeastMargin: "Minimum Margin",
    height: "Stop Height",
    curRank: "Current Rankings",
    margin: "Amount Of Input",
    proposalTotal: "Motion Statistics",
    joinTotal: "Approving",
    haveJoinTotal: "Approved",
    joinProposal: "Approval Motions",
    joinHaveJoinTotal: "Approved Motions",
    atLeast: "At least",
    isNormalAccount: "Only ordinary accounts can run for election.",
    depositAmount: "Guaranteed Amount",
    sendDeposit: "Sending Margin",
    notEnoughMargin: "Insufficient Margin Amount",
    heartbeat: "Heart beat",
    applyList: "Application List",
    addMargin: "Additional Margin",
    proposalTo: "Proposals",
    creator: "Creator",
    proposalType: "Proposal Type",
    newProposal: "Create a new proposal",
    needParamsInput: "Proposal In Parameter",
    proposalTypeIsCouncilAdd:
      "Only ordinary users can apply for joining the board of Councillors",
    sendTransaction: "The proposal has been submitted",
    proposalList: "Proposal List",
    config_change: "Change Consensus Configuration",
    sys_witness_campaign: "Campaign Witness",
    user_witness_campaign: "User Witness Campaign",
    council_add: "Apply For Joining The Board Of Councillors",
    council_fire: "Remove The Board Of Councillors",
    in_approval: "Approval",
    in_voting: "Voting",
    passed: "Approved",
    failed: "Reject",
    expired: "Outdated",
    pending_judge: "Wait For Judged",
    apply: "In the application",
    ucWitnessCap: "Total Number Of Witnesses Of The Whole Network",
    ucWitnesses: "The Number Of User Chain Witness",
    ucMinVotings: "The Minimum Number Of Votes In User Link Units",
    ucWitnessMargin: "User Witness Margin",
    scWitnesses: "Number Of Witness In The System Chain",
    scMinVotings: "The Minimum Number Of Votes In The System Chain Unit",
    scWitnessCap: "System chain sees the total number of witness + candidates",
    scWitnessMinMargin: "System chain sees the minimum margin of witness",
    councilCap: "Board Of Councillors Limit",
    councilMargin: "Lower Limit On Margin Of Council Councillors",
    lowestGasPrice: "The Minimum Fuel Trading Price GasPrice",
    minFreePoW: "The Difficult Of Pow For Free Transactions",
    billingPeriod: "Witness Cost Settlement Cycle",
    ucGasLimit: "Unit Total Fuel Higher Limit",
    proposalDetail: "Proposal Details",
    approval: "Approval",
    vote: "Vote",
    finalize: "Finalize",
    compete: "Compete",
    votingTime: "Register Time",
    weights: "Weights",
    result: "Result",
    member: "Councillor",
    optionSuccess: "send Successfully",
    proposalValue: "Please input the address of the proposer.",
    underwayProposal: "There are similar transactions in progress",
    canNotFireCouncil: "Non Councillors can not eliminate"
  },
  system: {
    tips: "Tips",
    InSynchronization: "Synchronizing",
    units: 'units',
    return: "Return",
    decode: "Decode",
    code: "Code",
    message: "Message",
    timeCheckInaccurate: "To detect your computer time and standard time is ",
    adviceUpdateTime: " seconds,it's recommended to update your computer time.",
    help_text: "(Help)",
    affectUseWallet: "Otherwise it may affect the use of the wallet.",
    minutes: "Minutes",
    from: "From",
    to: "To",
    all: "All",
    copy: "Copy",
    copySuccess: "Copy Success",
    time: "Time",
    expirationTime: "Expiration Time",
    note: "Notes",
    send: "Send",
    sendAgain: "Send Again",
    open: "Unfold",
    close: "Fold",
    moreOptions: " more options",
    enter: "Enter ",
    type: "Types",
    status: "Status",
    noData: "No data available",
    changeNodes: "Change Nodes",
    startApp: "Start Nerthus",
    chooseNodes: "Choose Nodes",
    startSynchronization: "Start Synchronization",
    initialization: "Initialization...",
    synchronizing: "Synchronizing, please wait a moment...",
    enterNodes: "Please enter the node that you want to synchronize.",
    pleaseChoose: "Please choose...",
    calculateMoney: "calculating..."
  },
  extended: {
    record: "Transaction",
    proposal: "Proposal"
  },
  token: {
    confirmDel: "Confirm to delete",
    delTOKEN: "Delete your TOKEN",
    addToken: "Add TOKEN",
    editToken: "Edit TOKEN",
    del: "Delete",
    delSuccess: "Delete successfully",
    address: "TOKEN CONTRACT ADDRESS",
    name: "TOKEN NAME",
    symbol: "TOKEN SYMBOL",
    decimals: "DECIMALS PLACES OF SMALLEST UNIT",
    preview: "PREVIEW",
    intLimit: "The input value must be an number",
    amountLimit: "Token is undercapitalized",
    addressLimit: "Illegal contract address",
    illegalDecimals: "The precision can not exceed the set of decimal places.",
    noName: "TOKEN Name cannot be empty",
    noUnit: "Token Units cannot be empty",
    intNum: "Token Decimal digits must be integers",
    bitsLess: "Token decimal digits cannot exceed 32 digits",
    changeSuccess: "Change Successfully",
    symbolLength: "Symbol length cannot exceed 10 bits"
  },
  // 错误信息类----来自后端
  errorInfo: {
    "could not decrypt key with given passphrase": [
      "密码输入错误",
      "Could not decrypt key with given passphrase",
      "N'a pas pu décrypter clé avec comme mot de passe",
      "密碼輸入錯誤"
    ],
    "chain missing witness": [
      "用户链缺少见证人",
      "Chain missing witness",
      "Chain témoin disparu",
      "用戶鏈缺少見證人"
    ],
    "oversized data": [
      "交易数据超过限制",
      "Transaction data exceed limits",
      "Les données de transaction dépasse la limite",
      "交易數據超過限制"
    ],
    "intrinsic gas too low": [
      "初始gas值太低",
      "Intrinsic gas too low",
      "Gaz intrinsèque trop faible",
      "初始gas值太低"
    ],
    "estimate gas failed": [
      "gas预估失败",
      "Estimate gas failed",
      "Le gaz n'a pas estimé",
      "gas預估失敗"
    ],
    "current config value with you setting value is same": [
      "当前配置参数值已存在",
      "Current config value with your setting value is same.",
      "La configuration actuelle de valeurs de paramètres existants.",
      "當前配置參數值已存在"
    ],
    "user witness ceiling must be a multiple of 11": [
      "用户见证上限必须是11的倍数",
      "User witness ceiling must be a multiple of 11",
      "Utilisateur témoin plafond doit être un multiple de 11",
      "用戶見證上限必須是11的倍數"
    ],
    "the caller have not coin": [
      "账户权重不足",
      "The caller have not coin",
      "Les comptes sont insuffisants",
      "賬戶權重不足"
    ],
    "there is already same proposal, can't create": [
      "有同类交易在进行中",
      "There already had the same proposal,can't be created.",
      "Il y a de transactions en cours",
      "有同類交易在進行中"
    ],
    "the Proposal to finalize": [
      "已经到达定案阶段",
      "the Proposal to finalize",
      "Il y a eu un vote",
      "已經到達定案階段"
    ],
    "evm: execution reverted": [
      "合约执行失败",
      "Failure of contract execution",
      "Le contrat a échoué",
      "合約執行失敗"
    ],
    "pow computing, can't again": [
      "Pow计算中,不能再次发送",
      "Pow Computing, cannot send again.",
      "On ne peut pas envoyer de nouveau dans le calcul.",
      "Pow計算中,不能再次發送"
    ],
    "account already exists": [
      "账户已存在",
      "account can't be contract account",
      "Le compte existe.",
      "賬戶已存在"
    ],
    "tx's sender or receiver does not have witness,then disable push tx": [
      "该交易发送方或者接收方无见证人，不允许发送交易。",
      "The sender or receiver of the transaction is not allowed to send the transaction without a witness.",
      "L'expéditeur ou le destinataire de la transaction n'a pas de témoin et n'est pas autorisé à envoyer des transactions.",
      "該交易發送方或者接收方無見證人，不允許發送交易。"
    ]
  }
};
