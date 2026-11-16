"""Where vault sessions live between requests (distribute -> encrypt -> unlock)."""

import threading
from typing import Protocol

from app.core.errors import SessionNotFound
from app.domain.models import VaultSession


class SessionStore(Protocol):
    def save(self, session: VaultSession) -> None: ...
    def get(self, session_id: str) -> VaultSession: ...
    def delete(self, session_id: str) -> None: ...


class InMemorySessionStore:
    """Good enough for a single-process demo. Lost on restart, by design."""

    def __init__(self) -> None:
        self._items: dict[str, VaultSession] = {}
        self._lock = threading.Lock()

    def save(self, session: VaultSession) -> None:
        with self._lock:
            self._items[session.id] = session

    def get(self, session_id: str) -> VaultSession:
        with self._lock:
            try:
                return self._items[session_id]
            except KeyError:
                raise SessionNotFound(session_id) from None

    def delete(self, session_id: str) -> None:
        with self._lock:
            self._items.pop(session_id, None)
