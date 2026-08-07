import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel"
import { defineConfig } from "astro/config"

const SIX_HOURS = 60 * 60 * 6

export default defineConfig({
  site: process.env.SITE_URL || "https://akashjana.tech",
  output: "server",
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      sizes: [360, 540, 720, 900],
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: SIX_HOURS,
    },
    isr: {
      expiration: SIX_HOURS,
    },
  }),
  integrations: [sitemap()],
  devToolbar: {
    enabled: false,
  },
  image: {
    responsiveStyles: true,
  },
})
