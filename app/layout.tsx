import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "DSPDiagnosis - AI-Powered DSPD Detection",
  description: "Advanced genetic analysis for Delayed Sleep Phase Disorder detection using machine learning",
  generator: "DSPDiagnosis",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
