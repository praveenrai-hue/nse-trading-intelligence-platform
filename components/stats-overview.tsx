'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

const stats = [
  {
    label: 'Total Signals Today',
    value: '24',
    change: '+5 from yesterday',
    positive: true,
  },
  {
    label: 'Win Rate (7 Days)',
    value: '62%',
    change: '+2.5% from last week',
    positive: true,
  },
  {
    label: 'Active Watchlist',
    value: '42',
    change: '+8 new stocks',
    positive: true,
  },
  {
    label: 'Portfolio Return',
    value: '+12.4%',
    change: 'YTD performance',
    positive: true,
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="rounded-lg border bg-background p-6">
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          <p className={`mt-2 flex items-center gap-1 text-sm ${
            stat.positive ? 'text-green-400' : 'text-red-400'
          }`}>
            {stat.positive ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  )
}
