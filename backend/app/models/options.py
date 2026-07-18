"""Options data models."""

from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class OptionsContract(Base, TimestampMixin):
    __tablename__ = "options_contracts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    underlying_symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    strike_price: Mapped[float] = mapped_column(Float, nullable=False)
    option_type: Mapped[str] = mapped_column(String(4), nullable=False)  # CE / PE
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)

    last_price: Mapped[float | None] = mapped_column(Float)
    open_interest: Mapped[float | None] = mapped_column(Float)
    previous_open_interest: Mapped[float | None] = mapped_column(Float)
    change_in_oi: Mapped[float | None] = mapped_column(Float)
    volume: Mapped[float | None] = mapped_column(Float)
    implied_volatility: Mapped[float | None] = mapped_column(Float)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)

    __table_args__ = (
        Index("idx_options_contract_key", "underlying_symbol", "expiry_date", "strike_price", "option_type"),
    )


class OptionsChainHistory(Base):
    __tablename__ = "options_chain_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    underlying_symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    strike_price: Mapped[float] = mapped_column(Float, nullable=False)
    option_type: Mapped[str] = mapped_column(String(4), nullable=False)
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    oi_current: Mapped[float | None] = mapped_column(Float)
    oi_change: Mapped[float | None] = mapped_column(Float)
    oi_change_percent: Mapped[float | None] = mapped_column(Float)
    price_close: Mapped[float | None] = mapped_column(Float)
    price_change_percent: Mapped[float | None] = mapped_column(Float)
    implied_volatility: Mapped[float | None] = mapped_column(Float)
    buildup_type: Mapped[str | None] = mapped_column(String(24))
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)


class PCRAnalysis(Base):
    __tablename__ = "pcr_analysis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    underlying_symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    expiry_date: Mapped[date | None] = mapped_column(Date)
    pcr_oi: Mapped[float | None] = mapped_column(Float)
    pcr_volume: Mapped[float | None] = mapped_column(Float)
    put_oi_total: Mapped[float | None] = mapped_column(Float)
    call_oi_total: Mapped[float | None] = mapped_column(Float)
    put_volume_total: Mapped[float | None] = mapped_column(Float)
    call_volume_total: Mapped[float | None] = mapped_column(Float)
    max_pain_level: Mapped[float | None] = mapped_column(Float)
    max_pain_direction: Mapped[str | None] = mapped_column(String(16))
    sentiment: Mapped[str | None] = mapped_column(String(16))
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
