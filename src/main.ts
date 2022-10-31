import { createApp } from "vue";
import App from "./App.vue";
import { DefaultComponents } from "@default/components";
import "@default/style/index.scss";

const app = createApp(App);
app.use(DefaultComponents());
app.mount("#app");
