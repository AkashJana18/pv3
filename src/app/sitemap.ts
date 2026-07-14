import type { MetadataRoute } from "next"

import { portfolioConfig } from "@/config/portfolio"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: portfolioConfig.site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
