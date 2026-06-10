'use client'

import { Search } from 'lucide-react'

export function ScreenerFilters() {
  return (
    <div className="rounded-lg border bg-background p-6">
      <h3 className="mb-4 font-semibold text-foreground">Filter Criteria</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Market Cap */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Market Cap</label>
          <select className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground outline-none focus:border-primary transition-colors">
            <option>All</option>
            <option>Large Cap</option>
            <option>Mid Cap</option>
            <option>Small Cap</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
          <input
            type="text"
            placeholder="100-500"
            className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Volume {`(>)`}</label>
          <select className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground outline-none focus:border-primary transition-colors">
            <option>Any</option>
            <option>1 Lac</option>
            <option>5 Lac</option>
            <option>10 Lac</option>
          </select>
        </div>

        {/* Momentum */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Momentum</label>
          <select className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground outline-none focus:border-primary transition-colors">
            <option>All</option>
            <option>Bullish</option>
            <option>Neutral</option>
            <option>Bearish</option>
          </select>
        </div>

        {/* PE Ratio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">PE Ratio</label>
          <input
            type="text"
            placeholder="10-30"
            className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Relative Strength */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">RS Rating</label>
          <select className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground outline-none focus:border-primary transition-colors">
            <option>All</option>
            <option>90+</option>
            <option>70-90</option>
            <option>50-70</option>
          </select>
        </div>

        {/* Breakout Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Breakout Type</label>
          <select className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground outline-none focus:border-primary transition-colors">
            <option>All</option>
            <option>52W High</option>
            <option>Resistance</option>
            <option>Moving Avg</option>
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sector</label>
          <select className="w-full rounded-lg border border-border bg-secondary/20 px-3 py-2 text-foreground outline-none focus:border-primary transition-colors">
            <option>All</option>
            <option>IT</option>
            <option>Banking</option>
            <option>Pharma</option>
            <option>Energy</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-blue-400 transition-colors">
          <Search className="h-4 w-4" />
          Search
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
          Clear Filters
        </button>
      </div>
    </div>
  )
}
