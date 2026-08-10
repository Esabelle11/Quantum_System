from typing import Any

from app.storage.supabase_client import supabase
from app.helper.serialize_records import serialize_records

class KlineRepository:

    TABLE_NAME = "klines"

    def insert(self, data: dict[str, Any]):
        response = (
            supabase
            .table(self.TABLE_NAME)
            .insert(data)
            .execute()
        )

        return response.data

    def insert_many(self, data: list[dict[str, Any]]):
        if not data:
            return []
        
        payload = serialize_records(data)

        response = (
            supabase
            .table(self.TABLE_NAME)
            .upsert(
                payload,
                on_conflict="symbol,interval,timestamp",
            )
            .execute()
        )

        return response.data

    def get_latest(
        self,
        symbol: str = "BTCUSDT",
        interval: str = "1",
        limit: int = 100,
    ):
        response = (
            supabase
            .table(self.TABLE_NAME)
            .select("*")
            .eq("symbol", symbol)
            .eq("interval", interval)
            .order("timestamp", desc=True)
            .limit(limit)
            .execute()
        )

        return response.data



# repository = KlineRepository()

# repository.insert({
#     "symbol": "BTCUSDT",
#     "interval": "1",
#     "timestamp": 1750000000000,
#     "open": 100000,
#     "high": 100100,
#     "low": 99900,
#     "close": 100050,
#     "volume": 123.45,
# })