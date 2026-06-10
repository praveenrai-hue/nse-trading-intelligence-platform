import Link from 'next/link'
import { TrendingUp, Check } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-primary">NSE Intel</span>
        </Link>

        {/* Form */}
        <div className="rounded-lg border bg-background p-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mb-6 text-muted-foreground">
            Start your free 7-day trial today
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border border-border bg-secondary/20 px-4 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-secondary/20 px-4 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-secondary/20 px-4 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                At least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience Level</label>
              <select className="w-full rounded-lg border border-border bg-secondary/20 px-4 py-2 text-foreground outline-none focus:border-primary transition-colors">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Professional</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-blue-400">
                  Terms of Service
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-black hover:bg-blue-400 transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-blue-400 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <h3 className="mb-3 font-semibold text-foreground">Free Trial Includes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Live trading signals
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Option chain analyzer
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Stock screener
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Dashboard access
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
