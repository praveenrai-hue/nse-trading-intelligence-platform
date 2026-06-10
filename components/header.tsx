'use client'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <span className="text-xl font-bold text-primary">NSE Intel</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/signals" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Signals
          </Link>
          <Link href="/screener" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Screener
          </Link>
          <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Analytics
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-blue-400 transition-colors"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex md:hidden flex-col gap-1.5"
          >
            <div className="h-0.5 w-5 bg-foreground" />
            <div className="h-0.5 w-5 bg-foreground" />
            <div className="h-0.5 w-5 bg-foreground" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/signals" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Signals
            </Link>
            <Link href="/screener" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Screener
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Analytics
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
