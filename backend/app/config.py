"""Application configuration loaded from environment variables."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = Field(
        default="postgresql+psycopg2://nse:nse@localhost:5432/nse_intel",
        alias="DATABASE_URL",
    )

    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    environment: str = Field(default="development", alias="ENVIRONMENT")

    # Stored as raw comma-separated strings so env vars like CORS_ORIGINS="*"
    # are not JSON-decoded by pydantic-settings; exposed as lists via properties.
    cors_origins_raw: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    index_symbols_raw: str = Field(default="NIFTY,BANKNIFTY,FINNIFTY", alias="INDEX_SYMBOLS")
    stock_symbols_raw: str = Field(
        default="RELIANCE,HDFCBANK,INFY,TCS,ICICIBANK", alias="STOCK_SYMBOLS"
    )

    nse_base_url: str = Field(default="https://www.nseindia.com", alias="NSE_BASE_URL")
    nse_request_timeout: float = Field(default=10.0, alias="NSE_REQUEST_TIMEOUT")
    nse_max_retries: int = Field(default=3, alias="NSE_MAX_RETRIES")
    nse_retry_backoff: float = Field(default=1.5, alias="NSE_RETRY_BACKOFF")

    refresh_interval_seconds: int = Field(default=30, alias="REFRESH_INTERVAL_SECONDS")
    use_mock_nse: bool = Field(default=True, alias="USE_MOCK_NSE")

    @property
    def cors_origins(self) -> list[str]:
        return _split_csv(self.cors_origins_raw)

    @property
    def index_symbols(self) -> list[str]:
        return _split_csv(self.index_symbols_raw)

    @property
    def stock_symbols(self) -> list[str]:
        return _split_csv(self.stock_symbols_raw)

    @property
    def all_symbols(self) -> list[str]:
        return [*self.index_symbols, *self.stock_symbols]

    def is_index(self, symbol: str) -> bool:
        return symbol.upper() in {s.upper() for s in self.index_symbols}


@lru_cache
def get_settings() -> Settings:
    return Settings()
