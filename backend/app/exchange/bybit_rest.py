import httpx

from app.config.settings import settings


class BybitREST:

    def __init__(self):

        if settings.bybit_testnet:
            self.base_url = "https://api-testnet.bybit.com"
        else:
            self.base_url = "https://api.bybit.com"

    async def get_ticker(
        self,
        symbol: str = "BTCUSDT",
    ):

        url = f"{self.base_url}/v5/market/tickers"

        params = {
            "category": settings.category,
            "symbol": symbol,
        }

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                params=params,
            )

            response.raise_for_status()

            return response.json()

    async def get_klines(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "1",
        limit: int = 1000,
        start: int | None = None,
        end: int | None = None,
    ):
        url = f"{self.base_url}/v5/market/kline"
       

        params = {
            "category": settings.category,
            "symbol": symbol,
            "interval": interval,
            "limit": limit,
        }

        if start is not None:
            params["start"] = start

        if end is not None:
            params["end"] = end

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=params,
            )

            response.raise_for_status()

            return response.json()

    async def get_funding_history(
        self,
        symbol: str = "BTCUSDT",
        limit: int = 200,
        start: int | None = None,
        end: int | None = None,
    ):

        url = f"{self.base_url}/v5/market/funding/history"

        params = {
            "category": settings.category,
            "symbol": symbol,
            "limit": limit,
        }

        if start is not None:
            params["startTime"] = start

        if end is not None:
            params["endTime"] = end

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                params=params,
            )

            response.raise_for_status()

            return response.json()

    async def get_open_interest(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "5min",
        limit: int = 200,
        start: int | None = None,
        end: int | None = None,
    ):

        url = f"{self.base_url}/v5/market/open-interest"

        params = {
            "category": settings.category,
            "symbol": symbol,
            "intervalTime": interval,
            "limit": limit,
        }

        if start is not None:
            params["startTime"] = start

        if end is not None:
            params["endTime"] = end

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                params=params,
            )

            response.raise_for_status()

            return response.json()