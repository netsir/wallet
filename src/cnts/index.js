import fs from "fs-extra";
import { spawn } from "child_process";
import Setting from "../modules/setting";

const platform = process.platform;

let cnts_child;

// 创建日志目录, 提供给cnts使用
function makeLogDir() {
  try {
    fs.mkdirpSync(Setting.logFilePath);
  } catch (e) {}
}

export function openCnts() {
  makeLogDir();
  // 检查ipc文件是否存在.如果存在就不开启ipc了
  try {
    fs.statSync(Setting.ipcPath);
  } catch (e) {
    const cntsExtname = platform === "win32" ? ".exe" : "";

    cnts_child = spawn(`./cnts${cntsExtname}`, Setting.cntsStartCfg, {
      cwd: Setting.cntsCwd
    });

    // cnts_child.stdout.on("data", chunk => {
    //   dialog.showErrorBox("错误提示", chunk.toString())
    // })
    // cnts_child.stderr.on("data", chunk => {
    //   dialog.showErrorBox("错误提示", chunk.toString())
    // })
  }
}

export function closeCnts() {
  try {
    cnts_child.kill("SIGINT");
  } catch (e) {
    console.error(e);
  }
}
