import type { ProjectOverrideConfig } from "@/types/github"

export const projectOverrides = {
  order: ["edgerunner", "perplab", "herdr-scratch", "glyphix"],
  hidden: [],
} satisfies ProjectOverrideConfig
