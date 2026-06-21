const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

function ensureApiKey(): string {
  if (!FINNHUB_API_KEY) {
    throw new Error('[Finnhub] FINNHUB_API_KEY environment variable is not set')
  }
  return FINNHUB_API_KEY
}

export interface StockQuote {
  symbol: string
  name: string
  currentPrice: number
  openPrice: number
  highPrice: number
  lowPrice: number
  previousClose: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  peRatio?: number
}

export interface CompanyProfile {
  symbol: string
  name: string
  country: string
  marketCapitalization?: number
  pe?: number
}

/**
 * Fetch real-time stock quote from Finnhub
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const apiKey = ensureApiKey()
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${apiKey}`
    )

    if (!response.ok) {
      const body = await response.text()
      console.error(`[Finnhub] Failed to fetch quote for ${symbol}: ${response.status} ${response.statusText}`, body)
      return null
    }

    const data = await response.json()

    if (data.c === undefined || data.c === null) {
      console.warn(`[Finnhub] No price data returned for ${symbol}`, data)
      return null
    }

    return {
      symbol,
      name: symbol,
      currentPrice: data.c || 0,
      openPrice: data.o || 0,
      highPrice: data.h || 0,
      lowPrice: data.l || 0,
      previousClose: data.pc || 0,
      change: (data.c || 0) - (data.pc || 0),
      changePercent: ((data.c || 0) - (data.pc || 0)) / (data.pc || 1) * 100,
      volume: data.v || 0,
    }
  } catch (error) {
    console.error(`[Finnhub] Error fetching quote for ${symbol}:`, error instanceof Error ? error.message : error)
    return null
  }
}

/**
 * Fetch company profile from Finnhub
 */
export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  try {
    const apiKey = ensureApiKey()
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${apiKey}`
    )

    if (!response.ok) {
      const body = await response.text()
      console.error(`[Finnhub] Failed to fetch profile for ${symbol}: ${response.status} ${response.statusText}`, body)
      return null
    }

    const data = await response.json()

    return {
      symbol,
      name: data.name || symbol,
      country: data.country || 'India',
      marketCapitalization: data.marketCapitalization,
      pe: data.pe,
    }
  } catch (error) {
    console.error(`[Finnhub] Error fetching profile for ${symbol}:`, error instanceof Error ? error.message : error)
    return null
  }
}

/**
 * Generate trading signal based on stock data
 */
export function generateSignal(quote: StockQuote): {
  type: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reason: string
} {
  const changePercent = quote.changePercent

  // Simple signal generation logic
  if (changePercent > 3) {
    return {
      type: 'SELL',
      confidence: Math.min(95, 70 + Math.abs(changePercent)),
      reason: 'Strong upward momentum - potential reversal',
    }
  } else if (changePercent < -3) {
    return {
      type: 'BUY',
      confidence: Math.min(95, 70 + Math.abs(changePercent)),
      reason: 'Strong downward momentum - potential recovery',
    }
  } else if (changePercent > 1) {
    return {
      type: 'HOLD',
      confidence: 75,
      reason: 'Positive momentum but consolidating',
    }
  } else if (changePercent < -1) {
    return {
      type: 'HOLD',
      confidence: 70,
      reason: 'Negative momentum but stabilizing',
    }
  }

  return {
    type: 'HOLD',
    confidence: 65,
    reason: 'No clear trend, wait for breakout',
  }
}

/**
 * Get list of popular NSE stocks
 */
export const NSE_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
  { symbol: 'INFY.NS', name: 'Infosys' },
  { symbol: 'WIPRO.NS', name: 'Wipro' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro' },
]
