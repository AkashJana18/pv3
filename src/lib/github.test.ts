import { describe, expect, it, vi } from "vitest"

import { getGitHubPortfolio } from "@/lib/github"
import type { Fetcher } from "@/lib/http"
import type { Project } from "@/types/portfolio"

const fallbackProjects: Project[] = [
  {
    id: "fallback",
    name: "fallback",
    displayName: "Fallback",
    description: "Saved project",
    primaryLanguage: "Rust",
    stars: 0,
    url: "https://github.com/example/fallback",
    homepageUrl: null,
  },
  {
    id: "macfolio",
    name: "macfolio",
    displayName: "Macfolio",
    description: "A macOS-inspired portfolio built with GSAP.",
    primaryLanguage: "JavaScript",
    stars: 0,
    url: "https://github.com/example/macfolio",
    homepageUrl: "https://macfolio.example.com",
    alwaysInclude: true,
  },
]

describe("getGitHubPortfolio", () => {
  it("returns a deterministic fallback without requesting GitHub when the token is missing", async () => {
    const fetcher = vi.fn<Fetcher>()

    const result = await getGitHubPortfolio({
      username: "example",
      fallbackProjects,
      fetcher,
      now: new Date("2026-08-07T00:00:00Z"),
    })

    expect(fetcher).not.toHaveBeenCalled()
    expect(result.source).toBe("fallback")
    expect(result.projects).toEqual(fallbackProjects)
    expect(result.calendar.weeks).toHaveLength(35)
    expect(result.calendar.weeks.every((week) => week.length === 7)).toBe(true)
  })

  it("normalizes valid repositories, contributions, and merged pull requests", async () => {
    const fetcher: Fetcher = async () =>
      Response.json({
        data: {
          user: {
            pinnedItems: {
              nodes: [
                {
                  id: "repo-1",
                  name: "edgerunner",
                  description: "Fast execution paths",
                  primaryLanguage: { name: "Rust" },
                  stargazerCount: 4,
                  url: "https://github.com/example/edgerunner",
                  homepageUrl: null,
                },
              ],
            },
            contributionsCollection: {
              contributionCalendar: {
                weeks: [
                  {
                    contributionDays: [
                      { contributionCount: 6, date: "2026-08-01" },
                    ],
                  },
                ],
              },
            },
            pullRequests: {
              nodes: [
                {
                  id: "pr-1",
                  title: "Tighten parser",
                  url: "https://github.com/example/project/pull/1",
                  mergedAt: "2026-08-02T00:00:00Z",
                  repository: { nameWithOwner: "example/project" },
                },
                {
                  id: "pr-2",
                  title: "Improve fallback behavior",
                  url: "https://github.com/example/project/pull/2",
                  mergedAt: "2026-08-01T00:00:00Z",
                  repository: { nameWithOwner: "example/project" },
                },
              ],
            },
          },
        },
      })

    const result = await getGitHubPortfolio({
      username: "example",
      token: "token",
      fallbackProjects,
      fetcher,
    })

    expect(result.source).toBe("live")
    expect(result.projects[0]).toMatchObject({
      displayName: "EdgeRunner",
      primaryLanguage: "Rust",
      stars: 4,
    })
    expect(result.projects.at(-1)?.displayName).toBe("Macfolio")
    expect(result.calendar.totalContributions).toBe(6)
    expect(result.calendar.weeks[0]?.[0]?.level).toBe(3)
    expect(result.pullRequests).toHaveLength(result.projects.length)
    expect(result.pullRequests[0]?.repositoryName).toBe("example/project")
  })

  it.each([429, 500])(
    "falls back when GitHub responds with %s",
    async (status) => {
      const result = await getGitHubPortfolio({
        username: "example",
        token: "token",
        fallbackProjects,
        fetcher: async () => new Response("unavailable", { status }),
      })

      expect(result.source).toBe("fallback")
      expect(result.projects[0]?.displayName).toBe("Fallback")
    }
  )

  it("falls back when the request times out", async () => {
    const fetcher: Fetcher = (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError"))
        )
      })

    const result = await getGitHubPortfolio({
      username: "example",
      token: "token",
      fallbackProjects,
      fetcher,
      timeoutMs: 5,
    })

    expect(result.source).toBe("fallback")
  })
})
