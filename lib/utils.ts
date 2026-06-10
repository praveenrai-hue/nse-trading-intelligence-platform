import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = '₹'): string {
  return `${currency}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format percentage values
 */
export function formatPercent(value: number, decimal: number = 2): string {
  return `${value.toFixed(decimal)}%`
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

/**
 * Calculate risk-reward ratio
 */
export function calculateRiskReward(entry: number, target: number, stopLoss: number): number {
  const risk = Math.abs(entry - stopLoss)
  const reward = Math.abs(target - entry)
  return risk > 0 ? Number((reward / risk).toFixed(2)) : 0
}

/**
 * Calculate percentage change
 */
export function calculateChange(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) return 0
  return Number((((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2))
}

/**
 * Format time ago
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (secondsAgo < 60) return 'Just now'
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`
  return `${Math.floor(secondsAgo / 86400)}d ago`
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate stock symbol
 */
export function isValidSymbol(symbol: string): boolean {
  return /^[A-Z0-9&-]{1,10}$/.test(symbol.trim())
}
