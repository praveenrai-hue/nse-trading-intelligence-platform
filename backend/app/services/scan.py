"""Combined scanner orchestration.

Ties together NSE ingestion -> option analytics -> smart-money analysis ->
scoring -> combined bias for one or many symbols.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.config import get_settings
from app.logging_config import get_logger
from app.services.nse_client import NSEClient, NSEDataError, get_nse_client
from app.services.options_analytics import OptionAnalytics, analyze_chain
from app.services.options_scoring import score_options
from app.services.smart_money import SmartMoneyResult, analyze_smart_money
from app.services.smart_money_scoring import CombinedBias, combine_bias, score_smart_money

logger = get_logger(__name__)


@dataclass
class SymbolAnalysis:
    symbol: str
    spot_price: float | None
    option_analytics: OptionAnalytics | None
    smart_money: SmartMoneyResult | None
    combined: CombinedBias | None
    error: str | None = None


def analyze_symbol(symbol: str, client: NSEClient | None = None) -> SymbolAnalysis:
    client = client or get_nse_client()
    try:
        chain = client.get_option_chain(symbol)
    except NSEDataError as exc:
        logger.error("scan_symbol_failed", symbol=symbol, error=str(exc))
        return SymbolAnalysis(symbol.upper(), None, None, None, None, error=str(exc))

    analytics = analyze_chain(chain)
    option_score = score_options(analytics)

    candles = client.get_candles(symbol)
    sm_result = analyze_smart_money(symbol, candles)
    sm_score = score_smart_money(sm_result)

    combined = combine_bias(option_score, sm_score)

    return SymbolAnalysis(
        symbol=symbol.upper(),
        spot_price=analytics.spot_price,
        option_analytics=analytics,
        smart_money=sm_result,
        combined=combined,
    )


def scan_symbols(symbols: list[str] | None = None, client: NSEClient | None = None) -> list[SymbolAnalysis]:
    settings = get_settings()
    symbols = symbols or settings.all_symbols
    client = client or get_nse_client()
    results: list[SymbolAnalysis] = []
    for sym in symbols:
        results.append(analyze_symbol(sym, client))
    return results
