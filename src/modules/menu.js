import { app, dialog, Menu, shell, ipcMain } from "electron";
import path from "path";
import { initWindow, mainWindow } from "../main/index";
import packageJson from "../../package.json";
const nativeImage = require("electron").nativeImage;
let image = nativeImage.createFromDataURL(
  "data:image/png;base64,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"
);

export default (i = 1) => {
  let currentWindow = mainWindow || initWindow;
  const lang = require("../renderer/lang/cn");
  let template = [
    {
      label: lang.menuTpl.application[i],
      submenu: [
        {
          label: lang.menuTpl.applicationAbout[i],
          click: function() {
            dialog.showMessageBox({
              title: lang.menuTpl.applicationAbout[i],
              message: lang.menuTpl.versionInfo[i] + ": " + packageJson.version,
              icon: image,
              buttons: ["yes"]
            });
          }
        },
        {
          label: lang.menuTpl.quit[i],
          accelerator: "Command+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: lang.menuTpl.edit[i],
      submenu: [
        // {label: lang.menuTpl.undo[i], accelerator: "CmdOrCtrl+Z", selector: "undo:"},
        // {label: lang.menuTpl.redo[i], accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
        // {type: "separator"},
        // {label: lang.menuTpl.cut[i], accelerator: "CmdOrCtrl+X", selector: "cut:"},
        {
          label: lang.menuTpl.copy[i],
          accelerator: "CmdOrCtrl+C",
          role: "copy"
        },
        {
          label: lang.menuTpl.paste[i],
          accelerator: "CmdOrCtrl+V",
          role: "paste"
        }
        // {label: lang.menuTpl.selectAll[i], accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
      ]
    },
    {
      label: lang.menuTpl.account[i],
      submenu: [
        {
          label: lang.menuTpl.accountExport[i],
          async click() {
            ipcMain.once("export", (event, adminDatadir) => {
              shell.showItemInFolder(path.join(adminDatadir, "/keystore"));
            });
            mainWindow.webContents.send("adminDatadir", "export");
          }
        },
        {
          label: lang.menuTpl.accountImport[i],
          submenu: [
            {
              label: lang.menuTpl.keystoreImport[i],
              click() {
                mainWindow.webContents.send("importKeystore");
              }
            },
            {
              label: lang.menuTpl.mnemonicsImport[i],
              click() {
                if (mainWindow) {
                  mainWindow.webContents.send("backupMnemonic", "start");
                }
              }
            }
          ]
        }
      ]
    },
    {
      label: lang.menuTpl.language[i],
      submenu: [
        {
          label: "简体中文",
          click() {
            currentWindow.webContents.send("changeLanguage", "zh-CN");
          }
        },
        {
          label: "English",
          click() {
            currentWindow.webContents.send("changeLanguage", "en");
          }
        },
        {
          label: "Français",
          click() {
            currentWindow.webContents.send("changeLanguage", "fr");
          }
        },
        {
          label: "繁體中文",
          click() {
            currentWindow.webContents.send("changeLanguage", "zh-TW");
          }
        }
      ]
    },
    {
      label: lang.menuTpl.help[i],
      submenu: [
        {
          label: lang.menuTpl.useHelp[i],
          click() {
            shell.openExternal(
              "https://github.com/nerthus-foundation-ltd/wallet/wiki"
            );
          }
        },
        {
          label: lang.menuTpl.issue[i],
          click() {
            shell.openExternal(
              "https://github.com/nerthus-foundation-ltd/wallet/issues"
            );
          }
        }
      ]
    },
    {
      label: lang.menuTpl.debug[i],
      submenu: [
        {
          label: "open console",
          click() {
            currentWindow.webContents.openDevTools();
          }
        }
        //   {
        //   label: "peersInfo",
        //   click() {
        //     try {
        //       mainWindow.webContents.send('checkPeersInfo')
        //     } catch (e) {
        //     }
        //   }
        // }
      ]
    }
  ];
  //注册菜单
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
