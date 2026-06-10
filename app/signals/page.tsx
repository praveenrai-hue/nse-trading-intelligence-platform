import { Sidebar } from '@/components/sidebar'
import { SignalsTable } from '@/components/signals-table'
import { Filter } from 'lucide-react'

export default function SignalsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="space-y-8 p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Live Trading Signals
            </h1>
            <p className="mt-2 text-muted-foreground">
              Real-time AI-generated trading signals with confidence scoring
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {['All', 'BUY', 'SELL', 'HOLD', 'High Confidence'].map((filter) => (
              <button
                key={filter}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Filter className="h-4 w-4" />
                {filter}
              </button>
            ))}
          </div>

          {/* Signals Table */}
          <SignalsTable />
        </div>
      </main>
    </div>
  )
}
