import random from "lodash/random";
import { BigNumber } from "bignumber.js";

export function createRandomColor() {
  let colors = [
    "#aabac7",
    "#ce9d7c",
    "#c07367",
    "#786980",
    "#749da1",
    "#a25b63",
    "#333e5a"
  ];
  return colors[random(6)];
}

export function getTx(gas, gasPrice, amount, timeout = 60) {
  const web3 = new Web3();
  return {
    gas: web3.utils.toHex(gas),
    gasPrice: web3.utils.toHex(gasPrice),
    amount: web3.utils.toHex(amount),
    timeout: web3.utils.toHex(timeout * 60)
  };
}

export function isNumber(value) {
  return !Number.isNaN(Number(value));
}

export function toBigNumber(num) {
  return new BigNumber(num);
}

export function BigNumberEqualZero(num, val) {
  return new BigNumber(num).isEqualTo(new BigNumber(val));
}

export function toNtsBN(dot) {
  if (dot === undefined) return;
  return toBigNumber(dot).dividedBy(1e12);
}

export function toNtsStr(dot) {
  // if (dot === undefined) return
  // let str = toBigNumber(String(dot)).dividedBy(1e12).toString()
  //
  // if (str.indexOf("e") !== -1) {
  //   let splitResult = str.split("e")
  //   let [num, exp] = [splitResult[0].split(".").join(""), Math.abs(splitResult[1])]
  //   let s = "".padStart(exp, 0) + num
  //   return s.slice(0, 1) + "." + s.slice(1)
  // }
  // return str
  if (dot === undefined) return;
  return toNtsBN(dot).toFormat();
}

export function toDotBN(nts) {
  return toBigNumber(nts).multipliedBy(1e12);
}

export function toDotStr(nts) {
  return toDotBN(nts).toFormat(12);
}

export function error(message) {
  console.error(message);
}

export function formatTime(time, fmt) {
  let matchMap = {
    "M+": time.getMonth() + 1,
    "d+": time.getDate(),
    "h+": time.getHours(),
    "m+": time.getMinutes(),
    "s+": time.getSeconds()
  };
  if (/(y+)/i.test(fmt)) {
    let length = Math.min(RegExp.$1.length, 4);
    let year = time.getFullYear() + "";
    fmt = fmt.replace(RegExp.$1, year.substr(4 - length));
  }
  for (let k in matchMap) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      let match = matchMap[k] + "";
      let length = RegExp.$1.length;
      fmt = fmt.replace(
        RegExp.$1,
        length === 1 ? match : match.padStart(RegExp.$1.length, "0")
      );
    }
  }
  return fmt;
}

export function checkParameterOfContractMethodIsArray(type) {
  return type.indexOf("[]") !== -1;
}

export function addAddressPrefix(address) {
  if (address.indexOf("0x") === 0) {
    return address;
  } else {
    return "0x" + address;
  }
}

export function removeAddressPrefix(address) {
  if (address.indexOf("0x") === 0) {
    return address.slice(2);
  } else {
    return address;
  }
}
