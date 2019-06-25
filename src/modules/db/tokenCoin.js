import { tokenCoinDB } from "./index";

export function removeAll() {
  tokenCoinDB.remove({}, { multi: true }, function(err, numRemoved) {});
}

export function TokenInsert(data) {
  return new Promise((resolve, reject) => {
    /*
      item:
        name 代币名字
        address 代币地址
        symbol 代币符号
        decimals 小数位
        total 代币发行总量
        time: Date.now()
      }
     */
    const defaultData = {
      time: Date.now(),
      address: "",
      name: "",
      symbol: "",
      decimals: ""
    };
    const item = Object.assign({}, defaultData, data);

    tokenCoinDB.insert(item, (err, newRow) => {
      if (err) reject(err);
      resolve(newRow);
    });
  });
}

export function removeToken(id) {
  // 删除单项
  return new Promise((resolve, reject) => {
    tokenCoinDB.remove({ _id: id }, (err, ret) => {});
  });
}
export function TokenUpdate(id, address, name, symbol, decimals) {
  return new Promise((resolve, reject) => {
    tokenCoinDB.update(
      { _id: id },
      { $set: { address, name, symbol, decimals } },
      err => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

export function getTokenCoins() {
  return new Promise((resolve, reject) => {
    tokenCoinDB.find({}, (err, items) => {
      if (err) reject(err);
      resolve(items);
    });
  });
}

export function getTokenCoin(queryObj) {
  return new Promise((resolve, reject) => {
    tokenCoinDB.find(queryObj, (err, item) => {
      if (err) reject(err);
      resolve(item[0]);
    });
  });
}
