import type { GitHubRepository } from "@/types/github"
import type { Article } from "@/types/writing"

export type SocialLink = {
  label: string
  href: string
  handle?: string
  sameAs?: boolean
}

export type PortfolioConfig = {
  site: {
    name: string
    title: string
    description: string
    url: string
    locale: string
  }
  person: {
    name: string
    givenName: string
    familyName: string
    username: string
    role: string
    summary: string
    location: string
    avatarUrl: string
  }
  about: string[]
  currentFocus: string[]
  experience: {
    title: string
    description: string
  }[]
  socialLinks: SocialLink[]
  github: {
    username: string
    token?: string
    fallbackProjects: GitHubRepository[]
  }
  writing: {
    devToApiKey?: string
    devToUsername?: string
    mediumRssUrl?: string
    fallbackArticles: Article[]
  }
  external: {
    revalidateSeconds: number
  }
}
