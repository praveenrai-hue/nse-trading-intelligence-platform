'use client'

import { ArrowUp, ArrowDown, Clock } from 'lucide-react'

const signals = [
  {
    symbol: 'RELIANCE',
    signal: 'BUY',
    confidence: 88,
    timeAgo: '2 mins ago',
    target: '₹3250',
    stopLoss: '₹3100',
    change: '+2.5%',
  },
  {
    symbol: 'TCS',
    signal: 'SELL',
    confidence: 75,
    timeAgo: '15 mins ago',
    target: '₹3800',
    stopLoss: '₹3950',
    change: '-1.2%',
  },
  {
    symbol: 'INFY',
    signal: 'BUY',
    confidence: 82,
    timeAgo: '28 mins ago',
    target: '₹2150',
    stopLoss: '₹2050',
    change: '+3.1%',
  },
]

export function RecentSignals() {
  return (
    <div className="rounded-lg border bg-background">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Trading Signals</h3>
      </div>
      <div className="divide-y">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-center justify-between p-6 hover:bg-secondary/5 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-foreground">{signal.symbol}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {signal.timeAgo}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-semibold text-foreground">{signal.target}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="font-semibold text-foreground">{signal.confidence}%</p>
              </div>
              <div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  signal.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                  signal.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {signal.signal}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
