"""Tests for the option-chain analytics engine."""

from __future__ import annotations

from app.services.nse_client import OptionChain, OptionLeg, OptionRow
from app.services.options_analytics import (
    analyze_chain,
    classify_buildup,
    compute_max_pain,
    compute_pcr,
)
from app.services.options_scoring import score_options


def _chain() -> OptionChain:
    rows = [
        OptionRow(100, call=OptionLeg(oi=100, volume=50), put=OptionLeg(oi=300, volume=150)),
        OptionRow(110, call=OptionLeg(oi=200, volume=80), put=OptionLeg(oi=250, volume=120)),
        OptionRow(120, call=OptionLeg(oi=400, volume=200), put=OptionLeg(oi=100, volume=40)),
    ]
    return OptionChain(symbol="TEST", expiry="01-Jan-2025", spot_price=110, rows=rows)


def test_compute_pcr():
    pcr_oi, pcr_vol, put_oi, call_oi, _, _ = compute_pcr(_chain())
    assert call_oi == 700
    assert put_oi == 650
    assert pcr_oi == round(650 / 700, 3)


def test_compute_max_pain_returns_valid_strike():
    mp = compute_max_pain(_chain())
    assert mp in {100, 110, 120}


def test_classify_buildup_grid():
    assert classify_buildup(10, 5) == "long_buildup"
    assert classify_buildup(10, -5) == "short_buildup"
    assert classify_buildup(-10, 5) == "short_covering"
    assert classify_buildup(-10, -5) == "long_unwinding"


def test_analyze_chain_atm_and_scores():
    analytics = analyze_chain(_chain())
    assert analytics.atm_strike == 110
    assert 0.0 <= analytics.atm_oi_concentration <= 1.0
    score = score_options(analytics)
    assert 0 <= score.bullish_score <= 100
    assert 0 <= score.bearish_score <= 100
    assert 0 <= score.confidence_score <= 100
    assert score.sentiment in {"bullish", "bearish", "neutral"}
