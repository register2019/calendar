import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions()],
  build: {
    outDir: "default-calendar",
    lib: {
      entry: path.resolve(__dirname, "./src/components/index.ts"),
      name: "default-calendar",
      fileName: "default-calendar",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
