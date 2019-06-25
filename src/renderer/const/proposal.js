export const type = {
  config_change: "config_change",
  council_add: "council_add",
  council_fire: "council_fire",
  sys_witness_campaign: "sys_witness_campaign",
  user_witness_campaign: "user_witness_campaign",
  sys_witness_campaign_apply: "sys_witness_campaign_apply",
  user_witness_campaign_apply: "user_witness_campaign_apply"
  // SetSystemWitnessAddMargin: "SetSystemWitnessAddMargin"
};

export const status = {
  in_approval: "in_approval",
  in_voting: "in_voting",
  passed: "passed",
  failed: "failed",
  expired: "expired",
  pending_judge: "pending_judge",
  apply: "apply"
};

export const consensusConfig = {
  ucMinVotings: "ucMinVotings",
  ucWitnessCap: "ucWitnessCap",
  ucWitnessMargin: "ucWitnessMargin",
  scWitnesses: "scWitnesses",
  scMinVotings: "scMinVotings",
  scWitnessCap: "scWitnessCap",
  scWitnessMinMargin: "scWitnessMinMargin",
  councilCap: "councilCap",
  councilMargin: "councilMargin",
  lowestGasPrice: "lowestGasPrice",
  minFreePoW: "minFreePoW",
  billingPeriod: "billingPeriod",
  ucWitness: "ucWitness",
  ucGasLimit: "ucGasLimit",
  min_config_pvote_agree: "min_config_pvote_agree",
  min_council_pvote_agree: "min_council_pvote_agree"
};
