# Database Design
## NSE Trading Intelligence Platform - Comprehensive Data Model

---

## 1. Database Overview

**Primary Database:** PostgreSQL (Supabase)
**Cache Layer:** Redis
**File Storage:** AWS S3

**Total Tables:** 45+
**Estimated Size (Year 1):** 100GB+
**Retention Period:** 5+ years for historical data

---

## 2. Core Database Schema

### USER MANAGEMENT TABLES

#### users
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- full_name, phone
- subscription_plan (basic, pro, premium, institutional)
- subscription_status, subscription_start_date, subscription_end_date
- account_status, email_verified, phone_verified, two_factor_enabled
- theme (dark/light), currency, language, timezone
- created_at, updated_at, last_login_at, login_count

#### user_preferences
- id, user_id (FK to users)
- preferred_timeframe, preferred_holding_period
- max_risk_per_trade, min_reward_ratio
- email_alerts_enabled, sms_alerts_enabled, push_notifications_enabled
- alert_for_signal_types, alert_frequency
- portfolio_visible_to_others, share_performance_data

---

### MARKET DATA TABLES

#### market_indices
- id, symbol (NIFTY, BANKNIFTY, SENSEX)
- current_price, previous_close, open_price, high_price, low_price
- volume, change_points, change_percent, vwap
- timestamp

#### stocks
- id, symbol (Unique), nse_code, bse_code
- company_name, sector, sub_sector
- market_cap, current_price, week_52_high, week_52_low
- pe_ratio, eps, dividend_yield, book_value, roe
- is_active, listing_date

#### stock_candles (OHLCV Data)
- id, stock_id (FK), open_price, high_price, low_price, close_price
- volume, hl2, hlc3, vwap, atr
- timeframe (1m, 5m, 15m, 1h, 4h, 1d, 1w), candle_time

#### technical_indicators
- id, candle_id (FK)
- rsi_14, rsi_21, macd_12_26, macd_signal, stochastic_k/d
- ema_9, ema_21, ema_50, ema_200, sma_20, sma_50, sma_200
- atr_14, bollinger bands, adx_14

---

### OPTIONS DATA TABLES

#### options_contracts
- id, underlying_stock_id/index
- strike_price, option_type (CALL/PUT), expiry_date
- current_price, bid/ask_price, bid/ask_qty
- open_interest, previous_open_interest, volume, iv
- delta, gamma, theta, vega, rho

#### options_chain_history
- id, contract_id (FK)
- oi_previous, oi_current, oi_change, oi_change_percent
- delta, gamma, theta, vega
- price_open, price_close, price_high, price_low, iv
- recorded_at

#### pcr_analysis
- id, underlying_symbol, expiry_date
- pcr_oi, pcr_volume
- put_oi_total, call_oi_total, put_volume_total, call_volume_total
- max_pain_level, max_pain_direction
- sentiment, strength, recorded_at

---

### SIGNAL & AI TABLES

#### signals
- id, signal_type (stock_buy, call_buy, put_buy, etc.)
- asset_symbol, asset_type (stock, index, option)
- entry_price, entry_price_high, entry_price_low, stop_loss
- target_1, target_2, target_3
- confidence_score (0-100), risk_score (1-10), risk_reward_ratio
- option_strike_price, option_expiry_date, option_type
- timeframe, expected_holding_period
- reasoning (Text explanation)
- signal_status (active, triggered, partial, closed)
- result_status (pending, win, loss, partial_win)
- actual_entry_price, actual_exit_price, profit_loss, profit_loss_percent

#### signal_performance
- id, signal_type, time_period (daily, weekly, monthly, all_time)
- total_signals, winning_signals, losing_signals, win_rate
- total_profit, total_loss, profit_factor, average_profit/loss
- max_consecutive_wins/losses, max_drawdown
- sharpe_ratio, sortino_ratio

#### ai_agent_logs
- id, signal_id (FK), agent_name
- input_data (JSONB), analysis_result (JSONB)
- confidence_score, decision
- processing_time_ms, api_calls_made

---

### SENTIMENT & MARKET DATA TABLES

#### vix_data
- id, vix_level, previous_close, open_level, high_level, low_level
- change_points, change_percent, interpretation (LOW, HIGH, EXTREME)

#### market_breadth
- id, advances, declines, unchanged
- advance_decline_line, breadth_momentum
- bullish_percent, bearish_percent, up_volume, down_volume

#### sector_performance
- id, sector_name, current_value, previous_close
- change_points, change_percent
- top_gainer, top_loser

#### institutional_flows
- id, fii_net_flow, dii_net_flow
- fii_buy_value, fii_sell_value, dii_buy_value, dii_sell_value
- recorded_date

---

### SUBSCRIPTION & BILLING TABLES

#### subscriptions
- id, user_id (FK), plan_id (FK)
- stripe_subscription_id, razorpay_subscription_id
- start_date, renewal_date, end_date
- status (active, cancelled, suspended)
- billing_amount, billing_currency, billing_cycle

#### subscription_plans
- id, plan_name (UNIQUE - basic, pro, premium, institutional)
- monthly_price, yearly_price
- features (JSONB)
- max_api_calls_per_day, max_watchlists, max_alerts, max_custom_screens

#### payments
- id, subscription_id (FK), user_id (FK)
- amount, currency, payment_method
- transaction_id, receipt_number
- status (pending, completed, failed, refunded)

---

### ADDITIONAL TABLES

#### watchlists
- id, user_id (FK), name, description, is_default

#### watchlist_items
- id, watchlist_id (FK), stock_id (FK)

#### alerts
- id, user_id (FK), alert_type
- asset_symbol, trigger_condition, trigger_value
- notify_via, is_active, triggered_count

#### audit_logs
- id, user_id (FK), action
- resource_type, resource_id, changes (JSONB)
- ip_address, user_agent

---

## 3. Key Indexes

```
- idx_stock_candles_stock_id_timeframe (composite)
- idx_signals_created_at DESC (time-series queries)
- idx_options_updated DESC (real-time queries)
- idx_signal_result (result tracking)
- idx_market_breadth_recorded_at DESC (time-series)
- idx_vix_data_recorded_at DESC (time-series)
- idx_subscriptions_status (billing queries)
```

---

## 4. Data Retention Policy

- **Real-time Data (Redis):** 24 hours
- **Daily Candles:** 5+ years
- **Intraday Candles:** 90 days (then aggregated)
- **Option Chain History:** 90 days
- **Signals:** Indefinite (for learning)
- **User Activity:** 2 years
- **Backups:** Daily, 30-day retention

---

## 5. Scalability Considerations

- **Time-series partitioning** by year for historical data
- **Read replicas** for analytics queries
- **Materialized views** for complex aggregations
- **Redis caching** for frequently accessed data
- **S3 archival** for data older than 2 years

---

**Document Version:** 1.0
**Last Updated:** June 2026
