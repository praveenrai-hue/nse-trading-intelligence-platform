"""Smart-money / price-action detection models."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class StructureEvent(Base):
    """Market structure points and shifts (HH/HL/LH/LL, BOS, CHoCH)."""

    __tablename__ = "structure_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), nullable=False, default="5m")
    event_type: Mapped[str] = mapped_column(String(16), nullable=False)  # HH/HL/LH/LL/BOS/CHoCH
    price: Mapped[float] = mapped_column(Float, nullable=False)
    direction: Mapped[str | None] = mapped_column(String(8))  # bullish/bearish
    candle_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)


class LiquidityEvent(Base):
    """Liquidity sweeps: equal highs/lows, stop hunts."""

    __tablename__ = "liquidity_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), nullable=False, default="5m")
    event_type: Mapped[str] = mapped_column(String(24), nullable=False)  # equal_highs/equal_lows/stop_hunt
    price: Mapped[float] = mapped_column(Float, nullable=False)
    direction: Mapped[str | None] = mapped_column(String(8))
    candle_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)


class OrderBlock(Base):
    __tablename__ = "order_blocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), nullable=False, default="5m")
    direction: Mapped[str] = mapped_column(String(8), nullable=False)  # bullish/bearish
    top: Mapped[float] = mapped_column(Float, nullable=False)
    bottom: Mapped[float] = mapped_column(Float, nullable=False)
    mitigated: Mapped[bool] = mapped_column(Boolean, default=False)
    candle_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)


class FairValueGap(Base):
    __tablename__ = "fair_value_gaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), nullable=False, default="5m")
    direction: Mapped[str] = mapped_column(String(8), nullable=False)  # bullish/bearish
    gap_top: Mapped[float] = mapped_column(Float, nullable=False)
    gap_bottom: Mapped[float] = mapped_column(Float, nullable=False)
    filled: Mapped[bool] = mapped_column(Boolean, default=False)
    candle_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)


class VolumeImbalance(Base):
    __tablename__ = "volume_imbalances"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), nullable=False, default="5m")
    direction: Mapped[str] = mapped_column(String(8), nullable=False)
    gap_top: Mapped[float] = mapped_column(Float, nullable=False)
    gap_bottom: Mapped[float] = mapped_column(Float, nullable=False)
    ratio: Mapped[float | None] = mapped_column(Float)
    candle_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)


class BreakoutEvent(Base):
    """Volatility compression + strong range breakout events."""

    __tablename__ = "breakout_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    timeframe: Mapped[str] = mapped_column(String(8), nullable=False, default="5m")
    event_type: Mapped[str] = mapped_column(String(24), nullable=False)  # compression / breakout
    direction: Mapped[str | None] = mapped_column(String(8))
    level: Mapped[float | None] = mapped_column(Float)
    range_high: Mapped[float | None] = mapped_column(Float)
    range_low: Mapped[float | None] = mapped_column(Float)
    strength: Mapped[float | None] = mapped_column(Float)
    candle_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
