"""FastAPI application entrypoint."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.api.routes import (
    liquidity,
    market,
    options,
    scan,
    smart_money,
    structure,
    ws,
)
from app.config import get_settings
from app.logging_config import configure_logging, get_logger

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)

app = FastAPI(
    title="NSE Options Intelligence + Smart Money API",
    version=__version__,
    description=(
        "Live NSE option-chain analytics (OI, PCR, Max Pain, OI build-up) combined "
        "with smart-money price-action analysis (market structure, BOS/CHoCH, "
        "liquidity sweeps, FVG, order blocks, breakouts)."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if "*" not in settings.cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"
for module in (options, structure, liquidity, smart_money, scan, market):
    app.include_router(module.router, prefix=API_PREFIX)
app.include_router(ws.router)


@app.get("/health", tags=["system"])
def health() -> dict:
    return {
        "status": "ok",
        "version": __version__,
        "environment": settings.environment,
        "time": datetime.now(timezone.utc).isoformat(),
        "symbols": settings.all_symbols,
        "mock_nse": settings.use_mock_nse,
    }


@app.get("/", tags=["system"])
def root() -> dict:
    return {"name": "NSE Smart Money Analysis Platform", "docs": "/docs", "health": "/health"}
