import { unstable_cache } from "next/cache"

import type {
  GitHubActivity,
  GitHubContributionDay,
  GitHubLanguage,
  GitHubPortfolio,
  GitHubPullRequest,
  GitHubRepository,
  ProjectOverrideConfig,
} from "@/types/github"
import { portfolioConfig } from "@/config/portfolio"
import { projectOverrides } from "@/config/project-overrides"
import { fetchWithTimeout } from "@/lib/fetch"

type GitHubGraphQlRepository = {
  id: string
  name: string
  description: string | null
  primaryLanguage: GitHubLanguage | null
  repositoryTopics: {
    nodes: {
      topic: {
        name: string
      }
    }[]
  }
  stargazerCount: number
  forkCount: number
  url: string
  homepageUrl: string | null
  openGraphImageUrl: string
  updatedAt: string
}

type GitHubGraphQlContributionDay = {
  contributionCount: number
  date: string
}

type GitHubGraphQlPullRequest = {
  id: string
  title: string
  url: string
  number: number
  mergedAt: string
  repository: {
    nameWithOwner: string
  } | null
}

type GitHubGraphQlResponse = {
  data?: {
    user?: {
      pinnedItems: {
        nodes: GitHubGraphQlRepository[]
      }
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: GitHubGraphQlContributionDay[]
          }[]
        }
      }
      pullRequests: {
        nodes: GitHubGraphQlPullRequest[]
      }
    } | null
  }
  errors?: {
    message: string
  }[]
}

const PORTFOLIO_QUERY = `
  query Portfolio($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            description
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 8) {
              nodes {
                topic {
                  name
                }
              }
            }
            stargazerCount
            forkCount
            url
            homepageUrl
            openGraphImageUrl
            updatedAt
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      pullRequests(
        first: 50
        states: MERGED
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          id
          title
          url
          number
          mergedAt
          repository {
            nameWithOwner
          }
        }
      }
    }
  }
`

export const getGitHubPortfolio = unstable_cache(
  async (): Promise<GitHubPortfolio> => {
    return getUncachedGitHubPortfolio()
  },
  ["portfolio-github", portfolioConfig.github.username],
  {
    revalidate: portfolioConfig.external.revalidateSeconds,
  }
)

