'use client'

import { ArrowUp, ArrowDown, Star, Loader } from 'lucide-react'
import { useState } from 'react'
import { useMarketData } from '@/lib/hooks/useMarketData'

export function ScreenerTable() {
  const [favorites, setFavorites] = useState<string[]>([])
  const { marketData, isLoading, error } = useMarketData()

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-400">
        Error loading market data. Please refresh the page.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full">
        <thead className="border-b bg-secondary/5">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground"></th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Symbol</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Price</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Change</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Volume</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">P/E</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((stock) => (
            <tr key={stock.id} className="border-b hover:bg-secondary/5 transition-colors">
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleFavorite(stock.symbol)}
                  className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                >
                  <Star
                    className={`h-4 w-4 ${
                      favorites.includes(stock.symbol)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-foreground">{stock.symbol}</td>
              <td className="px-6 py-4 text-right text-sm font-medium text-foreground">₹{stock.current_price}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {stock.change_percent > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">+{stock.change_percent}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">{stock.change_percent}%</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm text-muted-foreground">{(stock.volume / 1000000).toFixed(1)}M</td>
              <td className="px-6 py-4 text-right text-sm text-foreground">{stock.pe_ratio ? stock.pe_ratio.toFixed(2) : 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {stock.market_cap ? `₹${(stock.market_cap / 1000000000).toFixed(1)}B` : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
