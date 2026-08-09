import { z } from "astro/zod"

import { fetchWithTimeout, safeHttpUrl, type Fetcher } from "@/lib/http"
import type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
  GitHubPortfolio,
  Project,
  PullRequest,
} from "@/types/portfolio"

const contributionDaySchema = z.object({
  contributionCount: z.number().int().nonnegative(),
  date: z.string(),
})

const repositorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  primaryLanguage: z
    .object({
      name: z.string(),
    })
    .nullable(),
  repositoryTopics: z.object({
    nodes: z.array(
      z.object({
        topic: z.object({ name: z.string() }),
      })
    ),
  }),
  stargazerCount: z.number().int().nonnegative(),
  forkCount: z.number().int().nonnegative(),
  url: z.string(),
  homepageUrl: z.string().nullable(),
  updatedAt: z.string(),
})

const pullRequestSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  number: z.number().int().nonnegative(),
  mergedAt: z.string().nullable(),
  repository: z
    .object({
      nameWithOwner: z.string(),
    })
    .nullable(),
})

const githubResponseSchema = z.object({
  data: z
    .object({
      user: z
        .object({
          pinnedItems: z.object({
            nodes: z.array(repositorySchema.nullable()),
          }),
          contributionsCollection: z.object({
            contributionCalendar: z.object({
              totalContributions: z.number().int().nonnegative(),
              weeks: z.array(
                z.object({
                  contributionDays: z.array(contributionDaySchema),
                })
              ),
            }),
          }),
          pullRequests: z.object({
            nodes: z.array(pullRequestSchema.nullable()),
          }),
        })
        .nullable(),
    })
    .optional(),
  errors: z.array(z.object({ message: z.string() })).optional(),
})

const PORTFOLIO_QUERY = `
  query Portfolio($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            description
            primaryLanguage { name }
            repositoryTopics(first: 8) {
              nodes { topic { name } }
            }
            stargazerCount
            forkCount
            url
            homepageUrl
            updatedAt
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { contributionCount date }
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
          repository { nameWithOwner }
        }
      }
    }
  }
`

const preferredProjectNames = new Map([
  ["edgerunner", "EdgeRunner"],
  ["perplab", "PerpLab"],
  ["glyphix", "Glyphix"],
])

const preferredOrder = ["edgerunner", "perplab", "herdr-scratch", "glyphix"]
const VISIBLE_CONTRIBUTION_WEEKS = 35

type GitHubOptions = {
  username: string
  token?: string | undefined
  fallbackProjects: Project[]
  fetcher?: Fetcher
  now?: Date
  timeoutMs?: number
}

export async function getGitHubPortfolio({
  username,
  token,
  fallbackProjects,
  fetcher = fetch,
  now = new Date(),
  timeoutMs = 4500,
}: GitHubOptions): Promise<GitHubPortfolio> {
  const fallback = createFallbackPortfolio(fallbackProjects, now)

  if (!token) return fallback

  try {
    const { from, to } = getContributionRange(now)
    const response = await fetchWithTimeout(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "akash-jana-portfolio",
        },
        body: JSON.stringify({
          query: PORTFOLIO_QUERY,
          variables: { login: username, from, to },
        }),
      },
      timeoutMs,
      fetcher
    )

    if (!response.ok) return fallback

    const parsed = githubResponseSchema.safeParse(await response.json())
    const user = parsed.success ? parsed.data.data?.user : null

    if (!user || (parsed.success && parsed.data.errors?.length)) return fallback

    const projects = user.pinnedItems.nodes
      .filter((project): project is z.infer<typeof repositorySchema> =>
        Boolean(project)
      )
      .map(normalizeProject)
      .filter((project): project is Project => Boolean(project))
      .sort(sortProjects)
    const visibleProjects = projects.length ? projects : fallback.projects

    const calendar = user.contributionsCollection.contributionCalendar
    const visibleWeeks = calendar.weeks
      .slice(-VISIBLE_CONTRIBUTION_WEEKS)
      .map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        }))
      )
    const pullRequests = user.pullRequests.nodes
      .filter((item): item is z.infer<typeof pullRequestSchema> =>
        Boolean(item)
      )
      .flatMap(normalizePullRequest)
      .sort(
        (left, right) =>
          new Date(right.mergedAt).getTime() - new Date(left.mergedAt).getTime()
      )
      .slice(0, visibleProjects.length)

    return {
      projects: visibleProjects,
      calendar: {
        totalContributions: visibleWeeks.reduce(
          (total, week) =>
            total + week.reduce((weekTotal, day) => weekTotal + day.count, 0),
          0
        ),
        weeks: visibleWeeks,
      },
      pullRequests,
      source: "live",
    }
  } catch {
    return fallback
  }
}

function normalizeProject(
  project: z.infer<typeof repositorySchema>
): Project | null {
  const url = safeHttpUrl(project.url)
  if (!url) return null

  const key = project.name.trim().toLowerCase()

  return {
    id: project.id,
    name: project.name,
    displayName: preferredProjectNames.get(key) ?? project.name,
    description:
      project.description?.trim() || "Open-source project by Akash Jana.",
    primaryLanguage: project.primaryLanguage?.name ?? null,
    topics: project.repositoryTopics.nodes.map((node) => node.topic.name),
    stars: project.stargazerCount,
    forks: project.forkCount,
    url,
    homepageUrl: safeHttpUrl(project.homepageUrl),
    updatedAt: project.updatedAt,
  }
}

function normalizePullRequest(
  pullRequest: z.infer<typeof pullRequestSchema>
): PullRequest[] {
  const url = safeHttpUrl(pullRequest.url)
  if (!url || !pullRequest.mergedAt) return []

  return [
    {
      id: pullRequest.id,
      title: pullRequest.title,
      url,
      number: pullRequest.number,
      mergedAt: pullRequest.mergedAt,
      repositoryName: pullRequest.repository?.nameWithOwner ?? "GitHub",
    },
  ]
}

function sortProjects(left: Project, right: Project) {
  const leftIndex = preferredOrder.indexOf(left.name.toLowerCase())
  const rightIndex = preferredOrder.indexOf(right.name.toLowerCase())
  const normalizedLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex
  const normalizedRight =
    rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex

  return normalizedLeft - normalizedRight || left.name.localeCompare(right.name)
}

export function getContributionLevel(count: number): ContributionLevel {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

export function createFallbackCalendar(now = new Date()): ContributionCalendar {
  const end = new Date(now)
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()))

  const days = Array.from(
    { length: VISIBLE_CONTRIBUTION_WEEKS * 7 },
    (_, index) => {
      const date = new Date(end)
      date.setUTCDate(
        end.getUTCDate() - (VISIBLE_CONTRIBUTION_WEEKS * 7 - 1 - index)
      )

      return {
        date: date.toISOString().slice(0, 10),
        count: 0,
        level: 0,
      } satisfies ContributionDay
    }
  )

  return {
    totalContributions: 0,
    weeks: Array.from({ length: VISIBLE_CONTRIBUTION_WEEKS }, (_, index) =>
      days.slice(index * 7, index * 7 + 7)
    ),
  }
}

function createFallbackPortfolio(
  fallbackProjects: Project[],
  now: Date
): GitHubPortfolio {
  return {
    projects: [...fallbackProjects].sort(sortProjects),
    calendar: createFallbackCalendar(now),
    pullRequests: [],
    source: "fallback",
  }
}

function getContributionRange(now: Date) {
  const to = new Date(now)
  const from = new Date(now)
  from.setUTCMonth(from.getUTCMonth() - 8)

  return { from: from.toISOString(), to: to.toISOString() }
}
