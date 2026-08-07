import { siteConfig } from "@/config/site"
import { env } from "@/lib/env"
import { getGitHubPortfolio } from "@/lib/github"
import { getLatestWritings } from "@/lib/writings"

export async function loadPortfolioData() {
  const [github, writings] = await Promise.all([
    getGitHubPortfolio({
      username: env.githubUsername,
      token: env.githubToken,
      fallbackProjects: siteConfig.fallbackProjects,
    }),
    getLatestWritings({
      devToUsername: env.devToUsername,
      devToApiKey: env.devToApiKey,
      mediumRssUrl: env.mediumRssUrl,
      fallbackArticles: siteConfig.fallbackArticles,
    }),
  ])

  return { github, writings }
}
