"""Option-chain analytics endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.api.mappers import chain_to_response, oi_analysis_to_response
from app.schemas.options import (
    MaxPainResponse,
    OIAnalysisResponse,
    OptionChainResponse,
    PCRResponse,
)
from app.services.nse_client import NSEDataError, get_nse_client
from app.services.options_analytics import analyze_chain

router = APIRouter(prefix="/options", tags=["options"])


def _chain(symbol: str):
    try:
        return get_nse_client().get_option_chain(symbol)
    except NSEDataError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/{symbol}/chain", response_model=OptionChainResponse)
def get_chain(symbol: str) -> OptionChainResponse:
    return chain_to_response(_chain(symbol))


@router.get("/{symbol}/pcr", response_model=PCRResponse)
def get_pcr(symbol: str) -> PCRResponse:
    a = analyze_chain(_chain(symbol))
    return PCRResponse(
        symbol=a.symbol,
        pcr_oi=a.pcr_oi,
        pcr_volume=a.pcr_volume,
        put_oi_total=a.put_oi_total,
        call_oi_total=a.call_oi_total,
        sentiment=a.sentiment,
    )


@router.get("/{symbol}/max-pain", response_model=MaxPainResponse)
def get_max_pain(symbol: str) -> MaxPainResponse:
    a = analyze_chain(_chain(symbol))
    return MaxPainResponse(
        symbol=a.symbol,
        max_pain_level=a.max_pain,
        spot_price=a.spot_price,
        direction=a.max_pain_direction,
    )


@router.get("/{symbol}/oi-analysis", response_model=OIAnalysisResponse)
def get_oi_analysis(symbol: str) -> OIAnalysisResponse:
    return oi_analysis_to_response(analyze_chain(_chain(symbol)))
