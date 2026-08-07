export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionDay = {
  date: string
  count: number
  level: ContributionLevel
}

export type ContributionCalendar = {
  totalContributions: number
  weeks: ContributionDay[][]
}

export type PullRequest = {
  id: string
  title: string
  url: string
  number: number
  mergedAt: string
  repositoryName: string
}

export type Project = {
  id: string
  name: string
  displayName: string
  description: string
  primaryLanguage: string | null
  topics: string[]
  stars: number
  forks: number
  url: string
  homepageUrl: string | null
  updatedAt?: string
}

export type GitHubPortfolio = {
  projects: Project[]
  calendar: ContributionCalendar
  pullRequests: PullRequest[]
  source: "live" | "fallback"
}

export type ArticlePlatform = "DEV.to" | "Medium"

export type ArticleLink = {
  id: string
  title: string
  description: string
  publishedAt: string
  platform: ArticlePlatform
  url: string
}

export type WritingResult = {
  articles: ArticleLink[]
  source: "live" | "fallback"
}

export type SocialLink = {
  label: string
  href: string
  handle?: string | undefined
  sameAs?: boolean
}

export type Experience = {
  organization: string
  organizationUrl?: string
  role: string
  period: string
  description: string
}

export type SiteConfig = {
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
    role: string
    summary: string
    location: string
    timeZone: string
    githubUsername: string
    portraitUrl: string
    resumeUrl?: string | undefined
  }
  summary: string[]
  experience: Experience[]
  socialLinks: SocialLink[]
  fallbackProjects: Project[]
  fallbackArticles: ArticleLink[]
}
