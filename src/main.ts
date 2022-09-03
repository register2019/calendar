import { createApp } from "vue";
import App from "./App.vue";
// import Calendar from "./components/index";
import "default-calendar/style.css";
import Calendar from "default-calendar";

const app = createApp(App);
app.use(Calendar);
app.mount("#app");
