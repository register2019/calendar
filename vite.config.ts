import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true, // 是否生成类型声明入口
      cleanVueFileName: true, // 是否将 '.vue.d.ts' 文件名转换为 '.d.ts'
      copyDtsFiles: true, // 是否将源码里的 .d.ts 文件复制到 outputDir
    }),
    DefineOptions(),
    visualizer(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  mode: "production",
  build: {
    target: "modules",
    minify: true,
    emptyOutDir: false,
    outDir: resolve(__dirname, "dist/es"),
    lib: {
      entry: resolve(__dirname, "package/components/index.ts"),
      formats: ["es"],
      name: "default-calendar",
      fileName: "default-calendar",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        preserveModules: true,
      },
    },
  },
});
