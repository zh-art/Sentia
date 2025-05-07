from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from collections import deque
from datetime import datetime, timedelta

request_timestamps = deque()

class RequestTrackerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/") or request.url.path.startswith("/chat") or request.url.path.startswith("/user"):
            now = datetime.utcnow()
            request_timestamps.append(now)
            cutoff = now - timedelta(minutes=1)
            while request_timestamps and request_timestamps[0] < cutoff:
                request_timestamps.popleft()

        response = await call_next(request)
        return response
