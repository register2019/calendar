import { createApp } from "vue";
import App from "./App.vue";
import Calendar from "./components/index";

const app = createApp(App);
app.use(Calendar);
app.mount("#app");
