'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="font-bold text-white text-xl">NSE Trading</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-slate-800">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Trading Intelligence
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> for NSE Markets</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Advanced analytics, institutional-grade signals, and real-time market intelligence powered by 7 specialized AI agents.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Real-time Dashboard',
              description: 'Live Nifty & Bank Nifty charts with real-time signals feed',
              icon: '📊'
            },
            {
              title: 'Options Analytics',
              description: 'Advanced Greeks analysis, PCR, Max Pain, and IV tracking',
              icon: '📈'
            },
            {
              title: 'Stock Screener',
              description: '25+ screening criteria for momentum and breakout detection',
              icon: '🔍'
            },
            {
              title: 'AI Chat Assistant',
              description: 'Natural language processing for signal explanations',
              icon: '🤖'
            },
            {
              title: 'Market Sentiment',
              description: 'VIX tracking, FII/DII flow, and sector rotation analysis',
              icon: '📡'
            },
            {
              title: 'Signal Generator',
              description: 'Multi-timeframe analysis with confidence scoring',
              icon: '⚡'
            },
          ].map((feature, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Basic',
              price: '₹199',
              period: '/month',
              features: ['Real-time stock signals', 'Basic option chain', 'Stock screener', 'Email support']
            },
            {
              name: 'Professional',
              price: '₹999',
              period: '/month',
              features: ['Everything in Basic', 'AI Chat Assistant', 'Advanced analytics', 'Priority support', 'API access'],
              highlighted: true
            },
            {
              name: 'Institutional',
              price: 'Custom',
              period: 'pricing',
              features: ['Everything in Pro', 'Dedicated manager', 'Custom data feeds', 'White-label options', 'Unlimited API']
            },
          ].map((plan, i) => (
            <Card key={i} className={`border-2 p-8 ${
              plan.highlighted 
                ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500' 
                : 'bg-slate-800/50 border-slate-700'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-300 text-sm ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="text-slate-300 flex items-start">
                    <span className="text-purple-400 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${
                plan.highlighted
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}>
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-white">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Follow</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-white">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 NSE Trading Intelligence. All rights reserved.</p>
            <p className="mt-2">⚠️ <strong>Disclaimer:</strong> This platform provides analysis and trading signals only. Not SEBI-registered investment advice. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
