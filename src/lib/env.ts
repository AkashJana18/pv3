import { z } from "zod"

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined
  }

  return value
}

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional())
const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().email().optional()
)
const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional()
)

const envSchema = z.object({
  SITE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("https://akashjana.dev")
  ),
  GITHUB_TOKEN: optionalString,
  GITHUB_USERNAME: z.preprocess(
    emptyToUndefined,
    z.string().trim().default("akashjana18")
  ),
  DEVTO_API_KEY: optionalString,
  DEVTO_USERNAME: optionalString,
  MEDIUM_RSS_URL: optionalUrl,
  CONTACT_EMAIL: optionalEmail,
  PROFILE_LINKEDIN_URL: optionalUrl,
  PROFILE_X_URL: optionalUrl,
  PROFILE_DEVTO_URL: optionalUrl,
  PROFILE_MEDIUM_URL: optionalUrl,
  RESUME_URL: optionalUrl,
})

export const env = envSchema.parse({
  SITE_URL: process.env.SITE_URL,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  DEVTO_API_KEY: process.env.DEVTO_API_KEY,
  DEVTO_USERNAME: process.env.DEVTO_USERNAME,
  MEDIUM_RSS_URL: process.env.MEDIUM_RSS_URL,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  PROFILE_LINKEDIN_URL: process.env.PROFILE_LINKEDIN_URL,
  PROFILE_X_URL: process.env.PROFILE_X_URL,
  PROFILE_DEVTO_URL: process.env.PROFILE_DEVTO_URL,
  PROFILE_MEDIUM_URL: process.env.PROFILE_MEDIUM_URL,
  RESUME_URL: process.env.RESUME_URL,
})
