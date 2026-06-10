'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Live Signals', href: '/signals', icon: TrendingUp },
  { label: 'Stock Screener', href: '/screener', icon: BarChart3 },
  { label: 'AI Assistant', href: '/assistant', icon: Brain },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden border-r bg-secondary/5 transition-all duration-200 md:block ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="font-bold text-primary">NSE Intel</span>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-1.5 hover:bg-secondary/20"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-black'
                    : 'text-muted-foreground hover:bg-secondary/20'
                }`}
              >
                <Icon className="h-5 w-5" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/20 transition-colors">
            <Settings className="h-5 w-5" />
            {isOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary/20 transition-colors">
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <nav className="flex justify-around">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
