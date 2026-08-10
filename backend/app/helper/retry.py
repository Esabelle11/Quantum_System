
import asyncio
import logging
from collections.abc import Awaitable, Callable
from typing import TypeVar

import httpx

T = TypeVar("T")

logger = logging.getLogger(__name__)


RETRYABLE_EXCEPTIONS = (
    httpx.ReadTimeout,
    httpx.ConnectTimeout,
    httpx.NetworkError,
)


async def retry_async(
    fn: Callable[[], Awaitable[T]],
    retries: int = 5,
    delay: float = 1.0,
) -> T:
    last_error: Exception | None = None

    for attempt in range(retries):
        try:
            return await fn()

        except RETRYABLE_EXCEPTIONS as exc:
            last_error = exc

            logger.warning(
                "Attempt %d/%d failed with %s: %s",
                attempt + 1,
                retries,
                type(exc).__name__,
                exc,
            )

            if attempt < retries - 1:
                wait_time = delay * (2 ** attempt)

                logger.info(
                    "Retrying in %.1f seconds...",
                    wait_time,
                )

                await asyncio.sleep(wait_time)

    if last_error is not None:
        raise last_error

    raise RuntimeError("Retry failed without an exception")

