"""Combined smart-money endpoint (structure + liquidity + FVG/OB/breakouts)."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.mappers import smart_money_to_response
from app.schemas.smart_money import SmartMoneyResponse
from app.services.nse_client import get_nse_client
from app.services.smart_money import analyze_smart_money
from app.services.smart_money_scoring import score_smart_money

router = APIRouter(prefix="/smart-money", tags=["smart-money"])


@router.get("/{symbol}", response_model=SmartMoneyResponse)
def get_smart_money(symbol: str) -> SmartMoneyResponse:
    candles = get_nse_client().get_candles(symbol)
    result = analyze_smart_money(symbol, candles)
    score = score_smart_money(result)
    return smart_money_to_response(result, score)
