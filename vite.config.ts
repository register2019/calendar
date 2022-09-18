import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";
import { fileURLToPath } from "url";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: "dist",
      staticImport: true,
      insertTypesEntry: true,
    }),
    DefineOptions(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "packages/components/index.ts"),
      name: "default-calendar",
      fileName: (format) => `default-calendar.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"], // 过滤掉vue依赖
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
