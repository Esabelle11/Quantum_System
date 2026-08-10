from app.exchange.bybit_rest import BybitREST
from app.storage.respiratories.oi_repository import OIRepository
from datetime import datetime, timezone
import time
from app.helper.retry import retry_async

class OICollector:

    def __init__(self):
        self.exchange = BybitREST()
        self.repository = OIRepository()

    async def collect(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "5min",
        limit: int = 200,
    ):
        response = await self.exchange.get_open_interest(
            symbol=symbol,
            interval=interval,
            limit=limit,
        )

        records = []

        for item in response["result"]["list"]:
            records.append({
                "symbol": symbol,
                "timestamp": datetime.fromtimestamp(
                    int(item["timestamp"]) / 1000,
                    tz=timezone.utc,
                ),
                "open_interest": float(item["openInterest"]),
            })

        if records:
            self.repository.insert_many(records)

        return records


    async def collect_store(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "5min",
        limit: int = 200,
        end: int | None = None,
    ):
        print("end: ",end );
        if end is None:
            end = int(time.time() * 1000)

        total = 0

        while True:

            response = await retry_async(
                lambda: self.exchange.get_open_interest(
                    symbol=symbol,
                    interval=interval,
                    limit=limit,
                    end=end,
                ),
                retries=5,
                delay=2,
            )

            items = response["result"]["list"]

            if not items:
                break

            records = []

            for item in items:
                records.append({
                    "symbol": symbol,
                    "timestamp": datetime.fromtimestamp(
                        int(item["timestamp"]) / 1000,
                        tz=timezone.utc,
                    ),
                    "open_interest": float(item["openInterest"]),
                })

            self.repository.insert_many(records)

            total += len(records)

            # Find the oldest candle in this batch
            oldest_timestamp = min(
                int(item["timestamp"])
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

       