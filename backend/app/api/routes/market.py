"""Market data endpoints (spot + OHLCV candles)."""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.smart_money import Candle
from app.services.nse_client import get_nse_client

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/chart/{symbol}", response_model=list[Candle])
def get_chart(symbol: str, count: int = 120) -> list[Candle]:
    candles = get_nse_client().get_candles(symbol, count=count)
    return [
        Candle(
            time=c.time.isoformat(),
            open=c.open,
            high=c.high,
            low=c.low,
            close=c.close,
            volume=c.volume,
        )
        for c in candles
    ]
