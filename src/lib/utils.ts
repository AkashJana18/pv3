import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const absoluteUrl = (path = "/") => {
  const url = new URL(path, process.env.SITE_URL ?? "https://akashjana.dev")

  return url.toString()
}

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))

export const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer noopener",
} as const
