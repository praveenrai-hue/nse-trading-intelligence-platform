"""Schemas for option-chain analytics."""

from __future__ import annotations

from pydantic import BaseModel


class OptionStrikeRow(BaseModel):
    strike: float
    call_oi: float = 0.0
    call_change_oi: float = 0.0
    call_volume: float = 0.0
    call_iv: float = 0.0
    call_ltp: float = 0.0
    put_oi: float = 0.0
    put_change_oi: float = 0.0
    put_volume: float = 0.0
    put_iv: float = 0.0
    put_ltp: float = 0.0


class OptionChainResponse(BaseModel):
    symbol: str
    expiry: str | None = None
    spot_price: float | None = None
    rows: list[OptionStrikeRow]


class PCRResponse(BaseModel):
    symbol: str
    pcr_oi: float
    pcr_volume: float
    put_oi_total: float
    call_oi_total: float
    sentiment: str


class MaxPainResponse(BaseModel):
    symbol: str
    max_pain_level: float
    spot_price: float | None = None
    direction: str


class OIBuildupRow(BaseModel):
    strike: float
    option_type: str
    buildup_type: str  # long_buildup / short_buildup / long_unwinding / short_covering
    oi_change: float
    price_change_percent: float


class OIAnalysisResponse(BaseModel):
    symbol: str
    call_writing_strikes: list[float]
    put_writing_strikes: list[float]
    atm_strike: float | None = None
    atm_oi_concentration: float
    buildups: list[OIBuildupRow]
