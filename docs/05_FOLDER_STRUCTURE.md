# Project Folder Structure
## NSE Trading Intelligence Platform - Complete Directory Layout

---

## Root Directory Structure

```
nse-trading-intelligence-platform/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
├── .env.example
├── .env.local (git ignored)
├── jest.config.js
│
├── docs/                           # Documentation
│   ├── 01_COMPLETE_PRD.md
│   ├── 02_SYSTEM_ARCHITECTURE.md
│   ├── 03_DATABASE_DESIGN.md
│   ├── 04_API_ARCHITECTURE.md
│   ├── 05_FOLDER_STRUCTURE.md
│   ├── 06_UI_UX_DESIGN.md
│   ├── 07_AI_ARCHITECTURE.md
│   ├── 08_DATA_PIPELINE.md
│   ├── 09_DEVELOPMENT_ROADMAP.md
│   ├── 10_DEPLOYMENT_STRATEGY.md
│   ├── 11_SECURITY_FRAMEWORK.md
│   ├── 12_SCALABILITY_FRAMEWORK.md
│   ├── 13_USER_JOURNEY_MAPS.md
│   ├── 14_TECHNICAL_DOCUMENTATION.md
│   ├── 15_REVENUE_MODEL.md
│   ├── 16_COST_ESTIMATION.md
│   └── 17_IMPLEMENTATION_GUIDE.md
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   ├── globals.css             # Global styles
│   │   │
│   │   ├── (auth)/                 # Auth routes (grouped)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/            # Dashboard routes (grouped)
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx        # Dashboard main
│   │   │   │   ├── nifty/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── banknifty/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── breadth/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── sectors/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── signals/
│   │   │   │   ├── page.tsx        # Live signals
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Signal details
│   │   │   │   └── history/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── options/
│   │   │   │   ├── page.tsx        # Option chain analyzer
│   │   │   │   └── [symbol]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── screener/
│   │   │   │   ├── page.tsx        # Stock screener main
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Screen results
│   │   │   │
│   │   │   ├── scanners/
│   │   │   │   ├── page.tsx        # Scanners hub
│   │   │   │   ├── oi-buildup/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── volume/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── breakout/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── futures/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── smartmoney/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx        # Analytics hub
│   │   │   │   ├── performance/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── ai-metrics/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   └── page.tsx        # AI Chat Assistant
│   │   │   │
│   │   │   ├── watchlist/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx          # Dashboard layout (header, sidebar)
│   │   │
│   │   ├── (admin)/                # Admin routes (grouped)
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx        # Admin dashboard
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── signals/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── revenue/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── system/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   └── (requires auth)
│   │   │
│   │   └── api/                    # API Routes
│   │       ├── auth/
│   │       │   ├── route.ts
│   │       │   ├── login/
│   │       │   │   └── route.ts
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   ├── logout/
│   │       │   │   └── route.ts
│   │       │   ├── me/
│   │       │   │   └── route.ts
│   │       │   └── refresh-token/
│   │       │       └── route.ts
│   │       │
│   │       ├── market/
│   │       │   ├── indices/
│   │       │   │   └── route.ts
│   │       │   ├── stock/
│   │       │   │   └── route.ts
│   │       │   ├── chart/
│   │       │   │   └── route.ts
│   │       │   ├── breadth/
│   │       │   │   └── route.ts
│   │       │   ├── vix/
│   │       │   │   └── route.ts
│   │       │   └── sectors/
│   │       │       └── route.ts
│   │       │
│   │       ├── options/
│   │       │   ├── chain/
│   │       │   │   └── route.ts
│   │       │   ├── greeks/
│   │       │   │   └── route.ts
│   │       │   ├── pcr/
│   │       │   │   └── route.ts
│   │       │   ├── maxpain/
│   │       │   │   └── route.ts
│   │       │   └── oi-analysis/
│   │       │       └── route.ts
│   │       │
│   │       ├── signals/
│   │       │   ├── route.ts
│   │       │   ├── [id]/
│   │       │   │   └── route.ts
│   │       │   ├── history/
│   │       │   │   └── route.ts
│   │       │   ├── track-result/
│   │       │   │   └── route.ts
│   │       │   └── performance/
│   │       │       └── route.ts
│   │       │
│   │       ├── analytics/
│   │       │   ├── performance/
│   │       │   │   └── route.ts
│   │       │   ├── by-type/
│   │       │   │   └── route.ts
│   │       │   └── by-timeframe/
│   │       │       └── route.ts
│   │       │
│   │       ├── screener/
│   │       │   ├── momentum/
│   │       │   │   └── route.ts
│   │       │   ├── breakout/
│   │       │   │   └── route.ts
│   │       │   ├── swing/
│   │       │   │   └── route.ts
│   │       │   └── custom/
│   │       │       └── route.ts
│   │       │
│   │       ├── user/
│   │       │   ├── profile/
│   │       │   │   └── route.ts
│   │       │   ├── watchlist/
│   │       │   │   └── route.ts
│   │       │   ├── alerts/
│   │       │   │   └── route.ts
│   │       │   └── preferences/
│   │       │       └── route.ts
│   │       │
│   │       ├── subscription/
│   │       │   ├── plans/
│   │       │   │   └── route.ts
│   │       │   ├── current/
│   │       │   │   └── route.ts
│   │       │   ├── upgrade/
│   │       │   │   └── route.ts
│   │       │   └── webhooks/
│   │       │       └── route.ts
│   │       │
│   │       ├── admin/
│   │       │   ├── users/
│   │       │   │   └── route.ts
│   │       │   ├── signals/
│   │       │   │   └── route.ts
│   │       │   └── revenue/
│   │       │       └── route.ts
│   │       │
│   │       └── webhooks/
│   │           ├── stripe/
│   │           │   └── route.ts
│   │           └── razorpay/
│   │               └── route.ts
│   │
│   ├── components/                 # React Components
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Loader.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── MarketOverview.tsx
│   │   │   ├── SignalsFeed.tsx
│   │   │   ├── MarketChart.tsx
│   │   │   ├── KeyLevels.tsx
│   │   │   └── TechnicalIndicators.tsx
│   │   │
│   │   ├── options/
│   │   │   ├── OptionChain.tsx
│   │   │   ├── GreeksDisplay.tsx
│   │   │   ├── PCRAnalysis.tsx
│   │   │   ├── MaxPain.tsx
│   │   │   └── OIAnalysis.tsx
│   │   │
│   │   ├── signals/
│   │   │   ├── SignalCard.tsx
│   │   │   ├── SignalDetails.tsx
│   │   │   ├── SignalPerformance.tsx
│   │   │   └── SignalHistory.tsx
│   │   │
│   │   ├── screener/
│   │   │   ├── ScreenerForm.tsx
│   │   │   ├── ScreenResults.tsx
│   │   │   └── ScreenerFilters.tsx
│   │   │
│   │   ├── scanners/
│   │   │   ├── OIBuildupScanner.tsx
│   │   │   ├── VolumeScanner.tsx
│   │   │   ├── BreakoutScanner.tsx
│   │   │   ├── FuturesScanner.tsx
│   │   │   └── SmartMoneyScanner.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── TradingChart.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   └── SentimentChart.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── AlertForm.tsx
│   │   │   └── PreferencesForm.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── Tooltip.tsx
│   │       ├── Badge.tsx
│   │       └── Card.tsx
│   │
│   ├── lib/                        # Utility Functions
│   │   ├── api.ts                  # API client
│   │   ├── auth.ts                 # Authentication helpers
│   │   ├── websocket.ts            # WebSocket client
│   │   ├── cache.ts                # Caching utilities
│   │   ├── validation.ts           # Input validation
│   │   ├── formatting.ts           # Data formatting
│   │   ├── calculations.ts         # Trading calculations
│   │   └── storage.ts              # Local storage helpers
│   │
│   ├── hooks/                      # React Hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useMarketData.ts        # Market data hook
│   │   ├── useSignals.ts           # Signals hook
│   │   ├── useOptions.ts           # Options hook
│   │   ├── useScreener.ts          # Screener hook
│   │   └── useWebSocket.ts         # WebSocket hook
│   │
│   ├── store/                      # Zustand Store
│   │   ├── authStore.ts
│   │   ├── marketStore.ts
│   │   ├── signalStore.ts
│   │   ├── optionsStore.ts
│   │   ├── uiStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── types/                      # TypeScript Types
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── market.ts
│   │   ├── signals.ts
│   │   ├── options.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── constants/                  # Constants
│   │   ├── index.ts
│   │   ├── apiEndpoints.ts
│   │   ├── limits.ts
│   │   └── defaults.ts
│   │
│   └── styles/                     # Stylesheets
│       ├── globals.css
│       ├── variables.css
│       └── animations.css
│
├── server/                         # Backend Services (Optional - if not using Next.js API only)
│   ├── src/
│   │   ├── index.ts                # Server entry point
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── logging.ts
│   │   │
│   │   ├── services/
│   │   │   ├── marketDataService.ts
│   │   │   ├── optionsService.ts
│   │   │   ├── signalService.ts
│   │   │   ├── aiService.ts
│   │   │   ├── screeningService.ts
│   │   │   ├── analyticsService.ts
│   │   │   ├── userService.ts
│   │   │   ├── subscriptionService.ts
│   │   │   └── emailService.ts
│   │   │
│   │   ├── agents/                 # Multi-Agent AI System
│   │   │   ├── marketStructureAgent.ts
│   │   │   ├── optionsFlowAgent.ts
│   │   │   ├── institutionalActivityAgent.ts
│   │   │   ├── stockSelectionAgent.ts
│   │   │   ├── riskManagementAgent.ts
│   │   │   ├── sentimentAgent.ts
│   │   │   └── masterDecisionEngine.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── technicalAnalysis.ts
│   │   │   ├── optionsAnalysis.ts
│   │   │   ├── volumeAnalysis.ts
│   │   │   ├── sentimentAnalysis.ts
│   │   │   └── performanceTracking.ts
│   │   │
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── signal.ts
│   │   │   ├── market.ts
│   │   │   ├── options.ts
│   │   │   ├── subscription.ts
│   │   │   └── analyticsModel.ts
│   │   │
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   ├── prisma.ts
│   │   │   ├── queries/
│   │   │   │   ├── userQueries.ts
│   │   │   │   ├── signalQueries.ts
│   │   │   │   ├── marketQueries.ts
│   │   │   │   └── subscriptionQueries.ts
│   │   │   └── migrations/
│   │   │       └── [migration files]
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── validators.ts
│   │   │   ├── helpers.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├─�� firebase.ts
│   │   │   ├── openai.ts
│   │   │   ├── redis.ts
│   │   │   └── payment.ts
│   │   │
│   │   ├── jobs/                   # Background Jobs
│   │   │   ├── dataRefreshJob.ts
│   │   │   ├── signalGenerationJob.ts
│   │   │   ├── analyticsUpdateJob.ts
│   │   │   ├── notificationJob.ts
│   │   │   └── cleanupJob.ts
│   │   │
│   │   └── websocket/
│   │       ├── handlers.ts
│   │       ├── events.ts
│   │       └── subscriptions.ts
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   │
│   └── .env.server
│
├── public/                         # Static Assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── icons/
│   │   └── illustrations/
│   ├── fonts/
│   └── data/
│
├── tests/                          # Tests
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── mocks/
│
├── scripts/
│   ├── setup.sh
│   ├── seed-data.sh
│   ├── migrate-db.sh
│   └── deploy.sh
│
├── infrastructure/                 # DevOps & Infrastructure
│   ├── docker-compose.yml
│   ├── docker/
│   │   └── Dockerfile
│   ├── kubernetes/
│   │   └── k8s-manifests.yml
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── scripts/
│       ├── deploy.sh
│       └── monitoring.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI Pipeline
│       ├── cd.yml                  # CD Pipeline
│       └── tests.yml               # Test Pipeline
│
└── .gitignore

```

---

## Key Directory Purposes

- **src/app/** - Next.js App Router pages and layouts
- **src/components/** - Reusable React components
- **src/lib/** - Utility functions and helpers
- **src/hooks/** - Custom React hooks
- **src/store/** - Global state management (Zustand)
- **src/types/** - TypeScript type definitions
- **server/src/agents/** - Multi-agent AI system
- **server/src/services/** - Business logic services
- **server/src/database/** - Database layer
- **infrastructure/** - DevOps and deployment configs
- **tests/** - Test suites

---

**Document Version:** 1.0
**Last Updated:** June 2026
