import net from "net";
import Setting from "../modules/setting";
import axios from "axios";
import { ipcRenderer } from "electron";
const lang = require("../renderer/lang/cn");
let httpPath = "http://192.168.1.109:8755";
const errorInfo = { "zh-CN": 0, en: 1, fr: 2 };
let i = 1;

function formatData(data) {
  i = errorInfo[window.localStorage.getItem("curLang")];
  if (data.error) {
    if (lang.errorInfo[data.error.message]) {
      return {
        code: data.error.code,
        result: lang.errorInfo[data.error.message][i]
      };
    }
    return { code: data.error.code, result: data.error.message };
  }
  return { code: 0, result: data.result };
}

let count = 1;

const defaultOptions = {
  jsonrpc: "2.0"
};

let socket;

let requestMap = {};

let buffers = [];
let size = 0;

function addDataListener() {
  socket.on("data", chunk => {
    buffers.push(chunk);
    size += chunk.length;
    let result = Buffer.concat(buffers, size)
      .toString()
      .split("\n");
    if (result[result.length - 1] !== "") return;
    for (let i = 0; i < result.length - 1; i++) {
      let parseResult = JSON.parse(result[i]);
      if (requestMap[parseResult.id]) {
        requestMap[parseResult.id](formatData(parseResult));
        delete requestMap[parseResult.id];
      }
    }
    resetCache();
  });
}

let hasInit = false;

export function initSocket() {
  return new Promise(resolve => {
    function _initSocket() {
      socket = net.connect(Setting.ipcPath);
      socket.on("error", () => {
        console.error("cnts初始化中...");
        if (hasInit) {
          ipcRenderer.send("closeApp");
        } else {
          _initSocket();
        }
      });
      socket.on("connect", () => {
        hasInit = true;
        addDataListener();
        resolve();
      });
    }

    _initSocket();
  });
}

function resetCache() {
  buffers = [];
  size = 0;
}

function ipcRequest(data) {
  return new Promise(resolve => {
    let id = count++;
    const writeData = {
      ...defaultOptions,
      id,
      method: data.method,
      params: data.params
    };
    socket.write(JSON.stringify(writeData));
    requestMap[id] = resolve;
  });
}

async function httpRequest(data) {
  let result = await axios.post(
    httpPath,
    Object.assign({}, defaultOptions, {
      id: count++,
      method: data.method,
      params: data.params
    })
  );
  return formatData(result.data);
}

export default ipcRequest;
