"""Tests for smart-money detectors."""

from __future__ import annotations

from app.services.smart_money import (
    analyze_smart_money,
    classify_structure,
    detect_compression_and_breakouts,
    detect_fvg,
    detect_liquidity,
    detect_order_blocks,
    find_swings,
)
from tests.conftest import make_candles


def test_find_swings(uptrend_candles):
    highs, lows = find_swings(uptrend_candles, lookback=1)
    assert highs
    assert lows


def test_classify_structure_uptrend(uptrend_candles):
    swings, shifts, trend = classify_structure(uptrend_candles, lookback=1)
    labels = {p.type for p in swings}
    assert "HH" in labels
    assert trend in {"uptrend", "range"}


def test_bos_detected_on_break():
    # Range then a decisive break above the range high.
    seq = [100, 102, 99, 101, 100, 102, 99, 110]
    candles = make_candles(seq)
    _, shifts, _ = classify_structure(candles, lookback=1)
    assert any(s.type in {"BOS", "CHoCH"} and s.direction == "bullish" for s in shifts)


def test_fvg_detection_bullish():
    # Third candle low well above first candle high -> bullish FVG.
    seq = [100, 101, 120, 121]
    candles = make_candles(seq, spread=0.2)
    gaps = detect_fvg(candles)
    assert any(z.direction == "bullish" for z in gaps)


def test_equal_highs_liquidity():
    seq = [100, 110, 100, 110.05, 100]
    candles = make_candles(seq, spread=0.1)
    zones = detect_liquidity(candles, lookback=1, tolerance=0.01)
    assert any(z.type == "equal_highs" for z in zones)


def test_order_blocks_and_breakouts_shapes():
    seq = [100, 100.5, 100.2, 100.4, 100.1, 100.3, 108, 109, 110]
    candles = make_candles(seq, spread=0.1)
    obs = detect_order_blocks(candles)
    brk = detect_compression_and_breakouts(candles, window=2, compression_ratio=1.5)
    assert isinstance(obs, list)
    assert isinstance(brk, list)


def test_analyze_smart_money_end_to_end(uptrend_candles):
    result = analyze_smart_money("TEST", uptrend_candles, lookback=1)
    assert result.symbol == "TEST"
    assert result.trend in {"uptrend", "downtrend", "range"}
    assert isinstance(result.swing_points, list)
