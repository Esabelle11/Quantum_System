from typing import Any

from app.storage.supabase_client import supabase
from app.helper.serialize_records import serialize_records


class OIRepository:

    TABLE_NAME = "open_interest"

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
                on_conflict="symbol,timestamp",
            )
            .execute()
        )

        return response.data

    def get_latest(
        self,
        symbol: str = "BTCUSDT",
        limit: int = 100,
    ):
        response = (
            supabase
            .table(self.TABLE_NAME)
            .select("*")
            .eq("symbol", symbol)
            .order("timestamp", desc=True)
            .limit(limit)
            .execute()
        )

        return response.data