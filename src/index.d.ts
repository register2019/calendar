import { defineOptions } from "unplugin-vue-define-options/vite";
import { defineComponent } from "vue";

declare global {
  const defineOptions: typeof defineComponent;
}
