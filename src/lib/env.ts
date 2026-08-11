function read(value: string | undefined) {
  const normalized = value?.trim()
  return normalized || undefined
}

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(read(value))
  return Number.isFinite(parsed) ? parsed : fallback
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
  weatherLatitude: readNumber(import.meta.env.WEATHER_LATITUDE, 19.076),
  weatherLongitude: readNumber(import.meta.env.WEATHER_LONGITUDE, 72.8777),
} as const
