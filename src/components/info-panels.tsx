import { portfolioConfig } from "@/config/portfolio"
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "@/components/panel"

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
  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle count={portfolioConfig.experience.length}>
          Experience and community
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="grid gap-3 sm:grid-cols-2">
        {portfolioConfig.experience.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-line p-4"
          >
            <h3 className="font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </PanelContent>
    </Panel>
  )
}
