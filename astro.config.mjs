// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  // Use Vercel adapter for production, Node adapter for dev/preview
  adapter: import.meta.env.IS_VERCEL
    ? vercel({})
    : node({ mode: "standalone" }),
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
  experimental: {
    session: !import.meta.env.IS_VERCEL,
  },
});
