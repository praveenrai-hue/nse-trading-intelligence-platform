import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NSE Trading Intelligence Platform',
  description: 'AI-Powered Institutional-Grade Trading Analytics & Signal Generation',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
