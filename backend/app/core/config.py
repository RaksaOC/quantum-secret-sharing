"""Application settings, read from environment variables prefixed with ``QSS_``."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="QSS_", env_file=".env", extra="ignore")

    app_name: str = "Quantum Secret Sharing API"
    api_prefix: str = "/api"
    cors_origins: list[str] = ["http://localhost:3200", "http://127.0.0.1:3200"]

    # Protocol defaults
    default_shots: int = 1024
    key_bits: int = 256
    """Length of the dealer key K that the HBB rounds must produce (AES-256)."""
    check_fraction: float = 0.25
    """Share of sifted rounds spent as check rounds to estimate the error rate."""
    abort_threshold: float = 0.11
    """Error rate above which the distribution is aborted (spy or too much noise)."""
    max_participants: int = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()
