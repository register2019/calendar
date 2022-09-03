import { App } from "vue";
import Calendar from "./Calendar/index.vue";

export default {
  install: (app: App, opts: any) => {
    app.component(Calendar.name, Calendar);
  },
};
