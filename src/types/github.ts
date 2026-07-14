export type GitHubLanguage = {
  name: string
  color?: string | null
}

export type GitHubRepository = {
  id: string
  name: string
  displayName?: string
  description: string
  primaryLanguage?: GitHubLanguage | null
  topics: string[]
  stars: number
  forks: number
  url: string
  homepageUrl?: string | null
  openGraphImageUrl: string
  updatedAt?: string
}

export type RepositoryResult = {
  repositories: GitHubRepository[]
}

export type GitHubContributionDay = {
  date: string
  count: number
  level: number
}

export type GitHubContributionCalendar = {
  totalContributions: number
  weeks: GitHubContributionDay[][]
}

export type GitHubPullRequest = {
  id: string
  title: string
  url: string
  number: number
  mergedAt: string
  repositoryName: string
}

export type GitHubActivity = {
  calendar: GitHubContributionCalendar
  pullRequests: GitHubPullRequest[]
}

export type GitHubPortfolio = RepositoryResult & {
  activity: GitHubActivity
}

export type ProjectOverrideConfig = {
  order?: string[]
  hidden?: string[]
}
