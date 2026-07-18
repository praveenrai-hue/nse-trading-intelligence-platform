"""Option-chain scoring engine.

Converts OptionAnalytics into Bullish (0-100), Bearish (0-100) and Confidence
(0-100) scores plus human-readable reasons.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.services.options_analytics import OptionAnalytics


@dataclass
class OptionScore:
    bullish_score: float
    bearish_score: float
    confidence_score: float
    sentiment: str  # bullish / bearish / neutral
    reasons: list[str] = field(default_factory=list)


def _clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def score_options(analytics: OptionAnalytics) -> OptionScore:
    bull = 0.0
    bear = 0.0
    reasons: list[str] = []

    # 1. PCR (OI) --------------------------------------------------------------
    pcr = analytics.pcr_oi
    if pcr >= 1.5:
        bull += 25
        reasons.append(f"PCR high at {pcr} (Put writing dominant)")
    elif pcr >= 1.1:
        bull += 15
        reasons.append(f"PCR rising at {pcr}")
    elif pcr <= 0.6:
        bear += 25
        reasons.append(f"PCR low at {pcr} (Call writing dominant)")
    elif pcr <= 0.9:
        bear += 15
        reasons.append(f"PCR weak at {pcr}")

    # 2. Max Pain vs spot ------------------------------------------------------
    if analytics.spot_price:
        gap_pct = (analytics.max_pain - analytics.spot_price) / analytics.spot_price * 100.0
        if gap_pct < -0.3:
            bull += 15
            reasons.append(f"Max Pain {analytics.max_pain:g} below spot (upward pull)")
        elif gap_pct > 0.3:
            bear += 15
            reasons.append(f"Max Pain {analytics.max_pain:g} above spot (downward pull)")

    # 3. Writing activity ------------------------------------------------------
    put_writing = _net_writing(analytics, "PE")
    call_writing = _net_writing(analytics, "CE")
    if put_writing > call_writing and put_writing > 0:
        bull += 20
        reasons.append("Strong Put Writing (support building)")
    elif call_writing > put_writing and call_writing > 0:
        bear += 20
        reasons.append("Strong Call Writing (resistance building)")

    # 4. OI build-up mix -------------------------------------------------------
    long_buildup = sum(1 for b in analytics.buildups if b.buildup_type == "long_buildup")
    short_buildup = sum(1 for b in analytics.buildups if b.buildup_type == "short_buildup")
    short_covering = sum(1 for b in analytics.buildups if b.buildup_type == "short_covering")
    long_unwinding = sum(1 for b in analytics.buildups if b.buildup_type == "long_unwinding")
    if long_buildup + short_covering > short_buildup + long_unwinding:
        bull += 15
        reasons.append("OI build-up skewed long / short covering")
    elif short_buildup + long_unwinding > long_buildup + short_covering:
        bear += 15
        reasons.append("OI build-up skewed short / long unwinding")

    # 5. Support / resistance proximity ---------------------------------------
    if analytics.spot_price:
        if analytics.support_strike and abs(analytics.spot_price - analytics.support_strike) < abs(
            analytics.spot_price - analytics.resistance_strike
        ):
            bull += 10
            reasons.append(f"Spot near Put support {analytics.support_strike:g}")
        elif analytics.resistance_strike:
            bear += 10
            reasons.append(f"Spot near Call resistance {analytics.resistance_strike:g}")

    bull = _clamp(bull)
    bear = _clamp(bear)

    if bull > bear + 10:
        sentiment = "bullish"
    elif bear > bull + 10:
        sentiment = "bearish"
    else:
        sentiment = "neutral"

    # Confidence: how decisive the signal is + how concentrated OI is.
    separation = abs(bull - bear)
    confidence = _clamp(separation * 0.8 + analytics.atm_oi_concentration * 40.0)

    return OptionScore(
        bullish_score=round(bull, 1),
        bearish_score=round(bear, 1),
        confidence_score=round(confidence, 1),
        sentiment=sentiment,
        reasons=reasons,
    )


def _net_writing(analytics: OptionAnalytics, otype: str) -> float:
    return sum(
        b.oi_change for b in analytics.buildups if b.option_type == otype and b.oi_change > 0
    )
