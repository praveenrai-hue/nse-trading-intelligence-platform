/**
 * Tests for app/api/health/route.ts
 */

import { GET } from '@/app/api/health/route'

describe('app/api/health/route', () => {
  describe('GET', () => {
    it('returns 200 status', async () => {
      const response = await GET()
      expect(response.status).toBe(200)
    })

    it('returns healthy status', async () => {
      const response = await GET()
      const body = await response.json()
      expect(body.status).toBe('healthy')
    })

    it('returns a valid ISO timestamp', async () => {
      const response = await GET()
      const body = await response.json()
      expect(body.timestamp).toBeDefined()
      const date = new Date(body.timestamp)
      expect(date.toISOString()).toBe(body.timestamp)
    })

    it('returns uptime as a number', async () => {
      const response = await GET()
      const body = await response.json()
      expect(typeof body.uptime).toBe('number')
      expect(body.uptime).toBeGreaterThanOrEqual(0)
    })

    it('returns version string', async () => {
      const response = await GET()
      const body = await response.json()
      expect(body.version).toBe('1.0.0')
    })

    it('returns service name', async () => {
      const response = await GET()
      const body = await response.json()
      expect(body.service).toBe('NSE Trading Intelligence Platform')
    })
  })
})
