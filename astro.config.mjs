/* eslint-disable no-undef */
// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";

const isVercel = process.env.IS_VERCEL === "true";

export default defineConfig({
  output: "server",
  // Use Vercel adapter for production, Node adapter for dev/preview
  adapter: isVercel ? vercel({}) : node({ mode: "standalone" }),
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: isVercel ? { "react-dom/server": "react-dom/server.edge" } : {},
    },
  },
  experimental: {
    session: !isVercel,
  },
});
