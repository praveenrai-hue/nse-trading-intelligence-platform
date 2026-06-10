# UI/UX Design System
## NSE Trading Intelligence Platform - Complete Design Guide

---

## 1. Design Philosophy

- **Premium Professional:** Inspired by Bloomberg Terminal, TradingView
- **Dark Mode First:** With light mode option
- **Minimal, Clean:** Focus on data clarity
- **Responsive:** Mobile-first design
- **Accessibility:** WCAG 2.1 AA compliant

---

## 2. Color Palette

### Primary Colors
- **Primary Blue:** #1E40AF (Interactive elements, CTA)
- **Success Green:** #10B981 (Bullish signals, gains)
- **Danger Red:** #EF4444 (Bearish signals, losses)
- **Warning Yellow:** #F59E0B (Alerts, attention)

### Neutral Colors
- **Dark BG:** #0F172A (Dark mode background)
- **Dark Surface:** #1E293B (Dark mode surface)
- **Light Text:** #F8FAFC (Dark mode text)
- **Light BG:** #FFFFFF (Light mode background)
- **Light Surface:** #F1F5F9 (Light mode surface)
- **Dark Text:** #0F172A (Light mode text)

### Chart Colors
- **Bullish Candle:** #10B981 (Green)
- **Bearish Candle:** #EF4444 (Red)
- **Volume:** #3B82F6 (Blue)

---

## 3. Typography

### Font Family
- **Primary:** Inter (sans-serif)
- **Code:** JetBrains Mono (monospace)

### Font Sizes
- **H1:** 32px, 700 weight (Page titles)
- **H2:** 24px, 700 weight (Section titles)
- **H3:** 18px, 600 weight (Subsection titles)
- **Body:** 14px, 400 weight (Regular text)
- **Small:** 12px, 400 weight (Labels, captions)
- **XSmall:** 11px, 400 weight (Help text)

---

## 4. Component Library (ShadCN UI)

### Core Components Used
- Button (primary, secondary, danger, outline)
- Input (text, number, search)
- Select (dropdown)
- Badge (status indicators)
- Card (content containers)
- Modal/Dialog (overlays)
- Tabs (navigation)
- Sidebar (navigation menu)
- Popover (hover tooltips)
- Skeleton (loading states)

---

## 5. Page Designs

### 5.1 Home Page Layout

```
┌─────────────────────────────────────────┐
│ Header (Logo, Search, Notifications)    │
├─────────────────────────────────────────┤
│ Hero Section                            │
│ Market Status | Nifty | BankNifty | VIX │
├─────────────────────────────────────────┤
│ Market Overview Grid (4 columns)        │
│ • Index Performance                     │
│ • Market Breadth                        │
│ • FII/DII Flow                          │
│ • Sector Performance                    │
├─────────────────────────────────────────┤
│ Top Signals Section (8-10 signals)      │
│ • Signal Card Grid                      │
├─────────────────────────────────────────┤
│ Trending Analysis                       │
│ • Trending stocks, discussions          │
├─────────────────────────────────────────┤
│ CTA Section (Subscribe, Free Trial)     │
└─────────────────────────────────────────┘
```

### 5.2 Dashboard Layout

```
┌─────────────────────────────────────────┐
│ Header                                  │
├────────┬────────────────────────────────┤
│Sidebar │ Main Content Area              │
│ Menu   │ ┌──────────────────────────┐   │
│        │ │ Nifty Chart (Large)      │   │
│ • Dash │ │                          │   │
│ • Sig  │ │ (Timeframe Selector)     │   │
│ • Opt  │ └──────────────────────────┘   │
│ • Scr  │ ┌──────────┬──────────────┐    │
│ • Scan │ │Key Levels│Options Data  │    │
│ • Ana  │ │Support/R │PCR, Max Pain │    │
│        │ └──────────┴──────────────┘    │
│        │ ┌──────────────────────────┐   │
│        │ │Tech Indicators           │   │
│        │ │(RSI, MACD, etc)          │   │
│        │ └──────────────────────────┘   │
└────────┴────────────────────────────────┘
```

### 5.3 Signals Page

```
┌─────────────────────────────────────────┐
│ Filters Bar (Type, Timeframe, Conf)     │
├─────────────────────────────────────────┤
│ Signal Cards (3 columns on desktop)     │
│ ┌────────────────┐ ┌─────────────────┐ │
│ │ Stock Signal   │ │ Options Signal  │ │
│ │ Entry: 100     │ │ Strike: 23000C  │ │
│ │ SL: 95         │ │ Exp: 20-Jun     │ │
│ │ T1: 110        │ │ Entry: 50       │ │
│ │ Conf: 75%      │ │ Conf: 68%       │ │
│ │ [View Details] │ │ [View Details]  │ │
│ └────────────────┘ └─────────────────┘ │
│         [More Signals...]               │
└─────────────────────────────────────────┘
```

### 5.4 Option Chain Analyzer

```
┌─────────────────────────────────────────┐
│ Expiry Selector | Symbol                │
├─────────────────────────────────────────┤
│ Option Chain Table                      │
│ ┌─────────────────────────────────────┐ │
│ │Call│OI │IV │Delta│Price│Put│OI│IV  │ │
│ ├─────────────────────────────────────┤ │
│ │... │... │..│...  │...  │... │..│..  │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ PCR Analysis | Max Pain Level           │
├─────────────────────────────────────────┤
│ Greeks Visualization                    │
└─────────────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

- **Mobile:** 320px - 640px
- **Tablet:** 641px - 1024px
- **Desktop:** 1025px - 1440px
- **Large Desktop:** 1441px+

---

## 7. Interactive Elements

### Buttons
- **Primary CTA:** Blue, full width on mobile
- **Secondary:** Outlined style
- **Danger:** Red for destructive actions
- **Hover states:** 10% color darkening

### Charts
- **Interactive:** Hover tooltips
- **Zoom:** Click to zoom into timeframe
- **Crosshair:** Following mouse movement
- **Legend:** Click to toggle indicators

### Cards
- **Hover Effect:** Subtle shadow increase
- **Click Action:** Pointer cursor
- **Loading:** Skeleton loaders
- **Empty State:** Centered message

---

## 8. Dark Mode Implementation

```css
/* Using Tailwind's dark mode */
[data-theme="dark"] {
  background: #0F172A;
  color: #F8FAFC;
}

[data-theme="light"] {
  background: #FFFFFF;
  color: #0F172A;
}
```

---

## 9. Accessibility Features

- **Keyboard Navigation:** Full keyboard support
- **Screen Readers:** ARIA labels on all interactive elements
- **Color Contrast:** 4.5:1 minimum for text
- **Focus Indicators:** Clear focus rings
- **Mobile:** Thumb-friendly touch targets (48px min)

---

## 10. Loading & Error States

### Loading State
- Skeleton screens with pulsing animation
- Spinner with loading text
- Progress indication

### Error State
- Red border on input
- Error message below field
- Retry button for failed API calls
- Toast notifications

### Empty State
- Centered illustration
- Descriptive message
- CTA to create/add content

---

**Document Version:** 1.0
**Last Updated:** June 2026
