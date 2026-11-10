import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://amechica.com",
  output: "static",
  integrations: [sitemap()],
  server: {
    port: 4321,
    host: true,
  },
  preview: {
    port: 4321,
    host: true,
  },
});
