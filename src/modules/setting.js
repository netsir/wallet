import { app, remote } from "electron";
import path from "path";

const __isDev__ = process.env.NODE_ENV === "development";
const NerthusDir = __isDev__ ? "data" : "../../data";

class Setting {

  static get userDataPath() {
    let _app = app || remote.app;
    return _app.getPath("userData");
  }

  static get appDataPath() {
    let _app = app || remote.app;
    return _app.getAppPath();
  }

  static get userHomePath() {
    let _app = app || remote.app;
    return _app.getPath("home");
  }

  static get ipcPath() {
    let platform = process.platform;

    const platform2Path = {
      darwin: "/Library/Nerthus/",
      win32: path.resolve("\\\\.\\pipe\\")
    };
    let $dataDir = platform2Path[platform] || "/.nerthus/";

    return platform === "win32"
      ? path.join($dataDir, `/${process.env.TARGET_MODE}.cnts.ipc`)
      : path.join(
          Setting.userHomePath,
          $dataDir,
          `/${process.env.TARGET_MODE}/cnts.ipc`
        );
  }

  static get dbPath() {
    let platform = process.platform;
    return platform === "win32"
      ? path.join(Setting.appDataPath, `${NerthusDir}/nedb`)
      : path.join(Setting.userHomePath, "/Library/Nerthus/nedb");
  }

  static get logFilePath() {
    let platform = process.platform;
    return platform === "win32"
      ? path.join(Setting.appDataPath, `${NerthusDir}/logs`)
      : path.join(Setting.userHomePath, "/Library/Nerthus/logs");
  }

  static get cntsCwd() {
    const src = __isDev__ ? __dirname : Setting.appDataPath;
    return path.resolve(src, __isDev__ ? "../../cnts" : "../../resources");
  }

  static get cntsStartCfg() {
    let platform = process.platform;
    let cfg;
    if (process.env.TARGET_MODE === "dev") {
      cfg = {
        dev: "",
        verbosity: 1,
        port: 6555,
        subport: 6556,
        pprof: "",
        pprofaddr: "0.0.0.0",
        pprofport: 6060
      };
    } else if (process.env.TARGET_MODE === "testnet") {
      cfg = {
        testnet: "",
        ['txpool.disableTxSetup']: true
        // 调试
        // verbosity: 4,
        // rpc: "",
        // rpcaddr: "0.0.0.0",
        // rpcapi: '"*"',
        // pprof: "",
        // pprofaddr: "0.0.0.0",
        // logdir: Setting.logFilePath,
      };
    }
    if (platform === "win32") {
      cfg = Object.assign(cfg, {
        datadir: path.join(Setting.appDataPath, NerthusDir)
      });
    }

    return Object.entries(cfg).reduce((arr, item) => {
      arr.push(`--${item[0]}`, item[1]);
      return arr;
    }, []);
  }
}

export default Setting;
