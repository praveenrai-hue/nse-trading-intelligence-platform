"""Shared test fixtures / helpers."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from app.services.nse_client import CandleData


def make_candles(closes: list[float], spread: float = 1.0, volume: float = 1000.0) -> list[CandleData]:
    """Build candles from a list of closing prices with symmetric wicks."""
    candles: list[CandleData] = []
    start = datetime(2024, 1, 1, tzinfo=timezone.utc)
    prev = closes[0]
    for i, close in enumerate(closes):
        open_p = prev
        high = max(open_p, close) + spread
        low = min(open_p, close) - spread
        candles.append(
            CandleData(
                time=start + timedelta(minutes=5 * i),
                open=open_p,
                high=high,
                low=low,
                close=close,
                volume=volume,
            )
        )
        prev = close
    return candles


@pytest.fixture
def uptrend_candles() -> list[CandleData]:
    # Zig-zag with rising highs and lows -> HH / HL structure.
    seq = [100, 105, 102, 110, 106, 116, 112, 124, 118, 130]
    return make_candles(seq)
