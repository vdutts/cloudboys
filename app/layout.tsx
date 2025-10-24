import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Geist, Geist_Mono, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: "Who Controls The Internet? | Cloud Infrastructure Visualization",
  description: "The Big 3 cloud providers control 81% of major companies. When AWS goes down, Netflix, Reddit, and Slack go with it. Interactive visualization showing cloud dependencies.",
  generator: "v0.app",
  metadataBase: new URL('https://cloudboys.vercel.app'),
  keywords: ['cloud computing', 'AWS', 'Azure', 'GCP', 'infrastructure', 'data visualization', 'v0', 'vercel'],
  authors: [{ name: 'vdutts7', url: 'https://x.com/vdutts7' }],
  creator: 'vdutts7',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cloudboys.vercel.app',
    title: 'Who Controls The Internet?',
    description: 'The Big 3 cloud providers control 81% of major companies. Interactive visualization showing which cloud provider powers your favorite services.',
    siteName: 'Who Controls The Internet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cloud Infrastructure Dependencies Visualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who Controls The Internet?',
    description: 'The Big 3 cloud providers control 81% of major companies. When AWS goes down, Netflix, Reddit, and Slack go with it.',
    creator: '@vdutts7',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
