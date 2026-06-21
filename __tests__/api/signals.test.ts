/**
 * Tests for app/api/signals/route.ts
 *
 * This route uses mock data (no external dependencies) so we can test
 * the handler logic directly.
 */

import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/signals/route'

describe('app/api/signals/route', () => {
  describe('GET', () => {
    it('returns a successful response with signals', async () => {
      const response = await GET()
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data).toBeDefined()
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.count).toBe(body.data.length)
    })

    it('returns signals with expected fields', async () => {
      const response = await GET()
      const body = await response.json()
      const signal = body.data[0]

      expect(signal).toHaveProperty('id')
      expect(signal).toHaveProperty('symbol')
      expect(signal).toHaveProperty('signal')
      expect(signal).toHaveProperty('confidence')
      expect(signal).toHaveProperty('target')
      expect(signal).toHaveProperty('stopLoss')
      expect(signal).toHaveProperty('entry')
      expect(signal).toHaveProperty('timeframe')
      expect(signal).toHaveProperty('riskReward')
    })

    it('returns signals with valid signal types', async () => {
      const response = await GET()
      const body = await response.json()

      for (const signal of body.data) {
        expect(['BUY', 'SELL', 'HOLD']).toContain(signal.signal)
      }
    })

    it('returns signals with confidence between 0 and 100', async () => {
      const response = await GET()
      const body = await response.json()

      for (const signal of body.data) {
        expect(signal.confidence).toBeGreaterThanOrEqual(0)
        expect(signal.confidence).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('POST', () => {
    it('creates a signal with valid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/signals', {
        method: 'POST',
        body: JSON.stringify({
          symbol: 'RELIANCE',
          signal: 'BUY',
          confidence: 85,
          entry: 3175,
          target: 3250,
          stopLoss: 3100,
        }),
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.data).toBeDefined()
      expect(body.data.symbol).toBe('RELIANCE')
      expect(body.data.signal).toBe('BUY')
      expect(body.data.id).toBeDefined()
      expect(body.data.timestamp).toBeDefined()
    })

    it('returns 400 when symbol is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/signals', {
        method: 'POST',
        body: JSON.stringify({
          signal: 'BUY',
          confidence: 85,
        }),
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.error).toBe('Missing required fields')
    })

    it('returns 400 when signal type is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/signals', {
        method: 'POST',
        body: JSON.stringify({
          symbol: 'RELIANCE',
          confidence: 85,
        }),
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.error).toBe('Missing required fields')
    })

    it('returns 400 when both symbol and signal are missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/signals', {
        method: 'POST',
        body: JSON.stringify({ confidence: 85 }),
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
    })

    it('preserves all provided fields in the created signal', async () => {
      const signalData = {
        symbol: 'TCS',
        signal: 'SELL',
        confidence: 75,
        entry: 3875,
        target: 3800,
        stopLoss: 3950,
        timeframe: '4H',
      }

      const request = new NextRequest('http://localhost:3000/api/signals', {
        method: 'POST',
        body: JSON.stringify(signalData),
      })

      const response = await POST(request)
      const body = await response.json()

      expect(body.data.symbol).toBe('TCS')
      expect(body.data.signal).toBe('SELL')
      expect(body.data.confidence).toBe(75)
      expect(body.data.entry).toBe(3875)
      expect(body.data.timeframe).toBe('4H')
    })
  })
})
