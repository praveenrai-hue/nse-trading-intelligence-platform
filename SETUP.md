# NSE Trading Intelligence Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or later
- npm, yarn, or pnpm package manager
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/praveenrai-hue/nse-trading-intelligence-platform.git
   cd nse-trading-intelligence-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys:
   - OPENAI_API_KEY
   - GOOGLE_API_KEY
   - NSE_DATA_API_KEY
   - DATABASE_URL (if using database)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
nse-trading-intelligence-platform/
├── app/
│   ├── api/                    # API routes
│   │   ├── signals/           # Trading signals API
│   │   ├── screener/          # Stock screener API
│   │   └── health/            # Health check API
│   ├── dashboard/             # Dashboard pages
│   ├── signals/               # Live signals page
│   ├── screener/              # Stock screener page
│   ├── assistant/             # AI assistant page
│   ├── login/                 # Login page
│   ├── signup/                # Sign up page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                # Reusable React components
│   ├── header.tsx             # Navigation header
│   ├── hero.tsx               # Hero section
│   ├── features.tsx           # Features section
│   ├── pricing.tsx            # Pricing section
│   ├── dashboard.tsx          # Dashboard component
│   ├── footer.tsx             # Footer
│   ├── sidebar.tsx            # Dashboard sidebar
│   ├── signals-table.tsx      # Signals table
│   ├── screener-table.tsx     # Screener table
│   └── chat-interface.tsx     # AI chat interface
├── lib/
│   ├── utils.ts               # Utility functions
│   └── api.ts                 # API client
├── public/                    # Static assets
├── docs/                      # Detailed documentation
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

---

## 🎯 Features

### Current Implementation (Phase 1 MVP)
- ✅ Responsive landing page
- ✅ Real-time dashboard
- ✅ Live trading signals
- ✅ Stock screener with filters
- ✅ AI assistant chat interface
- ✅ Market sentiment tracking
- ✅ Authentication pages (UI only)
- ✅ API route structure

### Coming Soon (Phase 2)
- 🔄 Database integration (PostgreSQL/Supabase)
- 🔄 Real authentication system
- 🔄 Options chain analyzer
- 🔄 Advanced analytics
- 🔄 Subscription management
- 🔄 API access control

### Coming Soon (Phase 3)
- 🔄 Institutional features
- 🔄 Custom data feeds
- 🔄 Compliance tools
- 🔄 White-label options

---

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm run test

# Watch tests
npm run test:watch
```

---

## 🎨 Customization

### Colors & Theming
Edit `app/globals.css` to change the color scheme:
```css
:root {
  --background: #0f1419;
  --foreground: #ffffff;
  --primary: #00d4ff;
  --secondary: #1e3a5f;
  --accent: #ff6b35;
  ...
}
```

### Components
All components are in the `components/` directory and can be modified independently.

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:
- `01_COMPLETE_PRD.md` - Product requirements
- `02_SYSTEM_ARCHITECTURE.md` - System architecture
- `03_DATABASE_DESIGN.md` - Database schema
- `04_API_ARCHITECTURE.md` - API endpoints
- `05_FOLDER_STRUCTURE.md` - Project structure
- And more...

---

## 🔐 Security

- Never commit `.env.local` file
- Keep API keys secure
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting for APIs

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
- AWS Amplify
- Netlify
- Railway
- Heroku

---

## 📞 Support & Contact

For issues or questions:
- Create an issue on GitHub
- Check documentation in `docs/` folder
- Refer to the PRD for feature details

---

## 📄 License

Private - All rights reserved. Commercial use restricted.

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Version:** 1.0.0  
**Last Updated:** June 2026  
**Status:** Ready for Development
