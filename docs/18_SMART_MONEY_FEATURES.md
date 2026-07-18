# Smart Money Analysis & Combined Scoring

## NSE Options Intelligence Scanner + Smart Money Platform

This document describes the **Smart Money Analysis** module that extends the
option-chain intelligence scanner with institutional price-action (SMC / ICT
style) detection and a combined bias engine.

> Implementation stack (as built): **Python FastAPI** backend, **PostgreSQL**
> database (SQLAlchemy + Alembic), **Next.js / React** mobile-first frontend.
> This differs from the original Node.js/Supabase blueprint in the other docs;
> the option-chain analytics concepts (PCR, Max Pain, OI build-up, strike
> concentration) are reused as specified.

---

## 1. Option-Chain Analytics (foundation)

Computed by `backend/app/services/options_analytics.py` from a live/normalized
option chain (NIFTY, BANKNIFTY, FINNIFTY and selected stocks):

| Metric | Description |
| --- | --- |
| Open Interest / Change in OI | Per-strike CE & PE OI and delta vs previous |
| OI Build-up | `long_buildup`, `short_buildup`, `short_covering`, `long_unwinding` (OI vs price grid) |
| Call / Put Writing | Strikes with strong positive change in OI above/below ATM |
| PCR (OI & Volume) | Put/Call ratio with bullish / bearish / neutral sentiment |
| Max Pain | Strike minimizing total option-writer payout, + direction vs spot |
| ATM OI Concentration | Fraction of total OI within the ±1 strike ATM band |
| Support / Resistance | Highest put-OI strike (support), highest call-OI strike (resistance) |

**Option scoring** (`options_scoring.py`) → `Bullish Score (0-100)`,
`Bearish Score (0-100)`, `Confidence Score (0-100)` plus reason strings such as
"Strong Put Writing", "PCR Rising", "Call Unwinding".

---

## 2. Smart Money / Price-Action Detectors

Implemented as pure functions over OHLCV candles in
`backend/app/services/smart_money.py`:

| Detector | Method |
| --- | --- |
| **Market Structure** | Fractal swing points classified as **HH / HL / LH / LL** |
| **BOS** (Break of Structure) | Close beyond the last swing in the trend direction (continuation) |
| **CHoCH** (Change of Character) | First structural break against the established trend |
| **Liquidity Sweeps** | **Equal Highs**, **Equal Lows** (resting liquidity) and **Stop Hunts** (wick pierces a prior swing then closes back inside) |
| **Fair Value Gap (FVG)** | 3-candle imbalance (`low[i] > high[i-2]` bullish; `high[i] < low[i-2]` bearish), with fill tracking |
| **Order Block** | Last opposite candle before an impulsive move (range ≥ 1.3× ATR) |
| **Volume Imbalance** | Body-to-body gap between consecutive candles |
| **Volatility Compression** | Recent true-range average contracting ≤ 60% of the prior window |
| **Strong Range Breakout** | Expansion candle closing beyond a compression range high/low |

---

## 3. Smart-Money Scoring & Combined Bias

`smart_money_scoring.py` produces:

- **Structure Score (0-100)** — trend (HH/HL vs LH/LL) + recent BOS/CHoCH.
- **Liquidity Score (0-100)** — net bullish vs bearish liquidity sweeps.
- **Smart Money Score (0-100)** — structure + liquidity + order-block / FVG /
  breakout confluence.
- **Structure Bias** — `Bullish Structure` / `Bearish Structure` /
  `Neutral Structure`.

The **combined bias** merges option-chain sentiment with smart-money structure:

```
option_dir      = (bullish_score - bearish_score) / 2          # [-50, 50]
smart_money_dir = smart_money_score - 50                        # [-50, 50]
combined        = 0.55 * option_dir + 0.45 * smart_money_dir

direction   = Bullish  if combined >  8
              Bearish  if combined < -8
              Neutral  otherwise
confidence  = 0.5 * option_confidence + 0.5 * (100 - |option_dir - smart_money_dir|)
```

Confidence rises when the option chain and price structure **agree**.

---

## 4. Data Model additions (PostgreSQL)

Reuses `options_contracts`, `options_chain_history`, `pcr_analysis`,
`market_indices` (from `03_DATABASE_DESIGN.md`) and adds:

- `ohlcv_candles` — price candles for the structure engine.
- `structure_events` — HH/HL/LH/LL + BOS/CHoCH.
- `liquidity_events` — equal highs/lows, stop hunts.
- `order_blocks`, `fair_value_gaps`, `volume_imbalances`, `breakout_events`.
- `scan_results` — per-symbol snapshot with `structure_score`, `liquidity_score`,
  `smart_money_score`, `bullish_score`, `bearish_score`, `confidence_score`,
  `direction`, `structure_bias`, and reason list.

---

## 5. API Endpoints

Base prefix: `/api/v1`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/options/{symbol}/chain` | Full option chain |
| GET | `/options/{symbol}/pcr` | PCR (OI & volume) + sentiment |
| GET | `/options/{symbol}/max-pain` | Max Pain level + direction |
| GET | `/options/{symbol}/oi-analysis` | Writing strikes, ATM concentration, build-ups |
| GET | `/structure/{symbol}` | Market structure (swings + BOS/CHoCH) |
| GET | `/liquidity/{symbol}` | Liquidity sweep zones |
| GET | `/smart-money/{symbol}` | Full SMC analysis + scores |
| GET | `/market/chart/{symbol}` | OHLCV candles for charting |
| GET | `/scan` | Combined scan across all tracked symbols |
| GET | `/scan/{symbol}` | Combined bias for one symbol |
| WS  | `/ws/scan` | Streams the combined scan every `REFRESH_INTERVAL_SECONDS` |

---

## 6. Frontend

Mobile-first Next.js dashboard (`frontend/`):

- **Scanner table** — Symbol, Spot, Bull, Bear, Direction, Confidence with
  green (Bullish) / red (Bearish) / yellow (Neutral) coding, auto-refreshing
  every 30 seconds.
- **Symbol detail** — option-chain reasons + Structure / Liquidity / Smart Money
  scores + Bullish/Bearish/Neutral structure label.
- **Price chart overlays** — HH/HL/LH/LL points, BOS/CHoCH lines, liquidity
  sweeps, FVG zones, order blocks, volume imbalance and range breakouts, each
  toggleable.

---

**Document Version:** 1.0
