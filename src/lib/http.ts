export type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 4500,
  fetcher: Fetcher = fetch
) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetcher(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

export function safeHttpUrl(value: string | null | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null
  } catch {
    return null
  }
}
