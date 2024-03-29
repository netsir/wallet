module.exports = {
  //选择器部分映射
  status2TextMap: {
    underway: "En Cours",
    pass: "Succès",
    failed: "Échec"
  },
  witnessStatus: {
    InBlackList: "Liste Noire",
    Normal: "Normal",
    LoggedOut: "Annulé"
  },
  identity: {
    "2": "Témoin d'utilisateur",
    "3": "Témoin du système",
    "4": "Membre du conseil"
  },
  type2TextMap: {
    contract_run: "Exécuter des contrats",
    transfer: "Transfert",
    contract_deploy: "Déployer des Contrats",
    proposal_council_apply: "Proposition d'application de membre du conseil",
    proposal_council_remove: "Proposition d'annulation de membre du conseil",
    proposal_set_config:
      "Proposition de la modification de la configuration consensus",
    proposal_sys_campaign: "Proposition de campagne du témoin de System",
    proposal_uc_campaign: "Proposition de campagne du témoin d'utilisateur",
    proposal_council_vote: "Approuver",
    proposal_public_vote: "Voter",
    proposal_campaign_join: "Participer à la campagne",
    proposal_campaign_add_margin: "Marge additionnelle ",
    proposal_finalize: "La Proposition Finale",
    witness_replace: "Remplacement des témoins",
    witness_cancel: "L'annulation de Témoins",
    settlement: "Retraits",
    witness_apply: "Demande de témoin"
  },
  type2TextMapMenu: {
    all: "Tout",
    contract_run: "Exécuter des contrats",
    transfer: "Transfert",
    contract_deploy: "Déployer des Contrats",
    proposal_council_apply: "Proposition d'application de membre du conseil",
    proposal_council_remove: "Proposition d'annulation de membre du conseil",
    proposal_set_config:
      "Proposition de la modification de la configuration consensus",
    proposal_sys_campaign: "Proposition de campagne du témoin de System",
    proposal_uc_campaign: "Proposition de campagne du témoin d'utilisateur",
    proposal_council_vote: "Approuver",
    proposal_public_vote: "Voter",
    proposal_campaign_join: "Participer à la campagne",
    proposal_campaign_add_margin: "Marge additionnelle ",
    proposal_finalize: "La Proposition Finale",
    witness_replace: "Remplacement des témoins",
    witness_cancel: "L'annulation de Témoins",
    settlement: "Retraits",
    witness_apply: "Demande de témoin"
  },
  unitStatus2TextMap: {
    unstable: "Instable",
    stabled: "Stable"
  },
  executionResult: {
    true: "échec",
    false: "Succès"
  },
  unitAction2TextMap: {
    transfer_payment: "Paiement",
    transfer_receipt: "Créances",
    contract_freeze: "bloquer",
    contract_deal: "Exécuter Des Contrats",
    pow_tx_contract_deal: "Exécution gratuite des contrats",
    s_c_idle_contract_deal: "Exécuter des Contrats",
    sc_idle_contract_deal: "Exécuter des Contrats",
    contract_refund: "Retour",
    contract_receipt: "Créances"
  },
  typeToTextMap: {
    all: "Tout",
    active: "En Cours",
    pass: "Succès",
    fail: "Échec"
  },
  resultToTextMap: {
    agree: "Approuver",
    disagree: "Désapprouver",
    unknown: "Ignoré"
  },
  recruit: {
    sys_witness_campaign: "Système du recrutement de témoin",
    user_witness_campaign: "Témoin du Recrutement de L'utilisateur"
  },
  councilSysType: {
    config_change: "Modifier La Configuration Du Consensus",
    council_fire: "Exclure des membres du conseil",
    sys_witness_campaign: "Recruter le témoin du système",
    user_witness_campaign: "Recruter le témoin de l'utilisateur"
  },
  witnessSysType: {
    config_change: "Modifier La Configuration Du Consensus"
  },

  commonSysType: {
    config_change: "Modifier La Configuration Du Consensus",
    council_add: "Demander à rejoindre le conseil"
  },
  consensusConfig: {
    ucWitnessCap:
      "La limite du nombre total des témoins d'utilisateurs du réseau",
    minFreePoW: "La Transaction gratuite sur la difficulté de PoW",
    ucGasLimit: "Le plafond du carburant totale par unit",
    lowestGasPrice: "Le prix minimum du carburant de transaction GasPrice"
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
    helpOtherApplyWitness: "Aidez les autres à demander des témoins.",
    helpWitnessAddress: "L'Adresse d'utilisateur aidée.",
    mustAccountName: "S'il vous plaît entrer un nom de compte",
    sameName: "Le nom du compte ne peut pas être répété",
    accountUser: "Compte ",
    userName: " Compte",
    accountPreview: "Aperçu Du Compte",
    accountDetail: "Les Details Du Compte",
    newAccount: "Ouvrir Un Nouveau Compte ",
    name: "Le Nom du Compte",
    password: "Le Code Secret",
    passwordConfirm: "Confirmer le mot de passe",
    yes: "Confirmer",
    accountAssets: "L'actifs du Compte",
    nameChange: "Le nom du compte a été modifié avec succès",
    pwdDiffer:
      "Le mot de passe entré deux fois est différent, veuillez le saisir à nouveau",
    pwdLength: "La longueur du mot de passe est d'au moins 6 chiffres",
    balanceInsufficient: "Solde insuffisant",
    applySuccess: "Application réussie",
    witnessManage: "La gestion des Témoins",
    score: "Évaluations",
    witness: "Témoin",
    curWitness: "Témoin valide actuel",
    witnessCancel: "Témoin invalide",
    witnessCost: "Payer les frais de témoin",
    workPow: "La De PoW",
    freeWorkPow: "Transaction gratuite",
    messageSent: "La demande a été envoyée",
    replace: "Changer ",
    apply: "Demander ",
    witnessVote: "Le témoin vote",
    systemChain: "La Chaîne du système",
    changeAccount: "Changer de compte avec succès",
    isLegalLengthAccount: "Le nom du compte ne peut pas dépasser 15 chiffres",
    witnessChangeOnlyOnce:
      "Remarque: les témoins peuvent être changés gratuitement toutes les 4 heures",
    witnessChangeDelay:
      "Après 10 minutes, vous pouvez envoyer des demandes ou remplacer des témoins",
    importAccountSuccess: "Importer le compte avec succès!",
    chainStatus: "État du compte",
    normal: "Normal",
    POWunderway: "Le témoin dans la demande...",
    witness_replace_underway: "Remplacer les témoins...",
    not_witness: "Sans Témoin",
    insufficient: "Le témoin est insuffisant",
    withdrawMoneyOperation:
      "Les utilisateurs ordinaires ne peuvent pas effectuer d'opérations liées aux retraits d'espèces",
    withdrawMoney: "Retraits",
    withdrawDetail: "Détails",
    canWithdrawMoney: "Montant du retrait en espèces",
    witnessFeeFreezed: "Montant qui a été gelé",
    proposalTotalTitle: "Statistiques des témoins",
    toBeWitness: "Unité emballée",
    notWitness: "Unité non votée",
    witnessed: "Unité votée",
    lastBlockTimeStamp: "Dernière unité de temps",
    lastBlockHash: "La dernière unité",
    voteRate: "Taux de vote",
    cancelWitness: "Annuler",
    manageUser: "Gestion des utilisateurs",
    changeWitnessFail: "Défaut de remplacer les témoins",
    applyWitnessFail: "Défaut de remplacer les témoins",
    calPow:
      "POW dans le calcul, besoin de 20 minutes que je vous prie de ne pas fermer le portefeuille",
    applyingWitness: "Le témoin dans la demande...",
    changingWitness: "Remplacer les témoins...",
    current: "Le courant ",
    noWitnessTips:
      " Il n'y a pas de témoins, la transaction ne peut être effectué",
    toApply: "Demander",
    qrcodeWords:
      "Nerthus App de balayage d'un Code bidimensionnel peut importer des comptes",
    preReward: "Primes d 'embauche",
    canReward: "Job bonus",
    costFeeFreezed: "Les frais d 'enregistrement des témoins ont été gelés",
    feeCost: "Les frais de déposition peuvent être déduits",
    canTake: "Montant du retrait en espèces"
  },
  // 交易/转账
  transaction: {
    isIntNumber: "Le montant doit être un entier",
    validDate: "La période de validité de la transaction",
    transfer: "Transfert",
    record: "Des enregistrements",
    viewWitness: "Vérifier les témoins actuels",
    transactionList: "Liste des transactions",
    recentTransactions: "Les transactions récentes",
    transactionRecord: " Les Enregistrements Des Transactions",
    transactionTime: "Temps De Transaction",
    type: "Types",
    status: "Statut",
    sum: "Montant(NTS)",
    accounts: "Compte",
    operation: "Opérer",
    hash: "Hash",
    transactionDetail: "Les détails de la transaction",
    transactionTransfer: "Transfert de transaction",
    validAddress: " Adresse effective du destinataire",
    amountInput: "S'il vous plaît entrer le montant à transférer",
    description: "Décrivez brièvement les informations de cette transaction",
    addressIllegal: "L'adresse entrée est illégale",
    addressIllegal2: "L'adresse ne peut pas être un compte courant.",
    amountIllegal: "Le montant entré est illégale",
    floatIllegal: "Entrez jusqu'à 12 chiffres après le point décimal",
    amountInsufficient: "Solde insuffisant",
    transactionSent: "La transaction de transfert a été envoyée",
    underway: "En Cours",
    underway2: "En Cours - D'occasion {used} DOT (Restant {remain} DOT)",
    pass: " Succès",
    failed: "échec",
    unstable: "Instable",
    stabled: "Stable",
    gasLimit: "La limite de gaz",
    gasPrice: " Le prix du gaz",
    poundage: "Les frais de transaction",
    transactionAmount: "Montant de la transaction",
    randomNumber: "Le Nombre Aléatoire",
    transactionInput: "Entrée De Transaction",
    transactionUnit: "L’unité De Transaction",
    unitHash: "Unité Hash",
    unitState: "Statut de l'unité",
    unitAction: "Action",
    executionResult: "Le résultat De L'exécution",
    reBroadcast:
      "Dans l'exécution de la demande de transaction de rediffusion, s'il vous plaît patienter ...",
    transferPayment: "Paiement",
    transferReceipt: "Réception",
    unitDetail: "Les détails de l'unité",
    unitTime: "Le Temps De Création",
    unitHeight: " L'hauteur d'unité",
    unitChainAddress: " L’adresse De La Chaîne",
    systemHash: "Hach De La Chaîne Système",
    parentHash: "Hash De L'unité De Père",
    receiptHash: "Hash De Reçu",
    resultHash: "Hash De Résultat",
    transactionSetHash: "Hash De Transaction",
    chainStateHash: "Hach Du Statut De La Chaîne",
    gasUsed: "Les Frais De Gaz",
    unitTransactionDetail: "Les Details De Transaction De L’unité",
    TransactionStage: "L’Étape de la transaction",
    preStepUnit: "L'unité à la dernière étape",
    transactionHash: "Hash De Transaction",
    executionOutput: "La Sortie d'exécution",
    orderNumber: "Numéro De Série",
    address: "L’adresse",
    amount: "Les montants",
    fundsFlow: "Flux de fonds",
    transactionTips: "Conseils De Trading",
    slow: "Lent",
    normal: "Normal",
    fast: "Rapide",
    emergency: "Urgent",
    Urgent: "Accéléré",
    transactionNeedGas: "Le Carburant Estimé",
    gasLimitWill: "le montant maximum du carburant prêt à payer",
    totalGasPrices: "Le prix total du carburant",
    totalPrices: "Le montant total de la transaction",
    password: "Le mot de passe de transaction",
    sure: "Yes",
    deposit: "Dépôt de garantie",
    paramsText: "Params Text",
    payType: "La Mode De Paiement",
    gettingNeedGas: "En train de prévision",
    gasFailTip:
      "L'échec d'estimation, la poursuite de cette transaction peut échouer et perdre les frais de traitement",
    isFloat: "La valeur d'entrée de carburant doit être un nombre entier",
    errMsg: "Message d'erreur",
    isLegalPwd: "Le mot de passe ne peut pas être vide",
    totalAmount: "Le Montant Total"
  },
  // 风险提示
  riskTips: {
    delContract: "Cette action supprimera le contrat, allez-vous continuer?",
    tips: "Avertissement de risque",
    cancelUserWitness: "Si les témoins des utilisateurs sont annulés",
    cancelSysWitness: "Si les témoins du système sont annulés",
    cancelCouncil: "Si les les membres du conseil sont annulés",
    cancelUserWitnessText1:
      "1.Il n 'est pas possible de demander de nouveau, ni de demander de devenir membre ou témoin du système.",
    cancelSysWitnessText1:
      "1.Il n 'est pas possible de demander de nouveau, ni de demander de devenir membre ou témoin de l' utilisateur.",
    cancelWitnessText2:
      "2.il va rembourser la marge qui a été payé et le montant d'argent disponible sur le compte, mais le montant gelé sur le compte sera déduit",
    cancelCouncilText1:
      "1.Il n 'est pas possible de demander une nouvelle demande, ni d' être témoin d 'un témoin ou d' un témoin systémique.",
    cancelCouncilText2:
      "2.il va rembourser la marge qui a été payé et le montant d'argent disponible sur le compte, mais le montant gelé sur le compte sera déduit",
    iKnow: "Je Sais.",
    cancel: "Annuler",
    toCheckMnemonic: "De visualiser immédiatement compte mnémonique de mot",
    MnemonicNote:
      "Les mots d 'aide du compte et l' endroit où ils sont en sécurité, ne sont pas conservés sur le réseau.Et puis essayez de le transférer.",
    jump: "Sauter",
    checkMnemonic: "Voir Mnémonique De Mot",
    createMnemonic: "Génération De mots D'aide",
    inputMnemonic: "Le Mot D'entrée Mnémonique",
    goToApplyWitness: "Demander Un Témoin",
    copyMnemonic: "Copie Des Domptes Mnémonique De Mot",
    copyMnemonicNote:
      "Les mots d 'aide sont utilisés pour récupérer le portefeuille ou pour remplacer le mot de passe de porte - monnaie, avec copie exacte du papier et stockées dans un endroit où vous êtes en sécurité.",
    next: "Prochaine étape",
    inputAccountMnemonic: "Compte De Mots D'entrée Mnémonique",
    pleaseOrder:
      "Veuillez sélectionner les mots d 'aide qui apparaissent dans l' interface précédente et dans l 'ordre dans l' ordre.",
    applyWitness: "Demande Immédiate De Témoins",
    needWitness:
      "Le compte a besoin d'un témoin qui peut interagir avec d'autres comptes / contrats",
    notCorrectMnemonic:
      "Mémoire de mots d'entrée n'est pas correcte, veuillez entrer!",
    correctMnemonic: "Mnémotechnique mot de vérification réussie!",
    pwdLength: "Nouveau mot de passe, au moins six caractères",
    repeatPwd: "Répétez le mot de passe, au moins six caractères.",
    importMnemonics: "Réhabiliter votre compte",
    importAccount: "Importer Mot Mnémonique",
    spaceMnemonics: "Mémoire de mots, selon des espaces séparés",
    checkSpace:
      "Mnémotechnique mot n'a pas le bon format, veuillez les vérifier et de séparation.",
    import: "L'importation de"
  },
  // 合约
  contract: {
    new: "Créer",
    contractTo: "Contrat",
    contractName: "Nom du contrat",
    newContract: "Créer Un Nouveau Contrat",
    myContract: "Mon Contrat",
    watchContract: "Observer Un Contrat",
    contractRun: "Exécuter Des Contrats",
    contractDeploy: "Déployer Des Contrats",
    contractDeploying:
      "Veuillez patienter, le contrat est en cours de déploiement",
    importSuccess: "Le succès de l'introduction de contrats",
    creator: "Créateur",
    contractCode: "Le Code du contrat",
    contractByteCode: "Contrat bytecode",
    selectContract: "Sélectionner Un Contrat",
    inputAmount: "S'il vous plaît entrer le montant du transfert",
    NotSupported: "Le déploiement du contrat ne prend pas en charge",
    constructorParametersInput:
      "Veuillez saisir les paramètres de construction du contrat",
    constructorParametersError:
      "Les paramètres de construction du contrat sont incorrects, veuillez vérifier",
    contractTransactionSent:
      "La transaction du contrat de déploiement a été envoyée",
    contractFreeze: "Geler",
    contractDeal: "Exécuter Des Contrats",
    contractRefund: "Retorner",
    contractReceipt: "Réception",
    contractAddress: " L’adresse De Contrat",
    isLegalContractAddress:
      "Votre adresse de contrat est illégale, veuillez ré-entrer",
    isLegalContractName: "S'il vous plaît entrer le nom du contrat",
    isLegalJsonInterface: "Impossible d'analyser l'interface JSON",
    readContracts: "Lire Les Contrats",
    curFuncName: "Veuillez sélectionner la fonction à exécuter",
    operator: "Opérateur",
    execute: "Exécuter",
    contractWitness: "Le témoin du contract",
    replaceWitness: "Remplacement des témoins",
    funcParamsWrong:
      "Les paramètres de construction du contrat sont incorrects, veuillez vérifier",
    sendTransaction:
      "La demande d'exécution du contrat a été envoyée, veuillez patienter",
    alreadyExist: "Le contrat existe.",
    readContract: "Contrat de lecture"
  },
  //议案
  proposal: {
    proposalCreater: "L’adresse de la proposition",
    // todo
    proposalHash: "Proposal Hash",
    isIntNumber: "La valeur d'entrée du paramètre doit être un entier",
    RecruitingSum: "Nombre de recrutement",
    atLeastMargin: "La Marge Minimale",
    height: "Hauteur d'arrêt",
    curRank: "Actuellement Classé",
    margin: "Le Montant De Référence",
    proposalTotal: "Statistiques des propositions",
    joinTotal: "Approuver",
    haveJoinTotal: "Approuvé",
    joinProposal: "Les motions d'approbation",
    joinHaveJoinTotal: "Les motions approuvée",
    applyList: "Liste des applications",
    atLeast: "Au moins",
    isNormalAccount: "Seuls les comptes ordinaires peuvent se porter candidats",
    depositAmount: "Montant De Garantie",
    sendDeposit: "Envoyer le marge",
    addMargin: "Appel De Marge",
    notEnoughMargin: "Montant de marge insuffisant",
    heartbeat: "Battement de Cœur",
    proposalTo: "Propositions",
    creator: "Créateur",
    proposalType: "Le Type De Proposition",
    newProposal: "Créer Une Nouvelle Proposition",
    needParamsInput: "Proposition En Paramètre",
    proposalTypeIsCouncilAdd:
      "Seuls les utilisateurs ordinaires peuvent demander à devenir un conseil",
    sendTransaction: "La demande de la proposition a été soumise",
    proposalList: "La Liste De Propositions",
    config_change: "Modifier La Configuration Du Consensus",
    sys_witness_campaign: "La campagne de témoins du système",
    user_witness_campaign: "La campagne de témoins d'utilisateur",
    council_add: "Demande à Rejoindre Le Conseil",
    council_fire: "Supprimer le membre du Conseil",
    in_approval: "Dans L'attente De L'approbation",
    in_voting: "Vote",
    passed: "Réussir à Passer",
    failed: "échouer à Passer",
    expired: "Dépassé",
    pending_judge: "à Déterminer",
    apply: "Application",
    ucWitnessCap:
      "Le nombre maximum des témoins d'utilisateur de l'ensemble du réseau",
    ucWitnesses: "Le nombre de témoin de la chaîne système",
    ucMinVotings: "Le nombre minimum de vote d'unité de la chaîne système",
    ucWitnessMargin: "Témoin De La Marge De L'utilisateur",
    scWitnesses: "Système De Chaîne, Le Nombre De Témoins",
    scMinVotings: "Système De Chaîne D'unités Le Nombre Minimum De Votes",
    scWitnessCap:
      "Les témoins de la chaîne système + nombre total de candidats",
    scWitnessMinMargin: "la marge minimale des témoins de la chaîne du système",
    min_config_pvote_agree:
      "Minimum requis du volume de vote affirmatif (NTS) pour la proposition de changement de paramètre.",
    min_council_pvote_agree:
      "Minimum requis du volume de vote affirmatif (NTS) pour les conseillers rejoindre ou quitter.",
    councilCap: "Le plafond des membres du Conseil",
    councilMargin: "La limite de marge des membres du conseil",
    lowestGasPrice: "Le prix minimum du carburant de transaction GasPrice",
    minFreePoW: "La Transaction gratuite sur la difficulté de PoW",
    billingPeriod: "La période de payement des frais de témoin",
    ucGasLimit: "Le plafond du carburant totale par unité",
    proposalDetail: "Les Details De Propositions",
    approval: "Approuver",
    vote: "Voter",
    finalize: "Finalisé",
    compete: "Campagne",
    votingTime: "Le Temps D'enregistrement",
    weights: "Poids",
    result: "Résultat",
    member: "Administrateurs",
    optionSuccess: "Envoyer avec success ",
    proposalValue: "S'il vous plaît entrer l'adresse de la proposition",
    underwayProposal: "Des transactions similaires sont en cours",
    canNotFireCouncil:
      "Ne peut être annuler des membres qui n'est pas le membre du conseil"
  },
  system: {
    tips: "Tips",
    InSynchronization: "De synchronisation",
    units: 'des unités',
    return: "retourner",
    decode: "décoder",
    code: "Le Code",
    message: "Information",
    timeCheckInaccurate:
      "Détecté la différence entre l'heure de votre ordinateur et l'heure standard",
    adviceUpdateTime:
      "Secondes, Recommander pour mettre à jour le temps de l'ordinateur",
    help_text: "Aide",
    affectUseWallet: "Sinon, cela pourrait affecter le portefeuille",
    minutes: "Minutes",
    from: "De",
    to: "à",
    all: "Tout",
    copy: "Copier",
    copySuccess: "Copier avec success",
    time: "Le temps",
    expirationTime: "Le Temps D'expiration",
    note: "Remarques",
    send: "Envoyer",
    sendAgain: "Transmis De Nouveau",
    open: "Déplier",
    close: "Plier",
    moreOptions: "plus d’option",
    enter: "Entrer ",
    type: "Type",
    status: "Statut",
    noData: "Pas De Données Disponibles",
    changeNodes: "Nœuds initial",
    startApp: "Commencer Nerthus",
    chooseNodes: "Choisir les nœuds",
    startSynchronization: "Lancer la synchronization",
    initialization: "Initialisation...",
    synchronizing: "Le nœud est en cours de synchronisation...",
    enterNodes: "Veuillez entrer pour synchronisation de noeuds",
    pleaseChoose: "s’il vous plait choisir...",
    calculateMoney: "En cours de calcul..."
  },
  extended: {
    record: "Transfert",
    proposal: "Proposition"
  },
  token: {
    confirmDel: "Confirmation de suppression",
    delTOKEN: "Supprimer TOKEN",
    addToken: "Ajouter TOKEN",
    editToken: "Édition TOKEN",
    del: "Supprimer",
    delSuccess: "Suppression réussie",
    address: "TOKEN Adresse du contrat",
    name: "TOKEN Nom de",
    symbol: "TOKEN Symbole unitaire",
    decimals: "Petit groupe",
    preview: "Aperçu",
    intLimit: "La valeur entrée doit être un nombre.",
    amountLimit: "Les actifs ne sont pas suffisants.",
    addressLimit: "L'adresse du contrat n'est pas légale.",
    noName: "Token Le nom de Tok ne peut pas être vide.",
    illegalDecimals: "La précision n 'est pas supérieure à la numérisation.",
    noUnit: "Token L'unité de Tok ne peut pas être vide.",
    intNum: "Token Cest un nombre entier.",
    bitsLess: "On ne peut pas dépasser 32.",
    changeSuccess: "le changement avec succès",
    symbolLength: "la longueur du symbole ne peut pas dépasser 10"
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
