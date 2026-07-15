import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { isGitHubRepositorySlug } from "@/lib/github-star"

export async function GET(request: NextRequest) {
  const repository = request.nextUrl.searchParams.get("repository")

  if (!(repository && isGitHubRepositorySlug(repository))) {
    return NextResponse.json({ error: "Invalid repository." }, { status: 400 })
  }

  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: "GitHub star count is unavailable." },
      { status: response.status }
    )
  }

  const payload = (await response.json()) as { stargazers_count?: unknown }

  if (typeof payload.stargazers_count !== "number") {
    return NextResponse.json(
      { error: "GitHub did not return a star count." },
      { status: 502 }
    )
  }

  return NextResponse.json({ stars: payload.stargazers_count })
}
