import { BrowserWindow } from "electron";
import { initWindow } from "../main";
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

const initURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080/init.html`
    : `file://${__dirname}/init.html`;

export function createMainWindow() {
  let mainWindow = new BrowserWindow({
    height: 768,
    useContentSize: true,
    width: 1190,
    show: false
  });
  mainWindow.on("ready-to-show", function() {
    mainWindow.show();
    mainWindow.focus();
    initWindow.close();
  });
  mainWindow.loadURL(winURL);
  return mainWindow;
}

export function createInitWindow() {
  let initWindow = new BrowserWindow({
    width: 440,
    height: 250,
    frame: false,
    resizable: false,
    show: false
  });
  initWindow.on("ready-to-show", function() {
    initWindow.show();
  });
  initWindow.loadURL(initURL);
  return initWindow;
}
