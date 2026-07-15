import { describe, expect, it } from "vitest"

import {
  getGitHubRepositorySlug,
  isGitHubRepositorySlug,
} from "@/lib/github-star"

describe("GitHub star repository validation", () => {
  it("derives a slug from a canonical GitHub repository URL", () => {
    expect(
      getGitHubRepositorySlug("https://github.com/AkashJana18/edgerunner")
    ).toBe("AkashJana18/edgerunner")
  })

  it("rejects non-repository and non-GitHub URLs", () => {
    expect(getGitHubRepositorySlug("https://github.com/AkashJana18")).toBeNull()
    expect(
      getGitHubRepositorySlug("https://example.com/AkashJana18/edgerunner")
    ).toBeNull()
    expect(isGitHubRepositorySlug("AkashJana18/edgerunner/extra")).toBe(false)
  })
})
