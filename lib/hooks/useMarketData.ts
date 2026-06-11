import useSWR from 'swr'

interface Signal {
  id: string
  symbol: string
  name: string
  signal_type: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  entry_price: number
  target_price: number
  stop_loss: number
  risk_reward: number
  timeframe: string
  change_percent: number
  created_at: string
}

interface MarketData {
  id: string
  symbol: string
  current_price: number
  high_price: number
  low_price: number
  open_price: number
  volume: number
  market_cap: number
  pe_ratio: number
  change_percent: number
  updated_at: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useSignals() {
  const { data, error, isLoading } = useSWR<{ signals: Signal[] }>(
    '/api/market/signals',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  return {
    signals: data?.signals || [],
    isLoading,
    error,
    isError: !!error,
  }
}

export function useMarketData(symbol?: string) {
  const url = symbol ? `/api/market/data?symbol=${symbol}` : '/api/market/data'
  
  const { data, error, isLoading } = useSWR<{ data: MarketData[] }>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000,
    }
  )

  return {
    marketData: data?.data || [],
    isLoading,
    error,
    isError: !!error,
  }
}

export function useWatchlist() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/watchlist',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    watchlist: data?.watchlist || [],
    isLoading,
    error,
    mutate,
  }
}

export function useSavedSignals() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/saved-signals',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    savedSignals: data?.signals || [],
    isLoading,
    error,
    mutate,
  }
}
