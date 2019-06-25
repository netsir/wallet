<template>
  <div class="initContent">

    <p v-if="!height" class="statusText">{{statusText}}</p>

    <div class="loadingContainer" v-if="inSync">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p class="height" v-if="height">{{$t('system.InSynchronization')}} {{height}} {{$t('system.units')}}</p>
    </div>

    <!--    <span class="changeNode noDraggable" @click="dialogFlag = true" v-show="inSync">{{$t('system.changeNodes')}}</span>-->
    <p class="start noDraggable" v-show="inSync" @click="startApp"><span>{{$t('system.startApp')}}</span></p>
    <i class="closeApp noDraggable" @click="closeInit">×</i>
    <div class="dialog" v-show="dialogFlag">
      <p>{{$t('system.chooseNodes')}}</p>
      <textarea v-model="nodeAddress" class="noDraggable" :placeholder="$t('system.enterNodes')"></textarea>
      <div class="btn noDraggable" @click="startSync">{{$t('system.startSynchronization')}}</div>
      <i class="close" @click="dialogFlag = false">×</i>
    </div>
  </div>
</template>

<script>
import { initSocket } from "../api/request";
import {
  getLastUnits,
  getSysChainAddress,
  startSyncNode,
  stopSyncNode,
  subscribe,
  clearSubscriptions,
  SUCCESS
} from "../api";
import Sntp from "sntp";
import { ipcRenderer, shell } from "electron";
import { MessageBox, Message } from "element-ui";

const initWindow = require("electron").remote.getCurrentWindow();
const langType = { "zh-CN": 0, en: 1, fr: 2, "zh-TW": 3 };
const INIT = Symbol("init");
const SYNC = Symbol("sync");

let timer;

export default {
  name: "loadingPage",
  data() {
    return {
      status: INIT,
      dialogFlag: false,
      sysAddress: "",
      nodeAddress: "",
      height: 0,
      timeStamp: 0,
      startFlag: false
    };
  },
  computed: {
    statusText() {
      if (this.status === INIT) return this.$t("system.initialization");
      if (this.status === SYNC) return this.$t("system.synchronizing");
    },
    inSync() {
      return this.status === SYNC;
    }
  },
  watch: {
    status(n) {
      if (n === SYNC) {
        this.startSync();
        this.getLatestTimeStamp();
        this.setTimeStampTimer();
      }
    }
  },
  methods: {
    async help_text() {
      shell.openExternal("https://www.baidu.com");
    },
    async TimeCheckFunction() {
      try {
        this.TimeCheck();
      } catch (e) {
        this.TimeCheck("cn.ntp.org.cn");
      }
    },
    async TimeCheck(spareAddress) {
      let options = {
        host: spareAddress || "ntp1.aliyun.com",
        resolveReference: true
      };
      let s = await Sntp.time(options);
      const h = this.$createElement;
      let differValue = Math.abs(s.transmitTimestamp - new Date());
      if (differValue > 6000) {
        MessageBox({
          title: this.$t("system.message"),
          message: h("p", null, [
            this.$t("system.timeCheckInaccurate") +
              parseInt(differValue / 1000) +
              this.$t("system.adviceUpdateTime"),
            h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "blue",
                  fontSize: "14px"
                },
                on: {
                  click: this.help_text
                }
              },
              this.$t("system.help_text")
            ),
            this.$t("system.affectUseWallet")
          ]),
          confirmButtonText: this.$t("account.yes"),
          customClass: "noDraggable"
        });
      }
    },
    closeInit() {
      initWindow.close();
    },
    async startSync() {
      if (this.nodeAddress === "") return;
      const { code: stopCode } = await stopSyncNode();
      if (stopCode === SUCCESS) {
        const nodeAddress = this.nodeAddress.trim();
        let rgx = /enode+:\/\/[^\s]*$/;
        if (!rgx.test(nodeAddress)) {
          Message.error("输入的节点格式错误");
          return;
        }
        const { code: startCode } = await startSyncNode(0, nodeAddress);
        if (startCode === SUCCESS) {
          this.dialogFlag = false;
          localStorage.setItem("ntsNode", nodeAddress);
        }
      }
    },

    async getLatestTimeStamp() {
      const { code, result } = await getLastUnits(this.sysAddress);
      if (code === SUCCESS) {
        this.timeStamp = parseInt(result.header.timestamp) / 1e6;
      }
    },

    setTimeStampTimer() {
      timer = setTimeout(() => {
        this.getLatestTimeStamp();
        if (Date.now() - this.timeStamp >= 120 * 1000) {
          this.setTimeStampTimer();
        } else {
          this.startApp();
        }
      }, 2000);
    },
    startApp() {
      if (!this.startFlag) {
        ipcRenderer.send("startApp");
        this.startFlag = true;
      }
    },
    async getSysChainAddress() {
      let { code, result } = await getSysChainAddress();
      if (code === SUCCESS) {
        this.sysAddress = result;
      } else {
        console.error(`${code}, ${result}`);
      }
    }
  },
  async created() {
    this.nodeAddress = localStorage.getItem("ntsNode") || "";
    await initSocket();
    await this.getSysChainAddress();
    this.status = SYNC;
    subscribe("newUnits", (err, res) => {
      if (err) return console.log(err);
      this.height++;
    });
  },
  mounted() {
    // this.TimeCheckFunction()
    let lang = window.localStorage.getItem("curLang");
    if (lang) {
      this.$i18n.locale = lang;
      ipcRenderer.send("langType", langType[lang]);
    } else {
      ipcRenderer.send("getLanguage", "ok");
      ipcRenderer.on("language", (event, arg) => {
        let lang = arg || "en";
        window.localStorage.setItem("curLang", lang);
        this.$i18n.locale = lang;
      });
    }
    ipcRenderer.on("changeLanguage", (event, arg) => {
      ipcRenderer.send("langType", langType[arg]);
      this.$i18n.locale = arg;
      window.localStorage.setItem("curLang", arg);
    });
  },
  beforeDestroy() {
    clearSubscriptions();
  }
};
</script>

