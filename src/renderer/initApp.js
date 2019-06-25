import Vue from "vue";
import {
  Alert,
  Button,
  Col,
  Collapse,
  CollapseItem,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  Pagination,
  Progress,
  Row,
  Select,
  Slider,
  Step,
  Steps,
  Table,
  TableColumn,
  Tooltip
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "./styles/reset.scss";
import "./styles/icon-font/iconfont.css";
import "./styles/animate.scss";
import "./styles/hack.scss";

import filters from "./filters";
import { initSocket } from "../api/request";
import { init as initDB } from "../modules/db";

function initElementUi() {
  Vue.use(Button);
  Vue.use(Select);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Dialog);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Option);
  Vue.use(InputNumber);
  Vue.use(Slider);
  Vue.use(Input);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Dropdown);
  Vue.use(DropdownItem);
  Vue.use(DropdownMenu);
  Vue.use(Pagination);
  Vue.use(Progress);
  Vue.use(Step);
  Vue.use(Steps);
  Vue.use(Alert);
  Vue.use(Collapse);
  Vue.use(CollapseItem);
  Vue.use(Tooltip);
}

export default () =>
  new Promise(async resolve => {
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key]);
    });

    initElementUi();

    initDB();

    initSocket().then(() => {
      resolve();
    });
  });
