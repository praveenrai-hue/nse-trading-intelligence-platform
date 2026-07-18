"""Option-chain analytics engine.

Pure functions computing OI, Change in OI, OI build-up / unwinding, Call & Put
writing, PCR, Max Pain and ATM OI concentration from a normalized OptionChain.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.services.nse_client import OptionChain, OptionLeg, OptionRow


@dataclass
class OIBuildup:
    strike: float
    option_type: str  # CE / PE
    buildup_type: str
    oi_change: float
    price_change_percent: float


@dataclass
class OptionAnalytics:
    symbol: str
    spot_price: float
    atm_strike: float
    pcr_oi: float
    pcr_volume: float
    put_oi_total: float
    call_oi_total: float
    put_volume_total: float
    call_volume_total: float
    max_pain: float
    max_pain_direction: str
    sentiment: str
    atm_oi_concentration: float
    call_writing_strikes: list[float]
    put_writing_strikes: list[float]
    buildups: list[OIBuildup]
    support_strike: float
    resistance_strike: float


def _nearest_strike(rows: list[OptionRow], spot: float) -> float:
    return min(rows, key=lambda r: abs(r.strike - spot)).strike


def compute_pcr(chain: OptionChain) -> tuple[float, float, float, float, float, float]:
    call_oi = sum(r.call.oi for r in chain.rows)
    put_oi = sum(r.put.oi for r in chain.rows)
    call_vol = sum(r.call.volume for r in chain.rows)
    put_vol = sum(r.put.volume for r in chain.rows)
    pcr_oi = round(put_oi / call_oi, 3) if call_oi else 0.0
    pcr_vol = round(put_vol / call_vol, 3) if call_vol else 0.0
    return pcr_oi, pcr_vol, put_oi, call_oi, put_vol, call_vol


def compute_max_pain(chain: OptionChain) -> float:
    """Strike at which total option writer payout (loss) is minimized."""
    strikes = [r.strike for r in chain.rows]
    if not strikes:
        return 0.0
    best_strike = strikes[0]
    best_loss = float("inf")
    for expiry_price in strikes:
        total = 0.0
        for r in chain.rows:
            # Call writers lose when price > strike; put writers when price < strike.
            total += max(0.0, expiry_price - r.strike) * r.call.oi
            total += max(0.0, r.strike - expiry_price) * r.put.oi
        if total < best_loss:
            best_loss = total
            best_strike = expiry_price
    return best_strike


def classify_buildup(oi_change: float, price_change_pct: float) -> str:
    """Standard OI + price interpretation grid."""
    rising_oi = oi_change > 0
    rising_price = price_change_pct >= 0
    if rising_oi and rising_price:
        return "long_buildup"
    if rising_oi and not rising_price:
        return "short_buildup"
    if not rising_oi and rising_price:
        return "short_covering"
    return "long_unwinding"


def analyze_chain(chain: OptionChain, writing_threshold: float = 0.0) -> OptionAnalytics:
    spot = chain.spot_price or (_nearest_strike(chain.rows, 0) if chain.rows else 0.0)
    atm = _nearest_strike(chain.rows, spot) if chain.rows else 0.0

    pcr_oi, pcr_vol, put_oi, call_oi, put_vol, call_vol = compute_pcr(chain)
    max_pain = compute_max_pain(chain)

    # ATM OI concentration: fraction of total OI sitting in the ±1 strike band.
    total_oi = call_oi + put_oi
    band = {atm}
    strikes_sorted = sorted(r.strike for r in chain.rows)
    if atm in strikes_sorted:
        idx = strikes_sorted.index(atm)
        for j in (idx - 1, idx + 1):
            if 0 <= j < len(strikes_sorted):
                band.add(strikes_sorted[j])
    atm_oi = sum(r.call.oi + r.put.oi for r in chain.rows if r.strike in band)
    atm_concentration = round(atm_oi / total_oi, 4) if total_oi else 0.0

    # Writing detection: strong positive change in OI.
    call_writing = [r.strike for r in chain.rows if r.call.change_oi > writing_threshold and r.strike >= atm]
    put_writing = [r.strike for r in chain.rows if r.put.change_oi > writing_threshold and r.strike <= atm]

    # Build-up per leg, classified with the OI vs price interpretation grid.
    buildups: list[OIBuildup] = []
    for r in chain.rows:
        for leg, otype in ((r.call, "CE"), (r.put, "PE")):
            if abs(leg.change_oi) < 1e-6:
                continue
            price_change_pct = (leg.change_oi / leg.oi * 100.0) if leg.oi else 0.0
            buildups.append(
                OIBuildup(
                    strike=r.strike,
                    option_type=otype,
                    buildup_type=classify_buildup(leg.change_oi, _leg_price_direction(leg)),
                    oi_change=leg.change_oi,
                    price_change_percent=round(price_change_pct, 2),
                )
            )

    max_pain_direction = "bullish" if max_pain < spot else "bearish" if max_pain > spot else "neutral"
    sentiment = _pcr_sentiment(pcr_oi)

    # Support = strike with highest put OI; resistance = highest call OI.
    support = max(chain.rows, key=lambda r: r.put.oi).strike if chain.rows else 0.0
    resistance = max(chain.rows, key=lambda r: r.call.oi).strike if chain.rows else 0.0

    return OptionAnalytics(
        symbol=chain.symbol,
        spot_price=spot,
        atm_strike=atm,
        pcr_oi=pcr_oi,
        pcr_volume=pcr_vol,
        put_oi_total=put_oi,
        call_oi_total=call_oi,
        put_volume_total=put_vol,
        call_volume_total=call_vol,
        max_pain=max_pain,
        max_pain_direction=max_pain_direction,
        sentiment=sentiment,
        atm_oi_concentration=atm_concentration,
        call_writing_strikes=sorted(call_writing),
        put_writing_strikes=sorted(put_writing),
        buildups=buildups,
        support_strike=support,
        resistance_strike=resistance,
    )


def _leg_price_direction(leg: OptionLeg) -> float:
    """Approximate option price % change sign from a single snapshot.

    Without a previous close we use the standard writing heuristic: a strong
    increase in OI usually reflects fresh writing, under which the option's own
    premium tends to fall. This keeps build-up classification deterministic.
    Real feeds should pass the true price change instead.
    """
    return -1.0 if leg.change_oi > 0 else 1.0


def _pcr_sentiment(pcr_oi: float) -> str:
    if pcr_oi >= 1.3:
        return "bullish"
    if pcr_oi <= 0.7:
        return "bearish"
    return "neutral"
