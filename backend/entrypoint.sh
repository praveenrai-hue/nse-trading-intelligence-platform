#!/usr/bin/env bash
set -euo pipefail

echo "Running database migrations..."
alembic upgrade head || echo "WARN: migrations failed or DB unavailable; continuing"

echo "Starting API server on ${API_HOST:-0.0.0.0}:${API_PORT:-8000}"
exec uvicorn app.main:app --host "${API_HOST:-0.0.0.0}" --port "${API_PORT:-8000}"
