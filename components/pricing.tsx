'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: '₹199',
    period: '/month',
    description: 'Perfect for starting traders',
    cta: 'Start Free Trial',
    highlighted: false,
    features: [
      'Real-time stock signals',
      'Basic option chain analyzer',
      'Stock screener access',
      'Dashboard access',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '₹999',
    period: '/month',
    description: 'For serious traders',
    cta: 'Start Free Trial',
    highlighted: true,
    features: [
      'Everything in Basic',
      'Advanced analytics',
      'AI Chat Assistant',
      'Custom alerts',
      'Priority support',
      'API access (100 calls/day)',
      'Multi-timeframe analysis',
    ],
  },
  {
    name: 'Institutional',
    price: 'Custom',
    period: 'pricing',
    description: 'For institutions',
    cta: 'Contact Sales',
    highlighted: false,
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom data feeds',
      'White-label options',
      'Unlimited API calls',
      'SLA guarantee',
      'Compliance tools',
    ],
  },
]

export function Pricing() {
  return (
    <section className="relative bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Choose the perfect plan for your trading needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg border transition-all ${
                plan.highlighted
                  ? 'border-primary bg-secondary/10 ring-1 ring-primary shadow-lg'
                  : 'bg-secondary/5 border-border'
              } p-8`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-primary px-4 py-1 text-xs font-semibold text-black">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <Link
                href={plan.name === 'Institutional' ? '/contact' : '/signup'}
                className={`mb-8 block w-full rounded-lg py-2 text-center font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-primary text-black hover:bg-blue-400'
                    : 'border border-primary bg-transparent text-primary hover:bg-primary/10'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 border-t pt-16">
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
            Frequently Asked Questions
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time with no questions asked.',
              },
              {
                q: 'Do you offer refunds?',
                a: '30-day money back guarantee on annual plans. No questions asked.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, UPI, and net banking for Indian customers.',
              },
              {
                q: 'Is there a free trial?',
                a: '7-day free trial available for all plans. No credit card required.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border bg-secondary/5 p-4">
                <h4 className="mb-2 font-semibold text-foreground">{item.q}</h4>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
