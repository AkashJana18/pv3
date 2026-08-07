/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string
  readonly GITHUB_TOKEN?: string
  readonly GITHUB_USERNAME?: string
  readonly DEVTO_API_KEY?: string
  readonly DEVTO_USERNAME?: string
  readonly MEDIUM_RSS_URL?: string
  readonly CONTACT_EMAIL?: string
  readonly PROFILE_LINKEDIN_URL?: string
  readonly PROFILE_X_URL?: string
  readonly PROFILE_DEVTO_URL?: string
  readonly PROFILE_MEDIUM_URL?: string
  readonly RESUME_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
