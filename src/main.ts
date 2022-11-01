import { createApp } from "vue";
import App from "./App.vue";
import { DefaultComponents } from "../dist";
import "../dist/style.css";

const app = createApp(App);
app.use(DefaultComponents());
app.mount("#app");
