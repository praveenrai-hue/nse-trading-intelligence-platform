"""Tests for combined scoring and the FastAPI surface."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.services.options_scoring import OptionScore
from app.services.scan import analyze_symbol
from app.services.smart_money_scoring import SmartMoneyScore, combine_bias

client = TestClient(app)


def test_combine_bias_bounds():
    opt = OptionScore(bullish_score=80, bearish_score=20, confidence_score=70, sentiment="bullish")
    sm = SmartMoneyScore(
        structure_score=70,
        liquidity_score=65,
        smart_money_score=72,
        structure_bias="Bullish Structure",
    )
    combined = combine_bias(opt, sm)
    assert combined.direction == "Bullish"
    assert 0 <= combined.bullish_score <= 100
    assert 0 <= combined.confidence_score <= 100


def test_analyze_symbol_mock():
    analysis = analyze_symbol("NIFTY")
    assert analysis.error is None
    assert analysis.combined is not None
    assert analysis.combined.direction in {"Bullish", "Bearish", "Neutral"}


def test_health_endpoint():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_options_endpoints():
    for suffix in ("chain", "pcr", "max-pain", "oi-analysis"):
        resp = client.get(f"/api/v1/options/NIFTY/{suffix}")
        assert resp.status_code == 200, suffix


def test_smart_money_endpoints():
    for path in ("structure", "liquidity", "smart-money"):
        resp = client.get(f"/api/v1/{path}/NIFTY")
        assert resp.status_code == 200, path
    resp = client.get("/api/v1/smart-money/NIFTY")
    body = resp.json()
    assert "structure_score" in body
    assert body["structure_bias"] in {
        "Bullish Structure",
        "Bearish Structure",
        "Neutral Structure",
    }


def test_scan_endpoint():
    resp = client.get("/api/v1/scan?symbols=NIFTY,BANKNIFTY")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["results"]) == 2
    for row in data["results"]:
        assert row["direction"] in {"Bullish", "Bearish", "Neutral"}
