"""Schemas for the combined scanner output."""

from __future__ import annotations

from pydantic import BaseModel


class ScanRow(BaseModel):
    symbol: str
    spot_price: float | None = None
    bullish_score: float
    bearish_score: float
    confidence_score: float
    structure_score: float
    liquidity_score: float
    smart_money_score: float
    direction: str  # Bullish / Bearish / Neutral
    structure_bias: str  # Bullish Structure / Bearish Structure / Neutral Structure
    reasons: list[str]


class ScanResponse(BaseModel):
    generated_at: str
    results: list[ScanRow]
