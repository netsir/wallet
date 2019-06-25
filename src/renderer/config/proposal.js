import { type as sysType } from "../const/system";
import {
  type as T
} from "../const/proposal";

export let type = {
  [T.config_change]: {
    sysType: sysType.SetConfigApply
  },
  [T.council_add]: {
    sysType: sysType.SetMemberJoinApply
  },
  [T.council_fire]: {
    sysType: sysType.SetMemberRemoveApply
  },
  [T.sys_witness_campaign]: {
    sysType: sysType.SetSystemWitness
  },
  [T.user_witness_campaign]: {
    sysType: sysType.SetUserWitness
  },
  [T.sys_witness_campaign_apply]: {
    sysType: sysType.SetSystemWitnessApply
  },
  [T.user_witness_campaign_apply]: {
    sysType: sysType.SetSystemWitnessApply
  },
  [T.SetSystemWitnessAddMargin]: {
    sysType: sysType.SetSystemWitnessAddMargin
  }
};
