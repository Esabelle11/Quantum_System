from app.exchange.bybit_rest import BybitREST
from app.storage.respiratories.funding_repository import FundingRepository

from datetime import datetime, timezone
import time
from app.helper.retry import retry_async


from pathlib import Path

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

class FundingCollector:

    def __init__(self):
        self.exchange = BybitREST()
        self.repository = FundingRepository()

    async def collect(
        self,
        symbol: str = "BTCUSDT",
        limit: int = 200,
    ):
        response = await self.exchange.get_funding_history(
            symbol=symbol,
            limit=limit,
        )

        records = []

        for item in response["result"]["list"]:
            records.append({
                "symbol": symbol,
                "timestamp": datetime.fromtimestamp(
                    int(item["fundingRateTimestamp"]) / 1000,
                    tz=timezone.utc,
                ),
                "funding_rate": float(item["fundingRate"]),
            })

        if records:
            self.repository.insert_many(records)

        return records


    async def collect_store(
        self,
        symbol: str = "BTCUSDT",
        limit: int = 200,
        end: int | None = None,
        STORE_LOCAL: bool = False,
        local_path: str | Path | None = None,
    ):
        print("end: ",end );
        if end is None:
            end = int(time.time() * 1000)

        total = 0

        # ============================================================
        # Local Parquet configuration
        # ============================================================

        parquet_writer = None

        if STORE_LOCAL:

            if local_path is None:
                local_path = ( Path("data") / "raw" / f"funding_rates.parquet")

            local_path = Path(local_path)
            local_path.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            print(f"Storing locally to: {local_path}")
        
        try:

            while True:

                response = await retry_async(
                    lambda: self.exchange.get_funding_history(
                        symbol=symbol,
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
                            int(item["fundingRateTimestamp"]) / 1000,
                            tz=timezone.utc,
                        ),
                        "funding_rate": float(item["fundingRate"]),
                    })
                
                if STORE_LOCAL:

                    df = pd.DataFrame(records)
                    # Convert pandas DataFrame -> Arrow Table
                    table = pa.Table.from_pandas( df,preserve_index=False,)

                    # Create writer using the first batch schema
                    if parquet_writer is None:
                        parquet_writer = pq.ParquetWriter(
                            local_path,
                            table.schema,
                            compression="snappy",
                        )

                    # Append current batch
                    parquet_writer.write_table(table)

                else:
                    self.repository.insert_many(records)

                total += len(records)

                # Find the oldest candle in this batch
                oldest_timestamp = min(
                    int(item["fundingRateTimestamp"])
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
        finally:

            # Make sure the Parquet file is properly closed
            if parquet_writer is not None:
                parquet_writer.close()

        return total
