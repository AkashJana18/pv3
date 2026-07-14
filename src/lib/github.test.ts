import { describe, expect, it } from "vitest"

import type { GitHubRepository } from "@/types/github"
import { applyRepositoryOverrides } from "@/lib/github"

const repository = (name: string): GitHubRepository => ({
  id: name,
  name,
  description: name,
  primaryLanguage: null,
  topics: [],
  stars: 0,
  forks: 0,
  url: `https://github.com/akashjana18/${name}`,
  homepageUrl: null,
  openGraphImageUrl: `https://example.com/${name}.png`,
})

describe("repository overrides", () => {
  it("orders and hides repositories without duplicating metadata", () => {
    const repositories = [
      repository("glyphix"),
      repository("perplab"),
      repository("hidden"),
    ]

    expect(
      applyRepositoryOverrides(repositories, {
        order: ["perplab", "glyphix"],
        hidden: ["hidden"],
      }).map((item) => item.name)
    ).toEqual(["perplab", "glyphix"])
  })
})
