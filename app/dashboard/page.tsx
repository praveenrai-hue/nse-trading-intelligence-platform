import { StatsOverview } from '@/components/stats-overview'
import { RecentSignals } from '@/components/recent-signals'
import { MarketSentiment } from '@/components/market-sentiment'
import { QuickActions } from '@/components/quick-actions'

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here&apos;s your trading overview for today.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Signals */}
        <div className="lg:col-span-2">
          <RecentSignals />
        </div>

        {/* Market Sentiment */}
        <div>
          <MarketSentiment />
        </div>
      </div>
    </div>
  )
}
