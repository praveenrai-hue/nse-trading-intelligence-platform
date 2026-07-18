"""Smart-money scoring and combined (options + structure) bias."""

from __future__ import annotations

from dataclasses import dataclass, field

from app.services.options_scoring import OptionScore
from app.services.smart_money import SmartMoneyResult


@dataclass
class SmartMoneyScore:
    structure_score: float
    liquidity_score: float
    smart_money_score: float
    structure_bias: str  # Bullish Structure / Bearish Structure / Neutral Structure
    reasons: list[str] = field(default_factory=list)


def _clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def score_smart_money(result: SmartMoneyResult) -> SmartMoneyScore:
    reasons: list[str] = []
    bull = 50.0
    bear = 50.0

    # Structure: trend + recent BOS/CHoCH -------------------------------------
    if result.trend == "uptrend":
        bull += 15
        reasons.append("Uptrend structure (HH/HL)")
    elif result.trend == "downtrend":
        bear += 15
        reasons.append("Downtrend structure (LH/LL)")

    recent_shifts = result.shifts[-3:]
    for shift in recent_shifts:
        weight = 12 if shift.type == "CHoCH" else 8
        if shift.direction == "bullish":
            bull += weight
            reasons.append(f"{shift.type} bullish at {shift.price:g}")
        else:
            bear += weight
            reasons.append(f"{shift.type} bearish at {shift.price:g}")

    structure_dir = bull - bear
    structure_score = _clamp(50 + structure_dir)

    # Liquidity ----------------------------------------------------------------
    liq_bull = sum(1 for z in result.liquidity if z.direction == "bullish")
    liq_bear = sum(1 for z in result.liquidity if z.direction == "bearish")
    liquidity_score = _clamp(50 + (liq_bull - liq_bear) * 12)
    if liq_bull > liq_bear:
        reasons.append("Bullish liquidity sweeps (lows swept)")
    elif liq_bear > liq_bull:
        reasons.append("Bearish liquidity sweeps (highs swept)")

    # Order blocks / FVG confluence -------------------------------------------
    ob_bull = sum(1 for z in result.order_blocks if z.direction == "bullish")
    ob_bear = sum(1 for z in result.order_blocks if z.direction == "bearish")
    fvg_bull = sum(1 for z in result.fair_value_gaps if z.direction == "bullish" and not z.filled)
    fvg_bear = sum(1 for z in result.fair_value_gaps if z.direction == "bearish" and not z.filled)
    breakout_bull = sum(1 for z in result.breakouts if z.type == "breakout" and z.direction == "bullish")
    breakout_bear = sum(1 for z in result.breakouts if z.type == "breakout" and z.direction == "bearish")

    if breakout_bull:
        reasons.append("Bullish range breakout")
    if breakout_bear:
        reasons.append("Bearish range breakout")

    confluence_bull = ob_bull + fvg_bull + breakout_bull * 2
    confluence_bear = ob_bear + fvg_bear + breakout_bear * 2

    smart_money_dir = (
        (structure_score - 50)
        + (liquidity_score - 50)
        + (confluence_bull - confluence_bear) * 5
    )
    smart_money_score = _clamp(50 + smart_money_dir)

    if smart_money_score >= 60:
        structure_bias = "Bullish Structure"
    elif smart_money_score <= 40:
        structure_bias = "Bearish Structure"
    else:
        structure_bias = "Neutral Structure"

    return SmartMoneyScore(
        structure_score=round(structure_score, 1),
        liquidity_score=round(liquidity_score, 1),
        smart_money_score=round(smart_money_score, 1),
        structure_bias=structure_bias,
        reasons=reasons,
    )


@dataclass
class CombinedBias:
    bullish_score: float
    bearish_score: float
    confidence_score: float
    structure_score: float
    liquidity_score: float
    smart_money_score: float
    direction: str  # Bullish / Bearish / Neutral
    structure_bias: str
    reasons: list[str] = field(default_factory=list)


def combine_bias(
    option_score: OptionScore,
    sm_score: SmartMoneyScore,
    option_weight: float = 0.55,
    smart_money_weight: float = 0.45,
) -> CombinedBias:
    """Merge option-chain sentiment with smart-money structure into one bias."""
    # Normalize option sentiment to a directional value in [-50, 50].
    option_dir = (option_score.bullish_score - option_score.bearish_score) / 2.0
    sm_dir = sm_score.smart_money_score - 50.0

    combined = option_weight * option_dir + smart_money_weight * sm_dir

    bullish = _clamp(50 + combined)
    bearish = _clamp(50 - combined)

    if combined > 8:
        direction = "Bullish"
    elif combined < -8:
        direction = "Bearish"
    else:
        direction = "Neutral"

    # Confidence rises when options and structure agree.
    agreement = 100 - abs(option_dir - sm_dir)
    confidence = _clamp(
        0.5 * option_score.confidence_score + 0.5 * max(0.0, agreement)
    )

    return CombinedBias(
        bullish_score=round(bullish, 1),
        bearish_score=round(bearish, 1),
        confidence_score=round(confidence, 1),
        structure_score=sm_score.structure_score,
        liquidity_score=sm_score.liquidity_score,
        smart_money_score=sm_score.smart_money_score,
        direction=direction,
        structure_bias=sm_score.structure_bias,
        reasons=[*option_score.reasons, *sm_score.reasons],
    )
