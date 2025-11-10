import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    viteReact(),
  ],
  // Configure SPA fallback for client-side routing
  appType: 'spa',
  preview: {
    port: 4173,
    strictPort: false,
    // Enable SPA fallback in preview mode
    proxy: undefined,
  },
});

export default config;
