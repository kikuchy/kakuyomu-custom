import path from "node:path";

import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";

export default defineConfig({
  plugins: [
    webExtension({
      manifest: path.resolve(__dirname, "src/manifest.json"),
      browser: process.env.BROWSER as "chrome" | "firefox" | "safari" | undefined,
      additionalInputs: [],
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    sourcemap: false,
    emptyOutDir: true,
    outDir: "dist",
  },
});