<style lang="scss">
@import "styles/index";

html,
body {
  height: 100%;
}

.noDraggable {
  -webkit-app-region: no-drag;
}

.initContent {
  box-sizing: border-box;
  height: 100%;
  padding-top: 130px;
  position: relative;
  background-image: url("./loadingPage.png");
  background-size: cover;
  overflow: hidden;

  .statusText {
    text-align: center;
    margin-bottom: 6px;
    font-size: 14px;
    color: #333;
  }

  .height {
    color: #c3c3c3;
    font-size: 14px;
    margin-top: 4px;
    text-align: center;
    margin-bottom: 9px;
  }

  .changeNode {
    color: #555;
    font-size: 14px;
    transition: 0.2s;
    position: absolute;
    right: 40px;
    top: 12px;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
  }

  .start {
    margin-top: 24px;
    font-size: 14px;
    color: $themeColor;
    text-align: center;
    cursor: pointer;
  }

  .dialog {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    padding: 20px 40px;

    p {
      margin: 0;
      font-size: 18px;
    }

    textarea {
      box-sizing: border-box;
      border: 0;
      padding: 10px;
      outline: 0;
      font-size: 14px;
      margin-top: 24px;
      background: #f5f5f5;
      resize: none;
      width: 100%;
      height: 90px;

      &::-webkit-input-placeholder {
        color: #c3c3c3;
      }
    }

    .btn {
      width: 100%;
      text-align: center;
      color: #fff;
      background: #f68d27;
      padding: 10px 0;
      border-radius: 20px;
      margin-top: 28px;
      cursor: pointer;
    }

    .close {
      position: absolute;
      top: 2px;
      right: 14px;
      font-size: 32px;
      color: #8c939d;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        color: #000;
      }
    }
  }

  .closeApp {
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 32px;
    transition: 0.2s;
    position: absolute;
    right: 10px;
    color: #8c939d;
    top: 4px;
    cursor: pointer;

    &:hover {
      color: #000;
    }
  }

  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 20px;
    left: 188px;

    div {
      position: absolute;
      top: 5px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #c3c3c3;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);

      &:nth-child(1) {
        left: 6px;
        animation: lds-ellipsis1 0.6s infinite;
      }

      &:nth-child(2) {
        left: 6px;
        animation: lds-ellipsis2 0.6s infinite;
      }

      &:nth-child(3) {
        left: 26px;
        animation: lds-ellipsis2 0.6s infinite;
      }

      &:nth-child(4) {
        left: 45px;
        animation: lds-ellipsis3 0.6s infinite;
      }
    }

    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(19px, 0);
      }
    }
  }
}
</style>
