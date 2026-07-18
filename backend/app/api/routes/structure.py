"""Market-structure endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.mappers import structure_to_response
from app.schemas.smart_money import StructureResponse
from app.services.nse_client import get_nse_client
from app.services.smart_money import analyze_smart_money

router = APIRouter(prefix="/structure", tags=["smart-money"])


@router.get("/{symbol}", response_model=StructureResponse)
def get_structure(symbol: str) -> StructureResponse:
    candles = get_nse_client().get_candles(symbol)
    result = analyze_smart_money(symbol, candles)
    return structure_to_response(result)
