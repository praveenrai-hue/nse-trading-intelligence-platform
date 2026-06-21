import { generateSignal, NSE_STOCKS, StockQuote } from '@/lib/finnhub'

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('lib/finnhub', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateSignal', () => {
    const baseQuote: StockQuote = {
      symbol: 'RELIANCE.NS',
      name: 'Reliance Industries',
      currentPrice: 3000,
      openPrice: 2950,
      highPrice: 3050,
      lowPrice: 2930,
      previousClose: 2900,
      change: 100,
      changePercent: 0,
      volume: 1000000,
    }

    it('returns SELL signal when changePercent > 3', () => {
      const quote = { ...baseQuote, changePercent: 5 }
      const signal = generateSignal(quote)
      expect(signal.type).toBe('SELL')
      expect(signal.reason).toContain('Strong upward momentum')
    })

    it('returns BUY signal when changePercent < -3', () => {
      const quote = { ...baseQuote, changePercent: -4 }
      const signal = generateSignal(quote)
      expect(signal.type).toBe('BUY')
      expect(signal.reason).toContain('Strong downward momentum')
    })

    it('returns HOLD signal when changePercent between 1 and 3', () => {
      const quote = { ...baseQuote, changePercent: 2 }
      const signal = generateSignal(quote)
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(75)
      expect(signal.reason).toContain('Positive momentum')
    })

    it('returns HOLD signal when changePercent between -3 and -1', () => {
      const quote = { ...baseQuote, changePercent: -2 }
      const signal = generateSignal(quote)
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(70)
      expect(signal.reason).toContain('Negative momentum')
    })

    it('returns HOLD with low confidence when changePercent is near 0', () => {
      const quote = { ...baseQuote, changePercent: 0.5 }
      const signal = generateSignal(quote)
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(65)
      expect(signal.reason).toContain('No clear trend')
    })

    it('caps confidence at 95 for extreme moves', () => {
      const quote = { ...baseQuote, changePercent: 30 }
      const signal = generateSignal(quote)
      expect(signal.confidence).toBe(95)
    })

    it('caps BUY confidence at 95 for extreme negative moves', () => {
      const quote = { ...baseQuote, changePercent: -30 }
      const signal = generateSignal(quote)
      expect(signal.confidence).toBe(95)
    })

    it('calculates confidence based on magnitude for SELL', () => {
      const quote = { ...baseQuote, changePercent: 5 }
      const signal = generateSignal(quote)
      // confidence = Math.min(95, 70 + Math.abs(5)) = 75
      expect(signal.confidence).toBe(75)
    })

    it('calculates confidence based on magnitude for BUY', () => {
      const quote = { ...baseQuote, changePercent: -10 }
      const signal = generateSignal(quote)
      // confidence = Math.min(95, 70 + Math.abs(-10)) = 80
      expect(signal.confidence).toBe(80)
    })

    it('boundary: changePercent exactly 3 returns HOLD', () => {
      const quote = { ...baseQuote, changePercent: 3 }
      const signal = generateSignal(quote)
      // 3 is not > 3, so it falls to 3 > 1 → HOLD with confidence 75
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(75)
    })

    it('boundary: changePercent exactly -3 returns HOLD', () => {
      const quote = { ...baseQuote, changePercent: -3 }
      const signal = generateSignal(quote)
      // -3 is not < -3, so it falls to -3 < -1 → HOLD with confidence 70
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(70)
    })

    it('boundary: changePercent exactly 1 returns HOLD with low confidence', () => {
      const quote = { ...baseQuote, changePercent: 1 }
      const signal = generateSignal(quote)
      // 1 is not > 1, falls through to default
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(65)
    })

    it('boundary: changePercent exactly -1 returns HOLD with low confidence', () => {
      const quote = { ...baseQuote, changePercent: -1 }
      const signal = generateSignal(quote)
      // -1 is not < -1, falls through to default
      expect(signal.type).toBe('HOLD')
      expect(signal.confidence).toBe(65)
    })
  })

  describe('getStockQuote', () => {
    it('returns parsed quote on successful fetch', async () => {
      const { getStockQuote } = await import('@/lib/finnhub')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          c: 3000,  // current
          o: 2950,  // open
          h: 3050,  // high
          l: 2930,  // low
          pc: 2900, // previous close
          v: 1000000,
        }),
      })

      const result = await getStockQuote('RELIANCE.NS')

      expect(result).not.toBeNull()
      expect(result!.symbol).toBe('RELIANCE.NS')
      expect(result!.currentPrice).toBe(3000)
      expect(result!.openPrice).toBe(2950)
      expect(result!.highPrice).toBe(3050)
      expect(result!.lowPrice).toBe(2930)
      expect(result!.previousClose).toBe(2900)
      expect(result!.volume).toBe(1000000)
      expect(result!.change).toBe(100)  // 3000 - 2900
      expect(result!.changePercent).toBeCloseTo(3.448, 2)  // (100/2900)*100
    })

    it('returns null when fetch response is not ok', async () => {
      const { getStockQuote } = await import('@/lib/finnhub')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Rate Limited',
      })

      const result = await getStockQuote('RELIANCE.NS')
      expect(result).toBeNull()
    })

    it('returns null when fetch throws an error', async () => {
      const { getStockQuote } = await import('@/lib/finnhub')

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await getStockQuote('RELIANCE.NS')
      expect(result).toBeNull()
    })

    it('handles missing data fields gracefully with defaults', async () => {
      const { getStockQuote } = await import('@/lib/finnhub')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // empty response
      })

      const result = await getStockQuote('UNKNOWN.NS')
      expect(result).not.toBeNull()
      expect(result!.currentPrice).toBe(0)
      expect(result!.openPrice).toBe(0)
      expect(result!.volume).toBe(0)
    })
  })

  describe('getCompanyProfile', () => {
    it('returns parsed profile on successful fetch', async () => {
      const { getCompanyProfile } = await import('@/lib/finnhub')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Reliance Industries',
          country: 'India',
          marketCapitalization: 15000000,
          pe: 22.5,
        }),
      })

      const result = await getCompanyProfile('RELIANCE.NS')
      expect(result).not.toBeNull()
      expect(result!.symbol).toBe('RELIANCE.NS')
      expect(result!.name).toBe('Reliance Industries')
      expect(result!.country).toBe('India')
      expect(result!.marketCapitalization).toBe(15000000)
      expect(result!.pe).toBe(22.5)
    })

    it('returns null when fetch response is not ok', async () => {
      const { getCompanyProfile } = await import('@/lib/finnhub')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })

      const result = await getCompanyProfile('INVALID')
      expect(result).toBeNull()
    })

    it('returns null when fetch throws', async () => {
      const { getCompanyProfile } = await import('@/lib/finnhub')

      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const result = await getCompanyProfile('RELIANCE.NS')
      expect(result).toBeNull()
    })

    it('uses defaults for missing profile fields', async () => {
      const { getCompanyProfile } = await import('@/lib/finnhub')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await getCompanyProfile('UNKNOWN.NS')
      expect(result).not.toBeNull()
      expect(result!.name).toBe('UNKNOWN.NS') // falls back to symbol
      expect(result!.country).toBe('India')   // default
    })
  })

  describe('NSE_STOCKS', () => {
    it('contains expected number of stocks', () => {
      expect(NSE_STOCKS.length).toBe(10)
    })

    it('each stock has symbol and name', () => {
      for (const stock of NSE_STOCKS) {
        expect(stock.symbol).toBeDefined()
        expect(stock.name).toBeDefined()
        expect(stock.symbol.endsWith('.NS')).toBe(true)
      }
    })

    it('contains major NSE stocks', () => {
      const symbols = NSE_STOCKS.map(s => s.symbol)
      expect(symbols).toContain('RELIANCE.NS')
      expect(symbols).toContain('TCS.NS')
      expect(symbols).toContain('INFY.NS')
      expect(symbols).toContain('HDFCBANK.NS')
    })
  })
})
