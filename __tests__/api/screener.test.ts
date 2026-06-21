/**
 * Tests for app/api/screener/route.ts
 */

import { NextRequest } from 'next/server'
import { GET } from '@/app/api/screener/route'

describe('app/api/screener/route', () => {
  describe('GET', () => {
    it('returns a successful response with stock data', async () => {
      const request = new NextRequest('http://localhost:3000/api/screener')
      const response = await GET(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data).toBeDefined()
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.count).toBe(body.data.length)
    })

    it('returns stocks with expected fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/screener')
      const response = await GET(request)
      const body = await response.json()
      const stock = body.data[0]

      expect(stock).toHaveProperty('id')
      expect(stock).toHaveProperty('symbol')
      expect(stock).toHaveProperty('price')
      expect(stock).toHaveProperty('change')
      expect(stock).toHaveProperty('volume')
      expect(stock).toHaveProperty('pe')
      expect(stock).toHaveProperty('momentum')
      expect(stock).toHaveProperty('rs')
      expect(stock).toHaveProperty('breakout')
    })

    it('returns filter information in response', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/screener?marketCap=large&momentum=Bullish'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.filters).toBeDefined()
      expect(body.filters.marketCap).toBe('large')
      expect(body.filters.momentum).toBe('Bullish')
    })

    it('handles request without filters', async () => {
      const request = new NextRequest('http://localhost:3000/api/screener')
      const response = await GET(request)
      const body = await response.json()

      expect(body.filters).toBeDefined()
      expect(body.filters.marketCap).toBeNull()
      expect(body.filters.priceRange).toBeNull()
      expect(body.filters.momentum).toBeNull()
    })

    it('returns valid momentum values', async () => {
      const request = new NextRequest('http://localhost:3000/api/screener')
      const response = await GET(request)
      const body = await response.json()

      for (const stock of body.data) {
        expect(['Bullish', 'Bearish', 'Neutral']).toContain(stock.momentum)
      }
    })

    it('returns numeric price and volume values', async () => {
      const request = new NextRequest('http://localhost:3000/api/screener')
      const response = await GET(request)
      const body = await response.json()

      for (const stock of body.data) {
        expect(typeof stock.price).toBe('number')
        expect(typeof stock.volume).toBe('number')
        expect(typeof stock.pe).toBe('number')
        expect(typeof stock.rs).toBe('number')
        expect(stock.price).toBeGreaterThan(0)
        expect(stock.volume).toBeGreaterThan(0)
      }
    })

    it('returns priceRange filter from query params', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/screener?priceRange=1000-5000'
      )
      const response = await GET(request)
      const body = await response.json()

      expect(body.filters.priceRange).toBe('1000-5000')
    })
  })
})
