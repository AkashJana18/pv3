import { portfolioConfig } from "@/config/portfolio"
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "@/components/panel"
import { WorkExperience } from "@/components/work-experience"

export function AboutPanel() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
        <PanelDescription>
          Engineering-focused, systems-minded, and currently exploring Solana
          security as a learning direction.
        </PanelDescription>
      </PanelHeader>
      <PanelContent className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
        {portfolioConfig.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </PanelContent>
    </Panel>
  )
}

export function CurrentlyPanel() {
  return (
    <Panel id="currently">
      <PanelHeader>
        <PanelTitle>Currently</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <ul className="grid gap-2 sm:grid-cols-2">
          {portfolioConfig.currentFocus.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-line bg-card p-4 text-sm"
            >
              <span
                className="mt-2 size-1.5 rounded-full bg-foreground"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  )
}

export function ExperiencePanel() {
  const experiences = portfolioConfig.experience.map((item) => ({
    id: item.organization.toLowerCase().replaceAll(" ", "-"),
    companyName: item.organization,
    companyWebsite: item.organizationUrl,
    isCurrentEmployer: item.period === "Current",
    positions: [
      {
        id: `${item.organization}-${item.role}`
          .toLowerCase()
          .replaceAll(" ", "-"),
        title: item.role,
        employmentPeriod: { label: item.period },
        employmentType: item.employmentType,
        description: item.description,
        skills: item.highlights,
        isExpanded: item.organization === "Freelance",
      },
    ],
  }))

  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle count={portfolioConfig.experience.length}>
          Experience
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="p-0">
        <WorkExperience
          className="bg-transparent px-4 sm:px-5"
          experiences={experiences}
        />
      </PanelContent>
    </Panel>
  )
}
