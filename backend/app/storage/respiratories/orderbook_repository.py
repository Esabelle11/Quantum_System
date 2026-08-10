from typing import Any

from app.storage.supabase_client import supabase
from app.helper.serialize_records import serialize_record,serialize_records


class OrderbookRepository:
    """
    Repository for storing processed Bybit order book data.
    """

    TABLE_NAME = "orderbook_snapshots"

    def insert(
        self,
        record: dict[str, Any],
    ) -> Any:
        """
        Insert a single order book snapshot.
        """

        payload = serialize_record(record)

        response = (
            supabase
            .table(self.TABLE_NAME)
            .upsert(
                payload,
                on_conflict="symbol,timestamp"
            )
            .execute()
        )

        return response.data

    def insert_many(
        self,
        records: list[dict[str, Any]],
    ) -> Any:
        """
        Insert multiple order book snapshots.
        """

        if not records:
            return []

        payload = serialize_records(records)

        response = (
            supabase
            .table(self.TABLE_NAME)
            .insert(payload)
            .execute()
        )

        return response.data

    def get_recent(
        self,
        symbol: str = "BTCUSDT",
        limit: int = 100,
    ) -> Any:
        """
        Get recent order book snapshots.
        """

        response = (
            supabase
            .table(self.TABLE_NAME)
            .select("*")
            .eq("symbol", symbol)
            .order(
                "timestamp",
                desc=True,
            )
            .limit(limit)
            .execute()
        )

        return response.data

    def get_between(
        self,
        symbol: str,
        start_timestamp: int,
        end_timestamp: int,
    ) -> Any:
        """
        Get order book snapshots within
        a timestamp range.
        """

        response = (
            supabase
            .table(self.TABLE_NAME)
            .select("*")
            .eq("symbol", symbol)
            .gte(
                "timestamp",
                start_timestamp,
            )
            .lte(
                "timestamp",
                end_timestamp,
            )
            .order(
                "timestamp",
                desc=False,
            )
            .execute()
        )

        return response.data