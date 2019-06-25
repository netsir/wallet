import { app, ipcMain } from "electron";
import { createMainWindow, createInitWindow } from "../modules/window";
import initListener from "./listener";
import { closeCnts, openCnts } from "../cnts";
import Menu from "../modules/menu";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

export let mainWindow;
export let initWindow;

let initFlag = false;

// 开启ipcMain监听器
initListener();

function createWindow() {
  // 开启cnt
  openCnts();

  initWindow = createInitWindow();
  initWindow.on("close", () => !initFlag && app.quit());
  ipcMain.on("getLanguage", () => {
    initWindow.webContents.send("language", app.getLocale());
  });
  ipcMain.on("startApp", () => {
    initFlag = true;
    mainWindow = createMainWindow();
    mainWindow.on("close", () => app.quit());
  });
  ipcMain.on("smallTip", (event, data) => {
    mainWindow.webContents.send("smallTip", data);
  });

  Menu();
}
// const moreInstance = app.makeSingleInstance(() => {
//   if (mainWindow) {
//     // 判断主实例窗口是否最小化 如果是的话 恢复到之前的状态
//     if (mainWindow.isMaximized()) mainWindow.restore();
//     mainWindow.focus(); // 主实例窗口focus
//   } else if (initWindow) {
//     initWindow.focus();
//   }
// });
// // 判断是否存在主实例
// if (moreInstance) {
//   app.quit();
// }
app.on("ready", createWindow);

app.on("quit", () => {
  closeCnts();
  mainWindow = null;
  initWindow = null;
});

app.on("window-all-closed", () => {
  app.quit();
});
