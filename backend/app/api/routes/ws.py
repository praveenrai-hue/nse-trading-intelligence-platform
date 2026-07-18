"""WebSocket endpoint streaming scan updates every refresh interval."""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.mappers import analysis_to_scan_row
from app.config import get_settings
from app.logging_config import get_logger
from app.services.scan import scan_symbols
from app.ws.manager import manager

router = APIRouter()
logger = get_logger(__name__)


@router.websocket("/ws/scan")
async def ws_scan(websocket: WebSocket) -> None:
    settings = get_settings()
    await manager.connect(websocket)
    try:
        while True:
            analyses = await asyncio.to_thread(scan_symbols)
            payload = {
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "results": [analysis_to_scan_row(a).model_dump() for a in analyses],
            }
            await websocket.send_json(payload)
            await asyncio.sleep(settings.refresh_interval_seconds)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as exc:  # noqa: BLE001
        logger.error("ws_scan_error", error=str(exc))
        await manager.disconnect(websocket)
