function read(value: string | undefined) {
  const normalized = value?.trim()
  return normalized || undefined
}

export const env = {
  siteUrl: read(import.meta.env.SITE_URL) ?? "https://akashjana.tech",
  githubToken: read(import.meta.env.GITHUB_TOKEN),
  githubUsername: read(import.meta.env.GITHUB_USERNAME) ?? "akashjana18",
  devToApiKey: read(import.meta.env.DEVTO_API_KEY),
  devToUsername: read(import.meta.env.DEVTO_USERNAME),
  mediumRssUrl: read(import.meta.env.MEDIUM_RSS_URL),
  contactEmail: read(import.meta.env.CONTACT_EMAIL),
  linkedInUrl: read(import.meta.env.PROFILE_LINKEDIN_URL),
  xUrl: read(import.meta.env.PROFILE_X_URL),
  devToUrl: read(import.meta.env.PROFILE_DEVTO_URL),
  mediumUrl: read(import.meta.env.PROFILE_MEDIUM_URL),
  resumeUrl: read(import.meta.env.RESUME_URL),
} as const
