import type { MetadataRoute } from "next"

import { portfolioConfig } from "@/config/portfolio"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: portfolioConfig.site.name,
    short_name: "Akash Jana",
    description: portfolioConfig.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  }
}
