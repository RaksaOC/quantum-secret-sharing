"""FastAPI dependencies shared by the route modules."""

from functools import lru_cache

from app.repositories.session_store import InMemorySessionStore, SessionStore


@lru_cache
def get_session_store() -> SessionStore:
    """One in-memory store per process. Swap for Redis/SQLite if the demo needs persistence."""
    return InMemorySessionStore()
