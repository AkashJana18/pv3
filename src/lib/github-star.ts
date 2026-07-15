const GITHUB_REPOSITORY_PATTERN =
  /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i

export function isGitHubRepositorySlug(value: string) {
  return GITHUB_REPOSITORY_PATTERN.test(value)
}

export function getGitHubRepositorySlug(url: string) {
  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname !== "github.com") {
      return null
    }

    const [owner, repository, ...rest] = parsedUrl.pathname
      .split("/")
      .filter(Boolean)

    if (!owner || !repository || rest.length) {
      return null
    }

    const slug = `${owner}/${repository.replace(/\.git$/, "")}`

    return isGitHubRepositorySlug(slug) ? slug : null
  } catch {
    return null
  }
}
