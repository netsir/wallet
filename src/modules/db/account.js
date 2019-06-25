import { accountDB } from "./index";

export function removeAll() {
  accountDB.remove({}, { multi: true }, function(err, numRemoved) {});
}

// 插入账户,如果已存在则不变
export function insert(address, name, color) {
  return new Promise((resolve, reject) => {
    accountDB.find({ _id: address }, (err, item) => {
      if (err) throw reject(err);
      if (item.length === 0) {
        let insertItem = { _id: address, name, color, time: Date.now() };
        accountDB.insert(insertItem, (err, newRow) => {
          resolve(newRow);
        });
      } else {
        // accountDB.update({ _id: address }, { $set: { name } });
        resolve(item);
      }
    });
  });
}

export function getAccount(queryObj) {
  return new Promise((resolve, reject) => {
    accountDB.find(queryObj, (err, item) => {
      if (err) reject(err);
      resolve(item);
    });
  });
}

export function getAccounts() {
  return new Promise((resolve, reject) => {
    accountDB.find({}, (err, items) => {
      if (err) reject(err);
      resolve(items);
    });
  });
}

export function update(address, name, color) {
  return new Promise((resolve, reject) => {
    accountDB.update({ _id: address }, { $set: { name, color } }, err => {
      if (err) reject(err);
      resolve();
    });
  });
}
