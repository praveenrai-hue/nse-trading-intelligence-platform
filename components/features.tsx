'use client'

import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  Zap, 
  Lock, 
  Clock 
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Live Trading Signals',
    description: 'Real-time AI-generated signals for stocks and options with confidence scoring and risk analysis.',
  },
  {
    icon: BarChart3,
    title: 'Option Chain Analyzer',
    description: 'Advanced Greeks calculation, PCR analysis, Max Pain detection, and OI buildup tracking.',
  },
  {
    icon: Brain,
    title: 'Multi-Agent AI System',
    description: '7 specialized AI agents analyzing market structure, options flow, and institutional activity.',
  },
  {
    icon: Zap,
    title: 'Stock Screener',
    description: '25+ screening criteria with momentum detection, breakout candidates, and relative strength analysis.',
  },
  {
    icon: Clock,
    title: 'Real-time Data',
    description: 'Live market data, tick-by-tick updates, and instant notifications for signal generation.',
  },
  {
    icon: Lock,
    title: 'Institutional Grade',
    description: 'Enterprise-level security, compliance tools, and dedicated support for institutional clients.',
  },
]

export function Features() {
  return (
    <section className="relative bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Powerful Features for Serious Traders
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Everything you need for institutional-grade trading analysis
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group rounded-lg border bg-secondary/5 p-6 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
