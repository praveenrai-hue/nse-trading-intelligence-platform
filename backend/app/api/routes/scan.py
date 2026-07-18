"""Combined scanner endpoints (option-chain + smart-money bias)."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.mappers import analysis_to_scan_row
from app.database import get_db
from app.schemas.scan import ScanResponse, ScanRow
from app.services.ingestion import persist_analysis
from app.services.scan import analyze_symbol, scan_symbols

router = APIRouter(tags=["scan"])


@router.get("/scan", response_model=ScanResponse)
def get_scan(
    symbols: str | None = Query(default=None, description="Comma separated symbols to scan"),
    persist: bool = Query(default=False, description="Persist results to DB"),
    db: Session = Depends(get_db),
) -> ScanResponse:
    symbol_list = [s.strip() for s in symbols.split(",")] if symbols else None
    analyses = scan_symbols(symbol_list)
    rows: list[ScanRow] = []
    for analysis in analyses:
        rows.append(analysis_to_scan_row(analysis))
        if persist:
            try:
                persist_analysis(db, analysis)
            except Exception:  # noqa: BLE001
                db.rollback()
    rows.sort(key=lambda r: r.confidence_score, reverse=True)
    return ScanResponse(generated_at=datetime.now(timezone.utc).isoformat(), results=rows)


@router.get("/scan/{symbol}", response_model=ScanRow)
def get_scan_symbol(symbol: str) -> ScanRow:
    analysis = analyze_symbol(symbol)
    if analysis.error:
        raise HTTPException(status_code=503, detail=analysis.error)
    return analysis_to_scan_row(analysis)
