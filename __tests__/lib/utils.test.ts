import {
  formatCurrency,
  formatPercent,
  formatNumber,
  calculateRiskReward,
  calculateChange,
  formatTimeAgo,
  isValidEmail,
  isValidSymbol,
} from '@/lib/utils'

describe('lib/utils', () => {
  describe('formatCurrency', () => {
    it('formats a number with default INR currency symbol', () => {
      expect(formatCurrency(1234.5)).toBe('₹1,234.50')
    })

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('₹0.00')
    })

    it('formats large numbers with Indian locale grouping', () => {
      const result = formatCurrency(1000000)
      expect(result).toContain('₹')
      expect(result).toContain('10,00,000.00')
    })

    it('accepts a custom currency symbol', () => {
      expect(formatCurrency(100, '$')).toBe('$100.00')
    })

    it('formats negative values', () => {
      const result = formatCurrency(-500)
      expect(result).toContain('500.00')
    })
  })

  describe('formatPercent', () => {
    it('formats a percentage with default 2 decimal places', () => {
      expect(formatPercent(12.345)).toBe('12.35%')
    })

    it('formats with 0 decimal places', () => {
      expect(formatPercent(12.345, 0)).toBe('12%')
    })

    it('formats negative percentages', () => {
      expect(formatPercent(-3.5)).toBe('-3.50%')
    })

    it('formats zero', () => {
      expect(formatPercent(0)).toBe('0.00%')
    })
  })

  describe('formatNumber', () => {
    it('formats millions with M suffix', () => {
      expect(formatNumber(1500000)).toBe('1.5M')
    })

    it('formats exact millions', () => {
      expect(formatNumber(1000000)).toBe('1.0M')
    })

    it('formats thousands with K suffix', () => {
      expect(formatNumber(5000)).toBe('5.0K')
    })

    it('formats exact thousands', () => {
      expect(formatNumber(1000)).toBe('1.0K')
    })

    it('returns raw number as string for values below 1000', () => {
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(42)).toBe('42')
    })
  })

  describe('calculateRiskReward', () => {
    it('calculates correct risk-reward for a long trade', () => {
      // Entry 100, Target 110, StopLoss 95
      // Risk = |100 - 95| = 5, Reward = |110 - 100| = 10
      expect(calculateRiskReward(100, 110, 95)).toBe(2.0)
    })

    it('calculates correct risk-reward for a short trade', () => {
      // Entry 100, Target 90, StopLoss 105
      // Risk = |100 - 105| = 5, Reward = |90 - 100| = 10
      expect(calculateRiskReward(100, 90, 105)).toBe(2.0)
    })

    it('returns 0 when stop loss equals entry (zero risk)', () => {
      expect(calculateRiskReward(100, 110, 100)).toBe(0)
    })

    it('handles fractional values', () => {
      // Entry 50.5, Target 55.5, StopLoss 48.5
      // Risk = 2, Reward = 5
      expect(calculateRiskReward(50.5, 55.5, 48.5)).toBe(2.5)
    })
  })

  describe('calculateChange', () => {
    it('calculates positive percentage change', () => {
      expect(calculateChange(110, 100)).toBe(10.0)
    })

    it('calculates negative percentage change', () => {
      expect(calculateChange(90, 100)).toBe(-10.0)
    })

    it('returns 0 when previous price is 0', () => {
      expect(calculateChange(100, 0)).toBe(0)
    })

    it('returns 0 when no change', () => {
      expect(calculateChange(100, 100)).toBe(0)
    })

    it('handles fractional changes', () => {
      expect(calculateChange(101.5, 100)).toBe(1.5)
    })
  })

  describe('formatTimeAgo', () => {
    it('returns "Just now" for less than 60 seconds', () => {
      const date = new Date(Date.now() - 30000) // 30 seconds ago
      expect(formatTimeAgo(date)).toBe('Just now')
    })

    it('returns minutes ago for less than an hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      expect(formatTimeAgo(date)).toBe('5m ago')
    })

    it('returns hours ago for less than a day', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      expect(formatTimeAgo(date)).toBe('3h ago')
    })

    it('returns days ago for more than a day', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      expect(formatTimeAgo(date)).toBe('2d ago')
    })
  })

  describe('isValidEmail', () => {
    it('returns true for a valid email', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
    })

    it('returns true for email with subdomain', () => {
      expect(isValidEmail('user@mail.example.co.in')).toBe(true)
    })

    it('returns false for empty string', () => {
      expect(isValidEmail('')).toBe(false)
    })

    it('returns false for missing @', () => {
      expect(isValidEmail('userexample.com')).toBe(false)
    })

    it('returns false for missing domain', () => {
      expect(isValidEmail('user@')).toBe(false)
    })

    it('returns false for string with spaces', () => {
      expect(isValidEmail('user @example.com')).toBe(false)
    })
  })

  describe('isValidSymbol', () => {
    it('returns true for valid uppercase symbols', () => {
      expect(isValidSymbol('RELIANCE')).toBe(true)
      expect(isValidSymbol('TCS')).toBe(true)
      expect(isValidSymbol('INFY')).toBe(true)
    })

    it('returns true for symbols with numbers', () => {
      expect(isValidSymbol('M&M')).toBe(true)
    })

    it('returns true for symbols with hyphens', () => {
      expect(isValidSymbol('BAJAJ-FIN')).toBe(true)
    })

    it('returns false for lowercase symbols', () => {
      expect(isValidSymbol('reliance')).toBe(false)
    })

    it('returns false for symbols longer than 10 chars', () => {
      expect(isValidSymbol('TOOLONGSYMBOL')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidSymbol('')).toBe(false)
    })

    it('returns false for symbols with special characters', () => {
      expect(isValidSymbol('REL@IANCE')).toBe(false)
    })
  })
})
