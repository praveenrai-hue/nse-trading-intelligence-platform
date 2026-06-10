'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border bg-secondary/50 px-4 py-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="ml-2 text-sm font-medium text-primary">
              AI-Powered Trading Intelligence
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tighter text-foreground sm:text-6xl">
            Institutional-Grade Trading Signals
          </h1>

          {/* Description */}
          <p className="mb-8 text-balance text-lg text-muted-foreground">
            Advanced multi-agent AI system analyzing NSE markets in real-time. Get high-confidence trading signals, options analytics, and institutional flow intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-black hover:bg-blue-400 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center rounded-lg border border-primary px-6 py-3 text-base font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              View Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">Trusted by 1000+ traders and fund managers</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                ⭐⭐⭐⭐⭐ (428 reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
