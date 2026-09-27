import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      bundleTypes: {
        // Plugin defaults this to the `typescript` package, but TS7 ships no
        // lib .d.ts files, so API Extractor can't resolve `Promise` etc.
        // Unset falls back to API Extractor's bundled compiler libs.
        invokeOptions: { typescriptCompilerFolder: undefined },
      },
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Flurry",
      formats: ["es", "cjs"],
      fileName: "flurry",
    },
  },
});
