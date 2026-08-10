from typing import Any

from app.storage.supabase_client import supabase
from app.helper.serialize_records import serialize_record,serialize_records


class LiquidationRepository:

    TABLE_NAME = "liquidations"

    def insert(self, data: dict[str, Any]):
        payload = serialize_record(data)
        response = (
            supabase
            .table(self.TABLE_NAME)
            .upsert(
                payload,
                on_conflict="symbol, timestamp, side"
            )
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
                on_conflict="symbol, timestamp, side"
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