from app.exchange.bybit_rest import BybitREST
from app.storage.respiratories.kline_repository import KlineRepository
import time
from datetime import datetime, timezone
from app.helper.retry import retry_async

class KlineCollector:

    def __init__(self):
        self.exchange = BybitREST()
        self.repository = KlineRepository()

    async def collect(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "1",
        limit: int = 200,
    ):
        response = await self.exchange.get_klines(
            symbol=symbol,
            interval=interval,
            limit=limit,
        )

        return response["result"]["list"]

    async def collect_store(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "1",
        limit: int = 1000,
        end: int | None = None,
    ):
        print("end: ",end );
        if end is None:
            end = int(time.time() * 1000)

        total = 0

        while True:

            response = await retry_async(
                lambda: self.exchange.get_klines(
                    symbol=symbol,
                    interval=interval,
                    limit=limit,
                    end=end,
                ),
                retries=5,
                delay=2,
            )

            # response = await self.exchange.get_klines(
            #     symbol=symbol,
            #     interval=interval,
            #     limit=limit,
            #     end=end,
            # )

            items = response["result"]["list"]

            if not items:
                break

            records = []

            for item in items:
                records.append({
                    "symbol": symbol,
                    "timestamp": datetime.fromtimestamp(
                        int(item[0]) / 1000,
                        tz=timezone.utc,
                    ),
                    "open": float(item[1]),
                    "high": float(item[2]),
                    "low": float(item[3]),
                    "close": float(item[4]),
                    "volume": float(item[5]),
                    "turnover": float(item[6]),
                    "interval": interval,
                })

            self.repository.insert_many(records)

            total += len(records)

            # Find the oldest candle in this batch
            oldest_timestamp = min(
                int(item[0])
                for item in items
            )

            # Move backwards
            end = oldest_timestamp - 1

            print(
                f"Stored {len(records)} candles | "
                f"Total: {total} | "
                f"Oldest: {datetime.fromtimestamp(oldest_timestamp / 1000, tz=timezone.utc)}"
            )

            # If fewer than limit came back,
            # we've probably reached the earliest available data.
            if len(items) < limit:
                break

        return total


