import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import viteReact from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
