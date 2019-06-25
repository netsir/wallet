import { ipcMain, app } from "electron";
import compile from "./compile";
import Menu from "../modules/menu";
export default function() {
  ipcMain.on("compile", (event, code) => {
    let result = compile(code);
    event.sender.send("compile", result);
  });

  ipcMain.on("langType", (e, i) => {
    Menu(i);
  });

  ipcMain.on("closeApp", () => {
    app.quit();
  });
}
