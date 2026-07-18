"""Smart-money / price-action analysis engine.

Implements ICT / SMC-style detectors operating on OHLCV candles:

* Market structure: swing points classified as HH / HL / LH / LL
* BOS (Break of Structure) and CHoCH (Change of Character)
* Liquidity sweeps: equal highs, equal lows, stop hunts
* Fair Value Gaps (FVG)
* Order Blocks
* Volume Imbalance
* Volatility Compression
* Strong Range Breakout

All detectors are pure functions over a list of candles so they are trivially
unit-testable and free of I/O.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.services.nse_client import CandleData


# --------------------------------------------------------------------------- #
# Result dataclasses
# --------------------------------------------------------------------------- #
@dataclass
class SwingPoint:
    type: str  # HH / HL / LH / LL
    price: float
    index: int
    time: str | None = None


@dataclass
class StructureShift:
    type: str  # BOS / CHoCH
    direction: str  # bullish / bearish
    price: float
    index: int
    time: str | None = None


@dataclass
class LiquidityZone:
    type: str  # equal_highs / equal_lows / stop_hunt
    price: float
    index: int
    direction: str | None = None
    time: str | None = None


@dataclass
class Zone:
    top: float
    bottom: float
    direction: str
    index: int
    time: str | None = None
    filled: bool = False


@dataclass
class BreakoutZone:
    type: str  # compression / breakout
    index: int
    direction: str | None = None
    level: float | None = None
    range_high: float | None = None
    range_low: float | None = None
    strength: float | None = None
    time: str | None = None


@dataclass
class SmartMoneyResult:
    symbol: str
    trend: str
    swing_points: list[SwingPoint] = field(default_factory=list)
    shifts: list[StructureShift] = field(default_factory=list)
    liquidity: list[LiquidityZone] = field(default_factory=list)
    fair_value_gaps: list[Zone] = field(default_factory=list)
    order_blocks: list[Zone] = field(default_factory=list)
    volume_imbalances: list[Zone] = field(default_factory=list)
    breakouts: list[BreakoutZone] = field(default_factory=list)


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _t(candle: CandleData) -> str:
    return candle.time.isoformat()


def _true_ranges(candles: list[CandleData]) -> list[float]:
    trs: list[float] = []
    for i, c in enumerate(candles):
        if i == 0:
            trs.append(c.high - c.low)
            continue
        prev_close = candles[i - 1].close
        trs.append(max(c.high - c.low, abs(c.high - prev_close), abs(c.low - prev_close)))
    return trs


# --------------------------------------------------------------------------- #
# Swing points & market structure
# --------------------------------------------------------------------------- #
def find_swings(candles: list[CandleData], lookback: int = 2) -> tuple[list[int], list[int]]:
    """Return indices of fractal swing highs and swing lows."""
    highs: list[int] = []
    lows: list[int] = []
    n = len(candles)
    for i in range(lookback, n - lookback):
        window = candles[i - lookback : i + lookback + 1]
        c = candles[i]
        if c.high == max(w.high for w in window) and all(
            c.high >= candles[j].high for j in range(i - lookback, i + lookback + 1) if j != i
        ):
            highs.append(i)
        if c.low == min(w.low for w in window) and all(
            c.low <= candles[j].low for j in range(i - lookback, i + lookback + 1) if j != i
        ):
            lows.append(i)
    return highs, lows


def classify_structure(
    candles: list[CandleData], lookback: int = 2
) -> tuple[list[SwingPoint], list[StructureShift], str]:
    high_idx, low_idx = find_swings(candles, lookback)
    events = sorted(
        [(i, "high") for i in high_idx] + [(i, "low") for i in low_idx], key=lambda x: x[0]
    )

    swing_points: list[SwingPoint] = []
    last_high: float | None = None
    last_low: float | None = None
    for idx, kind in events:
        c = candles[idx]
        if kind == "high":
            label = "HH" if last_high is not None and c.high > last_high else "LH"
            if last_high is None:
                label = "HH"
            swing_points.append(SwingPoint(type=label, price=c.high, index=idx, time=_t(c)))
            last_high = c.high
        else:
            label = "HL" if last_low is not None and c.low > last_low else "LL"
            if last_low is None:
                label = "LL"
            swing_points.append(SwingPoint(type=label, price=c.low, index=idx, time=_t(c)))
            last_low = c.low

    shifts = detect_structure_shifts(candles, high_idx, low_idx)
    trend = _infer_trend(swing_points)
    return swing_points, shifts, trend


def _infer_trend(swing_points: list[SwingPoint]) -> str:
    recent = swing_points[-4:]
    if not recent:
        return "range"
    labels = [p.type for p in recent]
    bull = labels.count("HH") + labels.count("HL")
    bear = labels.count("LH") + labels.count("LL")
    if bull > bear:
        return "uptrend"
    if bear > bull:
        return "downtrend"
    return "range"


def detect_structure_shifts(
    candles: list[CandleData], high_idx: list[int], low_idx: list[int]
) -> list[StructureShift]:
    """Detect BOS and CHoCH.

    BOS = continuation break (close beyond the most recent swing in the trend
    direction). CHoCH = the first break against the established trend.
    """
    shifts: list[StructureShift] = []
    swings = sorted(
        [(i, "high", candles[i].high) for i in high_idx]
        + [(i, "low", candles[i].low) for i in low_idx],
        key=lambda x: x[0],
    )
    if not swings:
        return shifts

    trend: str | None = None
    last_high: tuple[int, float] | None = None
    last_low: tuple[int, float] | None = None

    for i, c in enumerate(candles):
        if last_high is not None and c.close > last_high[1]:
            new_trend = "bullish"
            shift_type = "CHoCH" if trend == "bearish" else "BOS"
            if trend is None:
                shift_type = "BOS"
            shifts.append(
                StructureShift(type=shift_type, direction="bullish", price=last_high[1], index=i, time=_t(c))
            )
            trend = new_trend
            last_high = None  # require a new swing high before next break
        elif last_low is not None and c.close < last_low[1]:
            new_trend = "bearish"
            shift_type = "CHoCH" if trend == "bullish" else "BOS"
            if trend is None:
                shift_type = "BOS"
            shifts.append(
                StructureShift(type=shift_type, direction="bearish", price=last_low[1], index=i, time=_t(c))
            )
            trend = new_trend
            last_low = None

        # Update the reference swing highs/lows up to this candle.
        for si, kind, price in swings:
            if si == i:
                if kind == "high":
                    last_high = (si, price)
                else:
                    last_low = (si, price)
    return shifts


# --------------------------------------------------------------------------- #
# Liquidity
# --------------------------------------------------------------------------- #
def detect_liquidity(
    candles: list[CandleData], lookback: int = 2, tolerance: float = 0.001
) -> list[LiquidityZone]:
    high_idx, low_idx = find_swings(candles, lookback)
    zones: list[LiquidityZone] = []

    # Equal highs / equal lows (resting liquidity).
    for group, kind in ((high_idx, "high"), (low_idx, "low")):
        for a, b in zip(group, group[1:], strict=False):
            pa = candles[a].high if kind == "high" else candles[a].low
            pb = candles[b].high if kind == "high" else candles[b].low
            if pa and abs(pa - pb) / pa <= tolerance:
                zones.append(
                    LiquidityZone(
                        type="equal_highs" if kind == "high" else "equal_lows",
                        price=round((pa + pb) / 2, 2),
                        index=b,
                        direction="bearish" if kind == "high" else "bullish",
                        time=_t(candles[b]),
                    )
                )

    # Stop hunts: wick pierces a prior swing then candle closes back inside.
    for i in high_idx:
        for j in range(i + 1, min(i + lookback * 4, len(candles))):
            c = candles[j]
            if c.high > candles[i].high and c.close < candles[i].high:
                zones.append(
                    LiquidityZone(
                        type="stop_hunt", price=candles[i].high, index=j, direction="bearish", time=_t(c)
                    )
                )
                break
    for i in low_idx:
        for j in range(i + 1, min(i + lookback * 4, len(candles))):
            c = candles[j]
            if c.low < candles[i].low and c.close > candles[i].low:
                zones.append(
                    LiquidityZone(
                        type="stop_hunt", price=candles[i].low, index=j, direction="bullish", time=_t(c)
                    )
                )
                break
    return zones


# --------------------------------------------------------------------------- #
# Fair Value Gaps
# --------------------------------------------------------------------------- #
def detect_fvg(candles: list[CandleData]) -> list[Zone]:
    zones: list[Zone] = []
    for i in range(2, len(candles)):
        a, c = candles[i - 2], candles[i]
        # Bullish FVG: gap between candle a.high and candle c.low.
        if c.low > a.high:
            filled = any(candles[k].low <= a.high for k in range(i + 1, len(candles)))
            zones.append(
                Zone(top=c.low, bottom=a.high, direction="bullish", index=i, time=_t(c), filled=filled)
            )
        # Bearish FVG: gap between candle c.high and candle a.low.
        elif c.high < a.low:
            filled = any(candles[k].high >= a.low for k in range(i + 1, len(candles)))
            zones.append(
                Zone(top=a.low, bottom=c.high, direction="bearish", index=i, time=_t(c), filled=filled)
            )
    return zones


# --------------------------------------------------------------------------- #
# Order Blocks
# --------------------------------------------------------------------------- #
def detect_order_blocks(candles: list[CandleData], impulse_mult: float = 1.3) -> list[Zone]:
    """Last opposite candle before an impulsive move.

    Bullish OB: last bearish candle before a strong up move.
    Bearish OB: last bullish candle before a strong down move.

    The following candle qualifies as "impulsive" when its range exceeds
    ``impulse_mult`` times the average true range.
    """
    zones: list[Zone] = []
    trs = _true_ranges(candles)
    avg_tr = sum(trs) / len(trs) if trs else 0.0
    for i in range(1, len(candles) - 1):
        move = candles[i + 1]
        move_range = move.high - move.low
        if avg_tr and move_range < impulse_mult * avg_tr:
            continue
        prev = candles[i]
        if move.close > move.open and prev.close < prev.open:
            zones.append(
                Zone(top=prev.high, bottom=prev.low, direction="bullish", index=i, time=_t(prev))
            )
        elif move.close < move.open and prev.close > prev.open:
            zones.append(
                Zone(top=prev.high, bottom=prev.low, direction="bearish", index=i, time=_t(prev))
            )
    return zones


# --------------------------------------------------------------------------- #
# Volume Imbalance
# --------------------------------------------------------------------------- #
def detect_volume_imbalance(candles: list[CandleData]) -> list[Zone]:
    """Body-to-body gaps between consecutive candles (open != prior close)."""
    zones: list[Zone] = []
    for i in range(1, len(candles)):
        prev, cur = candles[i - 1], candles[i]
        if cur.open > prev.close and cur.low > prev.close:
            zones.append(
                Zone(top=cur.open, bottom=prev.close, direction="bullish", index=i, time=_t(cur))
            )
        elif cur.open < prev.close and cur.high < prev.close:
            zones.append(
                Zone(top=prev.close, bottom=cur.open, direction="bearish", index=i, time=_t(cur))
            )
    return zones


# --------------------------------------------------------------------------- #
# Volatility compression & breakouts
# --------------------------------------------------------------------------- #
def detect_compression_and_breakouts(
    candles: list[CandleData], window: int = 10, compression_ratio: float = 0.6
) -> list[BreakoutZone]:
    zones: list[BreakoutZone] = []
    trs = _true_ranges(candles)
    if len(candles) < window * 2:
        return zones

    for i in range(window * 2, len(candles)):
        recent = trs[i - window : i]
        prior = trs[i - window * 2 : i - window]
        recent_avg = sum(recent) / len(recent)
        prior_avg = sum(prior) / len(prior) if prior else 0.0
        if prior_avg and recent_avg / prior_avg <= compression_ratio:
            range_high = max(c.high for c in candles[i - window : i])
            range_low = min(c.low for c in candles[i - window : i])
            zones.append(
                BreakoutZone(
                    type="compression",
                    index=i,
                    range_high=range_high,
                    range_low=range_low,
                    strength=round(1 - recent_avg / prior_avg, 3),
                    time=_t(candles[i]),
                )
            )
            # Look ahead for a strong range breakout out of the compression.
            for j in range(i, min(i + window, len(candles))):
                c = candles[j]
                body = abs(c.close - c.open)
                expansion = body / (recent_avg or 1e-9)
                if c.close > range_high and expansion >= 1.2:
                    zones.append(
                        BreakoutZone(
                            type="breakout",
                            direction="bullish",
                            level=range_high,
                            index=j,
                            strength=round(expansion, 2),
                            time=_t(c),
                        )
                    )
                    break
                if c.close < range_low and expansion >= 1.2:
                    zones.append(
                        BreakoutZone(
                            type="breakout",
                            direction="bearish",
                            level=range_low,
                            index=j,
                            strength=round(expansion, 2),
                            time=_t(c),
                        )
                    )
                    break
    return zones


# --------------------------------------------------------------------------- #
# Top-level orchestration
# --------------------------------------------------------------------------- #
def analyze_smart_money(symbol: str, candles: list[CandleData], lookback: int = 2) -> SmartMoneyResult:
    swing_points, shifts, trend = classify_structure(candles, lookback)
    return SmartMoneyResult(
        symbol=symbol.upper(),
        trend=trend,
        swing_points=swing_points,
        shifts=shifts,
        liquidity=detect_liquidity(candles, lookback),
        fair_value_gaps=detect_fvg(candles),
        order_blocks=detect_order_blocks(candles),
        volume_imbalances=detect_volume_imbalance(candles),
        breakouts=detect_compression_and_breakouts(candles),
    )
