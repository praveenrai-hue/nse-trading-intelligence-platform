# Quick Start Guide - NSE Trading Intelligence Platform

## 🚀 Start Development in 60 Seconds

### 1. Install Dependencies (30 seconds)
```bash
cd nse-trading-intelligence-platform
npm install
```

### 2. Run Development Server (10 seconds)
```bash
npm run dev
```

### 3. Open in Browser (20 seconds)
Navigate to: **http://localhost:3000**

---

## 📺 What You'll See

### Landing Page (Home)
- Hero section with trading platform overview
- 6 key features highlighted
- Live dashboard preview with charts
- Pricing plans section
- Call-to-action buttons

### Dashboard
- Real-time market overview (NIFTY, BANK NIFTY, VIX)
- Live trading signals with confidence scores
- Market sentiment indicator
- Portfolio statistics
- Quick action buttons

### Live Signals
- Comprehensive table of all trading signals
- Filters for signal type (BUY/SELL/HOLD)
- Risk-reward calculations
- Real-time price changes
- Multi-agent confidence display

### Stock Screener
- Advanced filters (Market Cap, Price, Volume, etc.)
- Momentum and relative strength analysis
- 50+ screened stocks with metrics
- Watchlist management
- Breakout detection

### AI Assistant
- Chat interface for trading questions
- Suggested questions
- Real-time responses
- Trading education

### Auth Pages
- Login page with email/password
- Sign-up page with validation
- Social login buttons

---

## 📁 File Structure Quick Reference

```
project/
├── app/                     # Main app pages & routes
│   ├── page.tsx            # Home page
│   ├── dashboard/          # /dashboard route
│   ├── signals/            # /signals route
│   ├── screener/           # /screener route
│   ├── assistant/          # /assistant route
│   ├── login/              # /login route
│   ├── signup/             # /signup route
│   ├── api/                # Backend APIs
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
│
├── components/              # Reusable React components
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── signals-table.tsx
│   ├── screener-table.tsx
│   └── ... (15+ more)
│
├── lib/                     # Utilities
│   ├── utils.ts            # Helper functions
│   └── api.ts              # API client
│
├── public/                  # Static files
├── docs/                    # Full documentation
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎯 Common Development Tasks

### Add a New Page
1. Create folder in `app/` (e.g., `app/new-page`)
2. Add `page.tsx` file
3. Export React component as default
4. Access at `http://localhost:3000/new-page`

Example:
```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return <h1>New Page</h1>
}
```

### Add a New Component
1. Create file in `components/` (e.g., `components/my-component.tsx`)
2. Create React component with `'use client'` for interactive features
3. Export component
4. Import in your pages

Example:
```tsx
// components/my-component.tsx
'use client'

export function MyComponent() {
  return <div>My Component</div>
}
```

### Add an API Route
1. Create `app/api/[endpoint]/route.ts`
2. Export GET/POST/PUT/DELETE functions
3. Access at `http://localhost:3000/api/[endpoint]`

Example:
```tsx
// app/api/my-endpoint/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}
```

### Style Components
Use Tailwind CSS classes:
```tsx
<div className="flex items-center justify-between p-4 rounded-lg border bg-background">
  <h1 className="text-2xl font-bold text-foreground">Title</h1>
  <button className="bg-primary text-black px-4 py-2 rounded-lg hover:bg-blue-400">
    Click me
  </button>
</div>
```

### Use Utility Functions
```tsx
import { formatCurrency, calculateRiskReward } from '@/lib/utils'

const price = formatCurrency(3500)          // ₹3,500.00
const rr = calculateRiskReward(3175, 3250, 3100)  // 2.5
```

### Make API Calls
```tsx
import { getSignals, getScreenerResults } from '@/lib/api'

// In a component or page
const { data: signals } = await getSignals()
const { data: stocks } = await getScreenerResults({ 
  marketCap: 'Large Cap'
})
```

---

## 🎨 Customization Guide

### Change Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  primary: '#00d4ff',        // Cyan
  secondary: '#1e3a5f',      // Navy
  accent: '#ff6b35',         // Orange
  background: '#0f1419',     // Dark
  foreground: '#ffffff',     // White
}
```

### Change Fonts
Edit `app/layout.tsx`:
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return <html className={inter.className}>...</html>
}
```

### Add Images
1. Place images in `public/` folder
2. Reference in code: `<img src="/image.png" alt="Description" />`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
```bash
# Build the app
npm run build

# Start production server
npm start
```

---

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Create optimized build
npm start           # Start production server

# Quality
npm run lint        # Run ESLint
npm run test        # Run Jest tests
npm run test:watch  # Watch mode for tests
```

---

## 🔍 Debugging Tips

### Check the Console
- Browser console for client-side errors
- Terminal for server-side errors
- Network tab for API issues

### Use Console Logs
```tsx
console.log('[v0] Debug message:', variable)
```

### Enable TypeScript Checking
Your IDE should show TypeScript errors automatically.

---

## 📚 Learning Resources

| Topic | Resource |
|-------|----------|
| Next.js | https://nextjs.org/docs |
| React | https://react.dev |
| Tailwind CSS | https://tailwindcss.com |
| TypeScript | https://www.typescriptlang.org |
| Recharts | https://recharts.org |

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Run on different port
npm run dev -- -p 3001
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clean Next.js cache
rm -rf .next
npm run build
```

---

## 📞 Need Help?

1. Check `SETUP.md` for detailed installation
2. Review `/docs` folder for comprehensive guides
3. Read code comments for implementation details
4. Check `COMPLETE_APPLICATION.md` for features overview

---

**Happy Coding! 🎉**

Start with `npm run dev` and explore the application!
