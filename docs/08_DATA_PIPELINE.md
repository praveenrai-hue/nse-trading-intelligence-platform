# Data Pipeline Architecture
## NSE Trading Intelligence Platform - Real-Time Data Processing

---

## 1. Data Pipeline Overview

**End-to-End Real-Time Processing:**
```
NSE Data Source → Ingestion → Validation → Processing → Storage → Analysis → Output
```

**Update Frequency:** Every 1 minute during market hours
**Latency Target:** <5 seconds from NSE to user display
**Data Volume:** 1M+ data points per minute

---

## 2. Data Ingestion Layer

### Data Sources
- **NSE API/Feed:** Market data, options chain, indices
- **Financial Data Providers:** NSE data aggregators
- **Public APIs:** FII/DII flows, news feeds
- **Internal:** User activity, tracking data

### Ingestion Service
```
NSE Feed (every minute)
    ↓
Validate Format & Authenticity
    ↓
Deduplicate Data
    ↓
Buffer in Memory (queue)
    ↓
Batch Insert (100 records/batch)
```

---

## 3. Data Validation Layer

### Validation Rules
- **Price Sanity:** Check for impossible prices
- **Volume Validation:** Detect anomalies
- **OI Consistency:** Verify option OI changes
- **Timing:** Ensure data is not stale
- **Duplicates:** Remove duplicate records

### Error Handling
```
If validation fails:
  1. Log error with details
  2. Alert monitoring system
  3. Retry with backoff (3x)
  4. Move to dead letter queue
  5. Manual review required
```

---

## 4. Real-Time Processing Layer

### Technical Analysis Engine
```
OHLCV Data → Calculate Indicators
  ├─ RSI (14, 21 periods)
  ├─ MACD (12, 26, 9)
  ├─ EMA (9, 21, 50, 200)
  ├─ SMA (20, 50, 200)
  ├─ Bollinger Bands (20, 2)
  ├─ ATR (14)
  ├─ ADX (14)
  ├─ Stochastic (14, 3, 3)
  └─ VWAP
      ↓
  Store in Redis (5-min cache)
  Store in PostgreSQL (historical)
```

### Options Analytics Engine
```
Options Chain → Calculate Greeks
  ├─ Delta (directional exposure)
  ├─ Gamma (delta acceleration)
  ├─ Theta (time decay)
  ├─ Vega (volatility sensitivity)
  └─ Rho (interest rate sensitivity)
      ↓
  Analyze OI Changes
  Calculate PCR
  Determine Max Pain
      ↓
  Store Results
```

### Sentiment Analysis Engine
```
VIX Data → Analyze Level
    ↓
Market Breadth → Calculate Indicators
    ↓
FII/DII Flows → Track Trends
    ↓
News Feed → Sentiment Scoring
    ↓
Generate Composite Sentiment Score
```

---

## 5. Signal Generation Pipeline

### Signal Processing Flow
```
Market Data + Options Data + Sentiment Data
           ↓
    Multi-Agent AI System
      ├─ Agent 1: Market Structure
      ├─ Agent 2: Options Flow
      ├─ Agent 3: Institutional Activity
      ├─ Agent 4: Stock Selection
      ├─ Agent 5: Risk Management
      ├─ Agent 6: Market Sentiment
      └─ Agent 7: Master Decision Engine
           ↓
    Generate Signal (or HOLD)
           ↓
    Store Signal in Database
           ↓
    Notify Users (WebSocket + Email)
```

### Signal Generation Frequency
- **Stock Signals:** Every 15 minutes
- **Options Signals:** Every 30 minutes
- **Index Signals:** Every hour
- **Batch Processing:** Daily updates for historical analysis

---

## 6. Storage Architecture

### PostgreSQL (Hot Storage)
```
- Current day's data
- User data and preferences
- Signal records
- Historical indicators (1+ years)
- Indexes on frequently queried columns
```

### Redis (Cache Layer)
```
- Real-time market prices (1-min TTL)
- User session data (24-hour TTL)
- Signal data (4-hour TTL)
- Temporary calculations
```

### AWS S3 (Cold Storage)
```
- Historical data >2 years old
- Backup data
- Archive option chain data
- Long-term retention
```

---

## 7. Data Quality & Monitoring

### Quality Metrics
- **Data Freshness:** <1 minute latency
- **Completeness:** 100% expected data arrival
- **Accuracy:** Match with external sources
- **Consistency:** Data integrity across tables

### Monitoring & Alerting
```
- Data ingestion lag alerts
- Validation failure rate
- Processing time anomalies
- Storage utilization
- API response time tracking
```

---

## 8. Scalability Considerations

### Horizontal Scaling
- **Data Ingestion:** Multiple worker processes
- **Processing:** Distributed job queue (Bull)
- **Analysis:** Microservices per domain
- **Storage:** Database read replicas

### Performance Optimization
- **Batch Processing:** Group updates
- **Materialized Views:** Pre-calculate complex queries
- **Caching Strategy:** Aggressive caching for stable data
- **Data Compression:** For archived data

---

## 9. Workflow Orchestration

### Job Queue (Bull + Redis)
```
Job Types:
- dataRefreshJob (every 1 min)
- signalGenerationJob (every 15 min)
- analyticsUpdateJob (hourly)
- notificationJob (real-time)
- cleanupJob (daily)
- reportGenerationJob (daily)
```

### Workflow Scheduling
```
Market Open (9:15 AM IST)
  ↓
Start data ingestion
  ↓
Every 1 minute: Process & store data
  ↓
Every 15 min: Generate signals
  ↓
Every hour: Update analytics
  ↓
Market Close (3:30 PM IST)
  ↓
Stop ingestion
  ↓
End-of-day analysis
  ↓
Generate daily report
```

---

## 10. Error Handling & Recovery

### Error Types & Handling
```
1. Data Validation Error
   → Quarantine data
   → Alert operations
   → Manual review

2. Processing Timeout
   → Retry with backoff
   → Escalate after 3 failures
   → Use previous value as fallback

3. Database Connection Error
   → Use connection pool
   → Automatic reconnection
   → Queue operations during outage

4. External API Failure
   → Use cached data
   → Reduce update frequency
   → Alert user via UI
```

---

**Document Version:** 1.0
**Last Updated:** June 2026
