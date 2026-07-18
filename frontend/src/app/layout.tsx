import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NSE Smart Money Scanner",
  description: "NSE option-chain intelligence + smart-money structure analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold text-lg">
                NSE <span className="text-emerald-400">Smart Money</span> Scanner
              </Link>
              <span className="text-xs text-slate-400">Options + Price Action Intelligence</span>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
