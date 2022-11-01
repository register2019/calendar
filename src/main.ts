import { createApp } from "vue";
import App from "./App.vue";
import { DefaultComponents } from "@default/components";
import "@default/style/index.scss";

// 打包之后测试
// import { DefaultComponents } from "../dist";
// import "../dist/style.css";
const app = createApp(App);
app.use(DefaultComponents());
app.mount("#app");
