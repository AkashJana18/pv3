import { getGitHubPortfolio } from "@/lib/github"
import { getStructuredData } from "@/lib/structured-data"
import { getLatestWriting } from "@/lib/writing"
import { GitHubActivity } from "@/components/github-activity"
import {
  AboutPanel,
  CurrentlyPanel,
  ExperiencePanel,
} from "@/components/info-panels"
import { StripeDivider } from "@/components/panel"
import { ProfileHeader } from "@/components/profile-header"
import { ProjectList } from "@/components/project-list"
import { WritingList } from "@/components/writing-list"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [githubPortfolio, writingResult] = await Promise.all([
    getGitHubPortfolio(),
    getLatestWriting(),
  ])
  const structuredData = getStructuredData({
    projects: githubPortfolio.repositories,
    articles: writingResult.articles,
  })

  return (
    <main id="content" className="page-enter">
      {structuredData.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}

      <ProfileHeader />
      <StripeDivider />

      <AboutPanel />
      <StripeDivider />

      <GitHubActivity activity={githubPortfolio.activity} />
      <StripeDivider />

      <ProjectList repositories={githubPortfolio.repositories} />
      <StripeDivider />

      <WritingList result={writingResult} />
      <StripeDivider />

      <CurrentlyPanel />
      <StripeDivider />

      <ExperiencePanel />
    </main>
  )
}
