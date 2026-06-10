'use client'

import { TrendingUp } from 'lucide-react'

export function MarketSentiment() {
  const sentimentScore = 75
  const sentimentLabel = 'Bullish'
  const vix = 18.5

  return (
    <div className="rounded-lg border bg-background p-6">
      <h3 className="mb-6 font-semibold text-foreground">Market Sentiment</h3>
      
      {/* Sentiment Gauge */}
      <div className="mb-8">
        <div className="relative h-2 overflow-hidden rounded-full bg-secondary/20">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-primary transition-all"
            style={{ width: `${sentimentScore}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Bearish</span>
          <span className="text-sm text-muted-foreground">Bullish</span>
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-6 rounded-lg bg-secondary/10 p-4">
        <p className="text-sm text-muted-foreground">Current Sentiment</p>
        <p className="mt-1 text-2xl font-bold text-green-400">{sentimentLabel}</p>
        <p className="mt-1 text-sm font-medium text-foreground">Score: {sentimentScore}/100</p>
      </div>

      {/* VIX */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">India VIX</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{vix}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-400" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Lower VIX indicates market confidence
        </p>
      </div>

      {/* Market Indicators */}
      <div className="mt-6 border-t pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Market Breadth</span>
          <span className="text-sm font-medium text-green-400">+2:1 Advance/Decline</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">FII Flow</span>
          <span className="text-sm font-medium text-green-400">+₹2,450 Cr</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Sector Leaders</span>
          <span className="text-sm font-medium text-green-400">IT, Pharma, Banking</span>
        </div>
      </div>
    </div>
  )
}
