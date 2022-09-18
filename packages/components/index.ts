import { App } from "vue";
import { forEach } from "lodash";
import * as components from "./components";

export const DefaultComponents = () => ({
  install: (app: App) => {
    forEach(components, (component) => {
      app.component(component.name, component);
    });
  },
});

export { components };
