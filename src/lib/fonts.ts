import localFont from "next/font/local"

import { cn } from "@/lib/utils"

const geistSans = localFont({
  src: [
    {
      path: "../assets/fonts/Geist-Medium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Geist-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-geist-sans",
  fallback: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
})

const geistMono = localFont({
  src: [
    {
      path: "../assets/fonts/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-geist-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
})

export const fontVariables = cn(
  geistSans.variable,
  geistMono.variable,
  "[--font-sans:var(--font-geist-sans)]",
  "[--font-mono:var(--font-geist-mono)]"
)
