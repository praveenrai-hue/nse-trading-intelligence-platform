"""Schemas for smart-money / price-action analysis."""

from __future__ import annotations

from pydantic import BaseModel


class Candle(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float = 0.0


class StructurePoint(BaseModel):
    type: str  # HH / HL / LH / LL
    price: float
    index: int
    time: str | None = None


class StructureShift(BaseModel):
    type: str  # BOS / CHoCH
    direction: str  # bullish / bearish
    price: float
    index: int
    time: str | None = None


class StructureResponse(BaseModel):
    symbol: str
    trend: str  # uptrend / downtrend / range
    swing_points: list[StructurePoint]
    shifts: list[StructureShift]


class LiquidityZone(BaseModel):
    type: str  # equal_highs / equal_lows / stop_hunt
    price: float
    direction: str | None = None
    index: int
    time: str | None = None


class LiquidityResponse(BaseModel):
    symbol: str
    zones: list[LiquidityZone]


class Zone(BaseModel):
    top: float
    bottom: float
    direction: str
    index: int
    time: str | None = None
    filled: bool = False


class BreakoutZone(BaseModel):
    type: str  # compression / breakout
    direction: str | None = None
    level: float | None = None
    range_high: float | None = None
    range_low: float | None = None
    strength: float | None = None
    index: int
    time: str | None = None


class SmartMoneyResponse(BaseModel):
    symbol: str
    structure: StructureResponse
    liquidity: LiquidityResponse
    fair_value_gaps: list[Zone]
    order_blocks: list[Zone]
    volume_imbalances: list[Zone]
    breakouts: list[BreakoutZone]
    structure_score: float
    liquidity_score: float
    smart_money_score: float
    structure_bias: str
