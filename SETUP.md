# Setup & Run Guide

NSE Options Intelligence Scanner + Smart Money Analysis Platform.

**Stack:** Python FastAPI backend · PostgreSQL · Next.js/React frontend.

The scanner ships with a deterministic **mock NSE data source** enabled by
default (`USE_MOCK_NSE=true`) so the full stack runs offline / in CI without a
live NSE feed or credentials. Set `USE_MOCK_NSE=false` to hit the real NSE
option-chain API.

---

## Option A — Docker Compose (recommended)

```bash
cp backend/.env.example backend/.env      # optional; compose sets sane defaults
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API + Swagger docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432 (`nse` / `nse` / `nse_intel`)

The backend container runs Alembic migrations on startup.

---

## Option B — Run services manually

### 1. PostgreSQL

```bash
docker run -d --name nse-pg \
  -e POSTGRES_USER=nse -e POSTGRES_PASSWORD=nse -e POSTGRES_DB=nse_intel \
  -p 5432:5432 postgres:16
```

### 2. Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

alembic upgrade head            # create tables
uvicorn app.main:app --reload   # http://localhost:8000
```

Run tests and lint:

```bash
pytest
ruff check .
```

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local      # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                     # http://localhost:3000
```

Build / lint / typecheck:

```bash
npm run build
npm run lint
npm run typecheck
```

---

## Environment configuration

### Backend (`backend/.env`)

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql+psycopg2://nse:nse@localhost:5432/nse_intel` | PostgreSQL DSN |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins (`*` for all) |
| `INDEX_SYMBOLS` | `NIFTY,BANKNIFTY,FINNIFTY` | Index symbols to scan |
| `STOCK_SYMBOLS` | `RELIANCE,HDFCBANK,INFY,TCS,ICICIBANK` | Stock symbols to scan |
| `USE_MOCK_NSE` | `true` | Use synthetic data instead of live NSE |
| `NSE_MAX_RETRIES` | `3` | Retry attempts for NSE fetches |
| `REFRESH_INTERVAL_SECONDS` | `30` | WebSocket scan broadcast interval |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend base URL |
| `NEXT_PUBLIC_REFRESH_MS` | `30000` | Dashboard auto-refresh interval |

---

## Going live with real NSE data

1. Set `USE_MOCK_NSE=false` in `backend/.env`.
2. NSE aggressively rate-limits scripted access; the client primes cookies from
   the homepage and retries with exponential backoff. For production, front it
   with a caching layer and/or a licensed data vendor. Intraday OHLCV should be
   sourced from a broker feed (plug into `NSEClient.get_candles`).

See [`docs/18_SMART_MONEY_FEATURES.md`](./docs/18_SMART_MONEY_FEATURES.md) for
the analytics, scoring and API reference.
