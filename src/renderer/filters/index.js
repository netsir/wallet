import { formatTime, toDotStr, toNtsStr, isNumber } from "../utils";

export default {
  ellipsis(text, start = 14, end = -6) {
    if (!text) return "";
    return text.slice(0, start) + "...";
  },
  toNts(dot) {
    if (!isNumber(dot)) return dot;
    return toNtsStr(dot);
  },
  toDot(nts) {
    return toDotStr(nts);
  },
  formatTime(timestamp, fmt = "yyyy-MM-dd hh:mm:ss") {
    if (timestamp === 0) return "-";
    let date = new Date(timestamp * 1000);
    return formatTime(date, fmt);
  },
  lowerCaser(address) {
    if (!address) return;
    return address.toLowerCase();
  }
};
