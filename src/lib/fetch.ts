type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

const DEFAULT_TIMEOUT_MS = 8_000

/**
 * Keeps build-time and request-time external integrations from holding up the
 * portfolio when an upstream API or RSS feed becomes unresponsive.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: NextFetchInit,
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}
