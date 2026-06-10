import { Sidebar } from '@/components/sidebar'
import { ScreenerTable } from '@/components/screener-table'
import { ScreenerFilters } from '@/components/screener-filters'

export default function ScreenerPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="space-y-8 p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Stock Screener
            </h1>
            <p className="mt-2 text-muted-foreground">
              Advanced screening with 25+ criteria - Find momentum stocks and breakout candidates
            </p>
          </div>

          {/* Screener Filters */}
          <ScreenerFilters />

          {/* Results Table */}
          <ScreenerTable />
        </div>
      </main>
    </div>
  )
}
