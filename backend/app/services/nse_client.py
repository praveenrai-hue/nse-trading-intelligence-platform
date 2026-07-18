"""NSE data-source client.

Fetches live option-chain and OHLCV data from NSE with retry/backoff and
graceful fallback to deterministic synthetic data (useful offline / in CI).

NSE requires a browser-like session: you must first hit the homepage to obtain
cookies before calling the JSON API endpoints, and it aggressively rate-limits
scripted access. This client handles cookie priming, retries and timeouts.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone

import httpx
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.config import Settings, get_settings
from app.logging_config import get_logger

logger = get_logger(__name__)

_BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/option-chain",
}

# Approximate reference spot prices used to seed synthetic data.
_REFERENCE_SPOT = {
    "NIFTY": 24000.0,
    "BANKNIFTY": 51000.0,
    "FINNIFTY": 23000.0,
    "RELIANCE": 2900.0,
    "HDFCBANK": 1650.0,
    "INFY": 1550.0,
    "TCS": 3900.0,
    "ICICIBANK": 1150.0,
}

_STRIKE_STEP = {
    "NIFTY": 50.0,
    "BANKNIFTY": 100.0,
    "FINNIFTY": 50.0,
}


class NSEDataError(RuntimeError):
    """Raised when NSE data cannot be retrieved."""


@dataclass
class OptionLeg:
    oi: float = 0.0
    change_oi: float = 0.0
    volume: float = 0.0
    iv: float = 0.0
    ltp: float = 0.0


@dataclass
class OptionRow:
    strike: float
    call: OptionLeg = field(default_factory=OptionLeg)
    put: OptionLeg = field(default_factory=OptionLeg)


@dataclass
class OptionChain:
    symbol: str
    expiry: str
    spot_price: float
    rows: list[OptionRow]


@dataclass
class CandleData:
    time: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class NSEClient:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self._client: httpx.Client | None = None

    # -- HTTP session management -------------------------------------------------
    def _session(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(
                base_url=self.settings.nse_base_url,
                headers=_BROWSER_HEADERS,
                timeout=self.settings.nse_request_timeout,
                follow_redirects=True,
            )
            self._prime_cookies()
        return self._client

    def _prime_cookies(self) -> None:
        assert self._client is not None
        try:
            self._client.get("/")
            self._client.get("/option-chain")
        except httpx.HTTPError as exc:  # pragma: no cover - network dependent
            logger.warning("nse_cookie_prime_failed", error=str(exc))

    def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None

    def _endpoint(self, symbol: str) -> str:
        if self.settings.is_index(symbol):
            return f"/api/option-chain-indices?symbol={symbol.upper()}"
        return f"/api/option-chain-equities?symbol={symbol.upper()}"

    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1.5, min=1, max=10),
        retry=retry_if_exception_type((httpx.HTTPError, NSEDataError)),
    )
    def _fetch_raw_chain(self, symbol: str) -> dict:
        client = self._session()
        resp = client.get(self._endpoint(symbol))
        if resp.status_code == 429:
            logger.warning("nse_rate_limited", symbol=symbol)
            raise NSEDataError("rate limited")
        resp.raise_for_status()
        data = resp.json()
        if "records" not in data:
            raise NSEDataError("unexpected payload")
        return data

    # -- Public API --------------------------------------------------------------
    def get_option_chain(self, symbol: str) -> OptionChain:
        if self.settings.use_mock_nse:
            return self._mock_option_chain(symbol)
        try:
            raw = self._fetch_raw_chain(symbol)
            return self._parse_chain(symbol, raw)
        except (httpx.HTTPError, NSEDataError, ValueError, KeyError) as exc:
            logger.error("nse_option_chain_failed", symbol=symbol, error=str(exc))
            raise NSEDataError(f"failed to fetch option chain for {symbol}: {exc}") from exc

    def get_candles(self, symbol: str, count: int = 120) -> list[CandleData]:
        # NSE does not offer a clean public intraday OHLCV endpoint; production
        # deployments plug in a broker feed here. We generate deterministic
        # synthetic candles so the smart-money engine is fully exercisable.
        return self._mock_candles(symbol, count)

    # -- Parsing -----------------------------------------------------------------
    @staticmethod
    def _parse_chain(symbol: str, raw: dict) -> OptionChain:
        records = raw["records"]
        spot = float(records.get("underlyingValue") or 0.0)
        expiries = records.get("expiryDates") or []
        expiry = expiries[0] if expiries else ""
        rows: list[OptionRow] = []
        for item in records.get("data", []):
            if expiry and item.get("expiryDate") != expiry:
                continue
            row = OptionRow(strike=float(item["strikePrice"]))
            ce = item.get("CE")
            pe = item.get("PE")
            if ce:
                row.call = OptionLeg(
                    oi=float(ce.get("openInterest", 0)),
                    change_oi=float(ce.get("changeinOpenInterest", 0)),
                    volume=float(ce.get("totalTradedVolume", 0)),
                    iv=float(ce.get("impliedVolatility", 0)),
                    ltp=float(ce.get("lastPrice", 0)),
                )
            if pe:
                row.put = OptionLeg(
                    oi=float(pe.get("openInterest", 0)),
                    change_oi=float(pe.get("changeinOpenInterest", 0)),
                    volume=float(pe.get("totalTradedVolume", 0)),
                    iv=float(pe.get("impliedVolatility", 0)),
                    ltp=float(pe.get("lastPrice", 0)),
                )
            rows.append(row)
        rows.sort(key=lambda r: r.strike)
        return OptionChain(symbol=symbol.upper(), expiry=expiry, spot_price=spot, rows=rows)

    # -- Synthetic data ----------------------------------------------------------
    def _rng(self, symbol: str) -> random.Random:
        # Seed by symbol + current minute so data "moves" but is reproducible
        # within a refresh window.
        seed = f"{symbol.upper()}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}"
        return random.Random(seed)

    def _spot_for(self, symbol: str) -> float:
        return _REFERENCE_SPOT.get(symbol.upper(), 1000.0)

    def _mock_option_chain(self, symbol: str) -> OptionChain:
        symbol = symbol.upper()
        rng = self._rng(symbol)
        base = self._spot_for(symbol)
        drift = rng.uniform(-0.01, 0.01)
        spot = round(base * (1 + drift), 2)
        step = _STRIKE_STEP.get(symbol, max(round(base * 0.01 / 5) * 5, 5.0))
        atm = round(spot / step) * step
        rows: list[OptionRow] = []
        # Bias factor lets some symbols look bullish, others bearish.
        bias = rng.uniform(-1.0, 1.0)
        for i in range(-10, 11):
            strike = atm + i * step
            if strike <= 0:
                continue
            dist = abs(i)
            base_oi = max(1000.0, 200000.0 * math.exp(-((dist / 4.0) ** 2)))
            call_oi = base_oi * rng.uniform(0.6, 1.4)
            put_oi = base_oi * rng.uniform(0.6, 1.4)
            # Puts accumulate below spot (support), calls above (resistance).
            if i < 0:
                put_oi *= 1.3
            if i > 0:
                call_oi *= 1.3
            call_change = call_oi * rng.uniform(-0.2, 0.25) - bias * base_oi * 0.05
            put_change = put_oi * rng.uniform(-0.2, 0.25) + bias * base_oi * 0.05
            call_ltp = max(0.05, (spot - strike) if spot > strike else base * 0.002 / (dist + 1))
            put_ltp = max(0.05, (strike - spot) if strike > spot else base * 0.002 / (dist + 1))
            rows.append(
                OptionRow(
                    strike=strike,
                    call=OptionLeg(
                        oi=round(call_oi),
                        change_oi=round(call_change),
                        volume=round(call_oi * rng.uniform(0.1, 0.5)),
                        iv=round(rng.uniform(10, 25), 2),
                        ltp=round(call_ltp, 2),
                    ),
                    put=OptionLeg(
                        oi=round(put_oi),
                        change_oi=round(put_change),
                        volume=round(put_oi * rng.uniform(0.1, 0.5)),
                        iv=round(rng.uniform(10, 25), 2),
                        ltp=round(put_ltp, 2),
                    ),
                )
            )
        expiry = (datetime.now(timezone.utc) + timedelta(days=(3 - datetime.now().weekday()) % 7)).strftime(
            "%d-%b-%Y"
        )
        return OptionChain(symbol=symbol, expiry=expiry, spot_price=spot, rows=rows)

    def _mock_candles(self, symbol: str, count: int) -> list[CandleData]:
        symbol = symbol.upper()
        rng = random.Random(f"{symbol}-candles-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}")
        base = self._spot_for(symbol)
        price = base * 0.98
        vol_unit = base * 0.0025
        candles: list[CandleData] = []
        start = datetime.now(timezone.utc) - timedelta(minutes=5 * count)
        trend = rng.choice([1, 1, -1])
        for i in range(count):
            # Inject a compression phase and a breakout so detectors have signal.
            phase = i / count
            local_vol = vol_unit * (0.3 if 0.5 < phase < 0.65 else 1.0)
            drift = trend * vol_unit * 0.15 * (2.0 if phase > 0.65 else 1.0)
            # Occasionally open with a gap so volume-imbalance detection is exercised.
            gap = rng.uniform(0.4, 1.0) * local_vol * trend if rng.random() < 0.12 else 0.0
            open_p = price + gap
            close_p = open_p + rng.uniform(-local_vol, local_vol) + drift
            high_p = max(open_p, close_p) + abs(rng.uniform(0, local_vol))
            low_p = min(open_p, close_p) - abs(rng.uniform(0, local_vol))
            volume = rng.uniform(5000, 15000) * (2.5 if phase > 0.65 else 1.0)
            candles.append(
                CandleData(
                    time=start + timedelta(minutes=5 * i),
                    open=round(open_p, 2),
                    high=round(high_p, 2),
                    low=round(low_p, 2),
                    close=round(close_p, 2),
                    volume=round(volume, 2),
                )
            )
            price = close_p
        return candles


_client_singleton: NSEClient | None = None


def get_nse_client() -> NSEClient:
    global _client_singleton
    if _client_singleton is None:
        _client_singleton = NSEClient()
    return _client_singleton
