"""Liquidity-sweep endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.mappers import liquidity_to_response
from app.schemas.smart_money import LiquidityResponse
from app.services.nse_client import get_nse_client
from app.services.smart_money import analyze_smart_money

router = APIRouter(prefix="/liquidity", tags=["smart-money"])


@router.get("/{symbol}", response_model=LiquidityResponse)
def get_liquidity(symbol: str) -> LiquidityResponse:
    candles = get_nse_client().get_candles(symbol)
    result = analyze_smart_money(symbol, candles)
    return liquidity_to_response(result)
