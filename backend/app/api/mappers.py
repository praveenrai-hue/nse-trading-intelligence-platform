"""Helpers converting service dataclasses into API schemas."""

from __future__ import annotations

from app.schemas.options import (
    OIAnalysisResponse,
    OIBuildupRow,
    OptionChainResponse,
    OptionStrikeRow,
)
from app.schemas.scan import ScanRow
from app.schemas.smart_money import (
    BreakoutZone,
    LiquidityResponse,
    LiquidityZone,
    SmartMoneyResponse,
    StructurePoint,
    StructureResponse,
    StructureShift,
    Zone,
)
from app.services.nse_client import OptionChain
from app.services.options_analytics import OptionAnalytics
from app.services.scan import SymbolAnalysis
from app.services.smart_money import SmartMoneyResult
from app.services.smart_money_scoring import SmartMoneyScore


def chain_to_response(chain: OptionChain) -> OptionChainResponse:
    rows = [
        OptionStrikeRow(
            strike=r.strike,
            call_oi=r.call.oi,
            call_change_oi=r.call.change_oi,
            call_volume=r.call.volume,
            call_iv=r.call.iv,
            call_ltp=r.call.ltp,
            put_oi=r.put.oi,
            put_change_oi=r.put.change_oi,
            put_volume=r.put.volume,
            put_iv=r.put.iv,
            put_ltp=r.put.ltp,
        )
        for r in chain.rows
    ]
    return OptionChainResponse(
        symbol=chain.symbol, expiry=chain.expiry, spot_price=chain.spot_price, rows=rows
    )


def oi_analysis_to_response(a: OptionAnalytics) -> OIAnalysisResponse:
    return OIAnalysisResponse(
        symbol=a.symbol,
        call_writing_strikes=a.call_writing_strikes,
        put_writing_strikes=a.put_writing_strikes,
        atm_strike=a.atm_strike,
        atm_oi_concentration=a.atm_oi_concentration,
        buildups=[
            OIBuildupRow(
                strike=b.strike,
                option_type=b.option_type,
                buildup_type=b.buildup_type,
                oi_change=b.oi_change,
                price_change_percent=b.price_change_percent,
            )
            for b in a.buildups
        ],
    )


def structure_to_response(result: SmartMoneyResult) -> StructureResponse:
    return StructureResponse(
        symbol=result.symbol,
        trend=result.trend,
        swing_points=[
            StructurePoint(type=p.type, price=p.price, index=p.index, time=p.time)
            for p in result.swing_points
        ],
        shifts=[
            StructureShift(type=s.type, direction=s.direction, price=s.price, index=s.index, time=s.time)
            for s in result.shifts
        ],
    )


def liquidity_to_response(result: SmartMoneyResult) -> LiquidityResponse:
    return LiquidityResponse(
        symbol=result.symbol,
        zones=[
            LiquidityZone(
                type=z.type, price=z.price, direction=z.direction, index=z.index, time=z.time
            )
            for z in result.liquidity
        ],
    )


def _zones(items) -> list[Zone]:
    return [
        Zone(top=z.top, bottom=z.bottom, direction=z.direction, index=z.index, time=z.time, filled=z.filled)
        for z in items
    ]


def smart_money_to_response(result: SmartMoneyResult, score: SmartMoneyScore) -> SmartMoneyResponse:
    return SmartMoneyResponse(
        symbol=result.symbol,
        structure=structure_to_response(result),
        liquidity=liquidity_to_response(result),
        fair_value_gaps=_zones(result.fair_value_gaps),
        order_blocks=_zones(result.order_blocks),
        volume_imbalances=_zones(result.volume_imbalances),
        breakouts=[
            BreakoutZone(
                type=z.type,
                direction=z.direction,
                level=z.level,
                range_high=z.range_high,
                range_low=z.range_low,
                strength=z.strength,
                index=z.index,
                time=z.time,
            )
            for z in result.breakouts
        ],
        structure_score=score.structure_score,
        liquidity_score=score.liquidity_score,
        smart_money_score=score.smart_money_score,
        structure_bias=score.structure_bias,
    )


def analysis_to_scan_row(analysis: SymbolAnalysis) -> ScanRow:
    c = analysis.combined
    if c is None:
        return ScanRow(
            symbol=analysis.symbol,
            spot_price=analysis.spot_price,
            bullish_score=0.0,
            bearish_score=0.0,
            confidence_score=0.0,
            structure_score=0.0,
            liquidity_score=0.0,
            smart_money_score=0.0,
            direction="Neutral",
            structure_bias="Neutral Structure",
            reasons=[analysis.error or "no data"],
        )
    return ScanRow(
        symbol=analysis.symbol,
        spot_price=analysis.spot_price,
        bullish_score=c.bullish_score,
        bearish_score=c.bearish_score,
        confidence_score=c.confidence_score,
        structure_score=c.structure_score,
        liquidity_score=c.liquidity_score,
        smart_money_score=c.smart_money_score,
        direction=c.direction,
        structure_bias=c.structure_bias,
        reasons=c.reasons,
    )
