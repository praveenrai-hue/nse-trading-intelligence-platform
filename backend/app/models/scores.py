"""Combined scan result / scoring snapshot per symbol."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    spot_price: Mapped[float | None] = mapped_column(Float)

    # Option-chain scores
    bullish_score: Mapped[float] = mapped_column(Float, default=0.0)
    bearish_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)

    # Smart-money scores
    structure_score: Mapped[float] = mapped_column(Float, default=0.0)
    liquidity_score: Mapped[float] = mapped_column(Float, default=0.0)
    smart_money_score: Mapped[float] = mapped_column(Float, default=0.0)

    # Direction labels
    direction: Mapped[str] = mapped_column(String(16), default="Neutral")  # Bullish/Bearish/Neutral
    structure_bias: Mapped[str] = mapped_column(String(24), default="Neutral Structure")

    reasons: Mapped[str | None] = mapped_column(Text)  # JSON-encoded list of reason strings
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
