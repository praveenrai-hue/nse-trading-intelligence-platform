'use client'

import Link from 'next/link'
import { Plus, Search, Settings, Bell } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/signals"
        className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
      >
        <Plus className="h-4 w-4" />
        View All Signals
      </Link>
      <Link
        href="/screener"
        className="inline-flex items-center gap-2 rounded-lg border bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
      >
        <Search className="h-4 w-4" />
        Run Screener
      </Link>
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 rounded-lg border bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
      >
        <Settings className="h-4 w-4" />
        Preferences
      </Link>
      <Link
        href="/alerts"
        className="inline-flex items-center gap-2 rounded-lg border bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"
      >
        <Bell className="h-4 w-4" />
        Manage Alerts
      </Link>
    </div>
  )
}
