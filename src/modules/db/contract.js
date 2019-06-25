import { contractDB } from "./index";

export function removeAll() {
  contractDB.remove({}, { multi: true }, function(err, numRemoved) {});
}

export function remove(id) {
  return new Promise((resolve, reject) => {
    contractDB.remove({ _id: id }, err => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function insert(data) {
  return new Promise((resolve, reject) => {
    /*
      item:
        name 合约名字
        solidityCode 合约代码
        jsonInterface
        type 合约类型 1: 自己部署的合约.开始暂无合约地址,部署成功后才会存 2: 观察的合约.无交易哈希,直接存的是合约地址
        txHash 交易哈希
        contractAddress 合约地址
        time: Date.now()
      }
     */
    const defaultData = {
      time: Date.now(),
      contractAddress: "",
      solidityCode: "",
      txHash: ""
    };
    const item = { ...defaultData, ...data };

    contractDB.insert(item, (err, newRow) => {
      if (err) reject(err);
      resolve(newRow);
    });
  });
}

export function update(id, contractAddress) {
  return new Promise((resolve, reject) => {
    contractDB.update({ _id: id }, { $set: { contractAddress } }, err => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function getContracts() {
  return new Promise((resolve, reject) => {
    contractDB.find({}, (err, items) => {
      if (err) reject(err);
      resolve(items);
    });
  });
}

export function getContract(queryObj) {
  return new Promise((resolve, reject) => {
    contractDB.find(queryObj, (err, item) => {
      if (err) reject(err);
      resolve(item[0]);
    });
  });
}
