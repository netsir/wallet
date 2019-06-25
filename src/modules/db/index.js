import nedb from "nedb";
import path from "path";
import Setting from "../setting";

function newDb(filename) {
  return new nedb({
    filename: path.join(Setting.dbPath, "/" + filename),
    autoload: true
  });
}

export let accountDB;
export let contractDB;
export let tokenCoinDB;

export function init() {
  accountDB = newDb("/account.db");
  contractDB = newDb("/contract.db");
  tokenCoinDB = newDb("/tokenCoin.db");
}