async function getUncachedGitHubPortfolio(): Promise<GitHubPortfolio> {
  if (!portfolioConfig.github.token) {
    return {
      repositories: getFallbackRepositories(),
      activity: getFallbackActivity(),
    }
  }

  try {
    const { from, to } = getContributionRange()
    const response = await fetchWithTimeout("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${portfolioConfig.github.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: PORTFOLIO_QUERY,
        variables: {
          login: portfolioConfig.github.username,
          from,
          to,
        },
      }),
      next: {
        revalidate: portfolioConfig.external.revalidateSeconds,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`)
    }

    const payload = (await response.json()) as GitHubGraphQlResponse

    if (payload.errors?.length) {
      throw new Error(payload.errors.map((error) => error.message).join("; "))
    }

    const user = payload.data?.user
    const nodes = user?.pinnedItems.nodes ?? []
    const repositories = applyRepositoryOverrides(
      nodes.map(normalizeRepository),
      projectOverrides
    )

    return {
      repositories: repositories.length
        ? repositories
        : getFallbackRepositories(),
      activity: user ? normalizeActivity(user) : getFallbackActivity(),
    }
  } catch {
    return {
      repositories: getFallbackRepositories(),
      activity: getFallbackActivity(),
    }
  }
}

export function applyRepositoryOverrides(
  repositories: GitHubRepository[],
  overrides: ProjectOverrideConfig
) {
  const hidden = new Set((overrides.hidden ?? []).map(normalizeRepoName))
  const order = new Map(
    (overrides.order ?? []).map((name, index) => [
      normalizeRepoName(name),
      index,
    ])
  )

  return repositories
    .filter((repository) => !hidden.has(normalizeRepoName(repository.name)))
    .sort((left, right) => {
      const leftIndex =
        order.get(normalizeRepoName(left.name)) ?? Number.MAX_SAFE_INTEGER
      const rightIndex =
        order.get(normalizeRepoName(right.name)) ?? Number.MAX_SAFE_INTEGER

      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex
      }

      return left.name.localeCompare(right.name)
    })
}

function normalizeRepository(
  repository: GitHubGraphQlRepository
): GitHubRepository {
  return {
    id: repository.id,
    name: repository.name,
    displayName: getPreferredDisplayName(repository.name),
    description:
      repository.description?.trim() || "Open-source project by Akash Jana.",
    primaryLanguage: repository.primaryLanguage,
    topics: repository.repositoryTopics.nodes.map((node) => node.topic.name),
    stars: repository.stargazerCount,
    forks: repository.forkCount,
    url: repository.url,
    homepageUrl: repository.homepageUrl,
    openGraphImageUrl:
      repository.openGraphImageUrl || getGitHubOgImageUrl(repository.name),
    updatedAt: repository.updatedAt,
  }
}

function getFallbackRepositories() {
  return applyRepositoryOverrides(
    portfolioConfig.github.fallbackProjects,
    projectOverrides
  )
}

function normalizeActivity(
  user: NonNullable<GitHubGraphQlResponse["data"]>["user"]
): GitHubActivity {
  const calendar = user?.contributionsCollection.contributionCalendar

  return {
    calendar: calendar
      ? {
          totalContributions: calendar.totalContributions,
          weeks: calendar.weeks.map((week) =>
            week.contributionDays.map((day) => ({
              date: day.date,
              count: day.contributionCount,
              level: getContributionLevel(day.contributionCount),
            }))
          ),
        }
      : getFallbackActivity().calendar,
    pullRequests:
      user?.pullRequests.nodes
        .filter((pullRequest): pullRequest is GitHubGraphQlPullRequest =>
          Boolean(pullRequest.mergedAt)
        )
        .map(normalizePullRequest)
        .sort(
          (left, right) =>
            new Date(right.mergedAt).getTime() -
            new Date(left.mergedAt).getTime()
        )
        .slice(0, 4) ?? [],
  }
}

function normalizePullRequest(
  pullRequest: GitHubGraphQlPullRequest
): GitHubPullRequest {
  return {
    id: pullRequest.id,
    title: pullRequest.title,
    url: pullRequest.url,
    number: pullRequest.number,
    mergedAt: pullRequest.mergedAt,
    repositoryName: pullRequest.repository?.nameWithOwner ?? "GitHub",
  }
}

function getContributionRange() {
  const to = new Date()
  const from = new Date(to)
  from.setUTCFullYear(from.getUTCFullYear() - 1)

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  }
}

function getFallbackActivity(): GitHubActivity {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()))

  const days = Array.from({ length: 53 * 7 }, (_, index) => {
    const date = new Date(end)
    date.setUTCDate(end.getUTCDate() - (53 * 7 - 1 - index))

    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    } satisfies GitHubContributionDay
  })

  return {
    calendar: {
      totalContributions: 0,
      weeks: Array.from({ length: 53 }, (_, index) =>
        days.slice(index * 7, index * 7 + 7)
      ),
    },
    pullRequests: [],
  }
}

function getContributionLevel(count: number) {
  if (count <= 0) {
    return 0
  }

  if (count <= 2) {
    return 1
  }

  if (count <= 5) {
    return 2
  }

  if (count <= 9) {
    return 3
  }

  return 4
}

function getPreferredDisplayName(name: string) {
  const preferredNames = new Map([
    ["edgerunner", "EdgeRunner"],
    ["perplab", "PerpLab"],
    ["glyphix", "Glyphix"],
  ])

  return preferredNames.get(normalizeRepoName(name)) ?? name
}

function getGitHubOgImageUrl(name: string) {
  void name

  return "/project-placeholder.svg"
}

function normalizeRepoName(name: string) {
  return name.trim().toLowerCase()
}
