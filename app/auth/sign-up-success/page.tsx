import Link from 'next/link'
import { CheckCircle, TrendingUp } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-primary">NSE Intel</span>
        </Link>

        {/* Success Message */}
        <div className="rounded-lg border bg-background p-8">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="mb-2 text-2xl font-bold text-foreground">Account Created!</h1>
          <p className="mb-6 text-muted-foreground">
            Please check your email to confirm your account before signing in.
          </p>

          <Link
            href="/login"
            className="inline-block w-full rounded-lg bg-primary px-4 py-2 font-semibold text-black hover:bg-blue-400 transition-colors"
          >
            Go to Login
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Didn&apos;t receive email?</strong><br />
            Check your spam folder or try signing up again with a different email address.
          </p>
        </div>
      </div>
    </div>
  )
}
