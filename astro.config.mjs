// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({}),
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: import.meta.env.PROD
        ? { "react-dom/server": "react-dom/server.edge" }
        : {},
    },
  },
  experimental: {},
});
