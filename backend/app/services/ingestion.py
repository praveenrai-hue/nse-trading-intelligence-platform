"""Persistence of scan results and detected events into PostgreSQL."""

from __future__ import annotations

import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.logging_config import get_logger
from app.models import (
    BreakoutEvent,
    FairValueGap,
    LiquidityEvent,
    OHLCVCandle,
    OptionsChainHistory,
    OrderBlock,
    PCRAnalysis,
    ScanResult,
    StructureEvent,
    VolumeImbalance,
)
from app.services.nse_client import CandleData
from app.services.scan import SymbolAnalysis

logger = get_logger(__name__)


def persist_analysis(db: Session, analysis: SymbolAnalysis, candles: list[CandleData] | None = None) -> None:
    now = datetime.now(timezone.utc)
    if analysis.error or analysis.combined is None:
        logger.warning("persist_skipped", symbol=analysis.symbol, error=analysis.error)
        return

    combined = analysis.combined
    db.add(
        ScanResult(
            symbol=analysis.symbol,
            spot_price=analysis.spot_price,
            bullish_score=combined.bullish_score,
            bearish_score=combined.bearish_score,
            confidence_score=combined.confidence_score,
            structure_score=combined.structure_score,
            liquidity_score=combined.liquidity_score,
            smart_money_score=combined.smart_money_score,
            direction=combined.direction,
            structure_bias=combined.structure_bias,
            reasons=json.dumps(combined.reasons),
            recorded_at=now,
        )
    )

    if analysis.option_analytics is not None:
        a = analysis.option_analytics
        db.add(
            PCRAnalysis(
                underlying_symbol=a.symbol,
                pcr_oi=a.pcr_oi,
                pcr_volume=a.pcr_volume,
                put_oi_total=a.put_oi_total,
                call_oi_total=a.call_oi_total,
                put_volume_total=a.put_volume_total,
                call_volume_total=a.call_volume_total,
                max_pain_level=a.max_pain,
                max_pain_direction=a.max_pain_direction,
                sentiment=a.sentiment,
                recorded_at=now,
            )
        )
        for b in a.buildups:
            db.add(
                OptionsChainHistory(
                    underlying_symbol=a.symbol,
                    strike_price=b.strike,
                    option_type=b.option_type,
                    expiry_date=now.date(),
                    oi_change=b.oi_change,
                    oi_change_percent=b.price_change_percent,
                    buildup_type=b.buildup_type,
                    recorded_at=now,
                )
            )

    sm = analysis.smart_money
    if sm is not None:
        for p in sm.swing_points:
            db.add(
                StructureEvent(
                    symbol=sm.symbol,
                    event_type=p.type,
                    price=p.price,
                    candle_time=_parse(p.time, now),
                    detected_at=now,
                )
            )
        for s in sm.shifts:
            db.add(
                StructureEvent(
                    symbol=sm.symbol,
                    event_type=s.type,
                    price=s.price,
                    direction=s.direction,
                    candle_time=_parse(s.time, now),
                    detected_at=now,
                )
            )
        for z in sm.liquidity:
            db.add(
                LiquidityEvent(
                    symbol=sm.symbol,
                    event_type=z.type,
                    price=z.price,
                    direction=z.direction,
                    candle_time=_parse(z.time, now),
                    detected_at=now,
                )
            )
        for z in sm.order_blocks:
            db.add(
                OrderBlock(
                    symbol=sm.symbol,
                    direction=z.direction,
                    top=z.top,
                    bottom=z.bottom,
                    mitigated=z.filled,
                    candle_time=_parse(z.time, now),
                    detected_at=now,
                )
            )
        for z in sm.fair_value_gaps:
            db.add(
                FairValueGap(
                    symbol=sm.symbol,
                    direction=z.direction,
                    gap_top=z.top,
                    gap_bottom=z.bottom,
                    filled=z.filled,
                    candle_time=_parse(z.time, now),
                    detected_at=now,
                )
            )
        for z in sm.volume_imbalances:
            db.add(
                VolumeImbalance(
                    symbol=sm.symbol,
                    direction=z.direction,
                    gap_top=z.top,
                    gap_bottom=z.bottom,
                    candle_time=_parse(z.time, now),
                    detected_at=now,
                )
            )
        for z in sm.breakouts:
            db.add(
                BreakoutEvent(
                    symbol=sm.symbol,
                    event_type=z.type,
                    direction=z.direction,
                    level=z.level,
                    range_high=z.range_high,
                    range_low=z.range_low,
                    strength=z.strength,
                    candle_time=_parse(z.time, now),
                    detected_at=now,
                )
            )

    if candles:
        for c in candles:
            db.add(
                OHLCVCandle(
                    symbol=analysis.symbol,
                    timeframe="5m",
                    candle_time=c.time,
                    open_price=c.open,
                    high_price=c.high,
                    low_price=c.low,
                    close_price=c.close,
                    volume=c.volume,
                )
            )

    db.commit()


def _parse(value: str | None, default: datetime) -> datetime:
    if not value:
        return default
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return default
