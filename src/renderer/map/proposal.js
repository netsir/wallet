import { type } from "../config/proposal";

import mapValues from "lodash/mapValues";

export const typeToSysTypeMap = mapValues(type, "sysType");
