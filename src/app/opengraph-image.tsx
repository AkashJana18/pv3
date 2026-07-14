import { ImageResponse } from "next/og"

import { portfolioConfig } from "@/config/portfolio"

export const alt = "Akash Jana — Rust Engineer and Solana Developer"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#09090b",
        color: "#fafafa",
        padding: "72px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 28,
          color: "#a1a1aa",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            border: "1px solid #3f3f46",
            borderRadius: 16,
            color: "#fafafa",
            fontWeight: 700,
          }}
        >
          AJ
        </div>
        {portfolioConfig.person.role}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 86,
            letterSpacing: "-0.06em",
            lineHeight: 0.95,
          }}
        >
          {portfolioConfig.person.name}
        </h1>
        <p
          style={{
            maxWidth: 830,
            margin: "32px 0 0",
            fontSize: 34,
            lineHeight: 1.28,
            color: "#d4d4d8",
          }}
        >
          {portfolioConfig.person.summary}
        </p>
      </div>
    </div>,
    size
  )
}
