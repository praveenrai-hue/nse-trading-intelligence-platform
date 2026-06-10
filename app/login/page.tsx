import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
          <h1 className="mb-2 text-2xl font-bold text-foreground">Sign In</h1>
          <p className="mb-6 text-muted-foreground">
            Access your trading dashboard and live signals
          </p>

          <form className="space-y-4">
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-border"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-black hover:bg-blue-400 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-primary hover:text-blue-400 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Social Login */}
        <div className="mt-6 space-y-3">
          <button className="w-full rounded-lg border border-border bg-secondary/5 px-4 py-2 font-medium text-foreground hover:bg-secondary/10 transition-colors">
            Sign in with Google
          </button>
          <button className="w-full rounded-lg border border-border bg-secondary/5 px-4 py-2 font-medium text-foreground hover:bg-secondary/10 transition-colors">
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  )
}
