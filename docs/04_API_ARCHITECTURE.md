# API Architecture
## NSE Trading Intelligence Platform - Complete API Specification

---

## 1. API Overview

**Total Endpoints:** 100+
**API Version:** v1
**Base URL:** https://api.nse-trading-intelligence.com/api/v1
**Authentication:** Firebase JWT + API Keys
**Rate Limit:** 100 requests/minute per user
**Response Format:** JSON

---

## 2. Authentication Endpoints

### POST /auth/register
Register new user
```
Request: { email, password, full_name }
Response: { user_id, email, token }
```

### POST /auth/login
Login with credentials
```
Request: { email, password }
Response: { user_id, token, refresh_token }
```

### POST /auth/google-login
Google OAuth login
```
Request: { google_id_token }
Response: { user_id, token }
```

### GET /auth/me
Get current user info
```
Response: { user_id, email, subscription_plan }
```

---

## 3. Market Data Endpoints

### GET /market/indices
Get Nifty and Bank Nifty data
```
Response: { nifty, banknifty, vix }
```

### GET /market/stock/:symbol
Get stock price data
```
Response: { price, change, volume, pe_ratio }
```

### GET /market/chart/:symbol?timeframe=1h
Get OHLCV data
```
Response: [{ time, open, high, low, close, volume }]
```

### GET /market/breadth
Get market breadth
```
Response: { advances, declines, bullish_pct }
```

### GET /market/vix
Get VIX data
```
Response: { level, change, interpretation }
```

### GET /market/sectors
Get sector performance
```
Response: [{ sector, change_pct, top_gainer }]
```

---

## 4. Options Endpoints

### GET /options/:symbol/chain
Get option chain
```
Response: [{ strike, call_oi, put_oi, call_price }]
```

### GET /options/:symbol/greeks
Get Greeks for all strikes
```
Response: [{ strike, delta, gamma, theta, vega }]
```

### GET /options/:symbol/pcr
Get Put-Call Ratio
```
Response: { pcr_oi, pcr_volume, sentiment }
```

### GET /options/:symbol/max-pain
Get Max Pain level
```
Response: { max_pain_level, direction }
```

### GET /options/:symbol/oi-analysis
Get OI analysis
```
Response: { oi_change_pct, buildup_type }
```

---

## 5. Signal Endpoints

### GET /signals?type=stock&limit=50
Get live signals
```
Response: [{ signal_id, asset, entry, targets, confidence }]
```

### GET /signals/:signal_id
Get signal details
```
Response: { signal_id, reasoning, confidence, agents }
```

### GET /signals/history
Get historical signals
```
Response: [{ signal_id, created_at, result_status }]
```

### POST /signals/:signal_id/track-result
Track signal result
```
Request: { actual_entry, actual_exit }
Response: { signal_id, profit_loss }
```

### GET /signals/performance
Get signal performance
```
Response: { win_rate, accuracy, sharpe_ratio }
```

---

## 6. Analytics Endpoints

### GET /analytics/performance
Get overall performance
```
Response: { total_signals, win_rate, profit_factor }
```

### GET /analytics/by-signal-type
Performance by signal type
```
Response: { stock, options, index }
```

### GET /analytics/by-timeframe
Performance by timeframe
```
Response: { intraday, swing, positional }
```

---

## 7. Screener Endpoints

### GET /screener/momentum
Get momentum stocks
```
Response: [{ symbol, price, rsi, score }]
```

### GET /screener/breakout
Get breakout candidates
```
Response: [{ symbol, resistance_level, score }]
```

### GET /screener/swing
Get swing setups
```
Response: [{ symbol, support_level, risk_reward }]
```

### POST /screener/custom
Create custom screen
```
Request: { name, criteria }
Response: { screen_id, results }
```

---

## 8. User Endpoints

### GET /user/profile
Get user profile
```
Response: { email, subscription_plan }
```

### GET /user/watchlist
Get watchlist
```
Response: [{ symbol, price, change_pct }]
```

### POST /user/watchlist
Add to watchlist
```
Request: { symbol }
Response: { watchlist_id }
```

### GET /user/alerts
Get alerts
```
Response: [{ alert_id, asset, trigger }]
```

### POST /user/alerts
Create alert
```
Request: { symbol, trigger_price }
Response: { alert_id }
```

---

## 9. Subscription Endpoints

### GET /subscription/plans
Get subscription plans
```
Response: [{ plan_id, name, price, features }]
```

### GET /subscription/current
Get current subscription
```
Response: { plan_name, renewal_date }
```

### POST /subscription/upgrade
Upgrade plan
```
Request: { new_plan_id }
Response: { subscription_id }
```

---

## 10. Admin Endpoints

### GET /admin/users
Get all users (Admin only)
```
Response: [{ user_id, email, subscription_plan }]
```

### GET /admin/signals/performance
Get signal performance (Admin only)
```
Response: { total_signals, win_rate }
```

### GET /admin/revenue/metrics
Get revenue metrics (Admin only)
```
Response: { mrr, arr, churn_rate }
```

---

## 11. WebSocket Endpoints

### WS /ws/market-data
Real-time market data
```
Message: { type: "subscribe", symbols: ["TCS"] }
Response: { symbol, price, change }
```

### WS /ws/signals
Real-time signals
```
Response: { signal_id, asset, entry }
```

### WS /ws/options-chain
Real-time options updates
```
Response: { contract, price, iv, greeks }
```

---

## 12. Error Handling

```json
{
  "error": "error_code",
  "message": "Human readable message",
  "timestamp": "2024-06-10T10:30:00Z"
}
```

Status Codes: 400, 401, 403, 404, 429, 500, 503

---

**Document Version:** 1.0
**Last Updated:** June 2026
