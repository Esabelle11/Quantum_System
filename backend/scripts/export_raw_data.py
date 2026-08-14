
import sys
from pathlib import Path

import pandas as pd

# Make sure `app` can be imported when running:
#
# python -m scripts.export_raw_data

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from app.storage.supabase_client import supabase


# ============================================================
# Configuration
# ============================================================

OUTPUT_DIR = ROOT_DIR / "data" / "raw"


TABLES = {

    # --------------------------------------------------------
    # Klines
    # --------------------------------------------------------

    "klines": {
        "download": True,
        "output": "klines_1m.parquet",
        "order_column": "timestamp",

        # 1 minute candles
        # 0.5 day = 12 hours
        "window_days": 0.5,

        # Maximum rows fetched per request
        "page_size": 1_000,

        "remove_duplicates": True,
    },

    # --------------------------------------------------------
    # Open Interest
    # --------------------------------------------------------

    "open_interest": {
        "download": True,
        "output": "open_interest.parquet",
        "order_column": "timestamp",

        # 5 minute data
        "window_days": 1,

        "page_size": 1_000,

        "remove_duplicates": True,
    },

    # --------------------------------------------------------
    # Funding Rates
    # --------------------------------------------------------

    "funding_rates": {
        "download": True,
        "output": "funding_rates.parquet",
        "order_column": "timestamp",

        # 8 hour data
        "window_days": 7,

        "page_size": 1_000,

        "remove_duplicates": True,
    },

    # --------------------------------------------------------
    # Liquidations
    # --------------------------------------------------------

    "liquidations": {
        "download": False,
        "output": "liquidations.parquet",
        "order_column": "timestamp",

        "window_days": 1,

        "page_size": 1_000,

        "remove_duplicates": True,
    },

    # --------------------------------------------------------
    # Trades
    # --------------------------------------------------------

    "trades": {
        "download": False,
        "output": "trades.parquet",
        "order_column": "timestamp",

        # Trades are extremely high frequency.
        #
        # 0.1 day = 2.4 hours
        #
        # If queries time out, reduce this.
        "window_days": 0.1,

        "page_size": 1_000,

        "remove_duplicates": False,
    },

    # --------------------------------------------------------
    # Orderbook Snapshots
    # --------------------------------------------------------

    "orderbook_snapshots": {
        "download": False,
        "output": "orderbook_snapshots.parquet",
        "order_column": "timestamp",

        # Orderbook snapshots contain JSONB and can be large.
        #
        # 0.01 day = 14.4 minutes
        #
        # If this still times out:
        #
        # 0.005 = ~7.2 minutes
        # 0.001 = ~1.44 minutes
        "window_days": 0.01,

        # Smaller page because JSONB rows can be large.
        "page_size": 100,

        "remove_duplicates": True,
    },
}


# ============================================================
# Helpers
# ============================================================

def prepare_timestamp(
    df: pd.DataFrame,
    column: str,
) -> pd.DataFrame:

    df = df.copy()

    df[column] = pd.to_datetime(
        df[column],
        format="mixed",
        utc=True,
    )

    return df


# ============================================================
# Get table time range
# ============================================================

def get_table_time_range(
    table_name: str,
    order_column: str = "timestamp",
):
    """
    Get the earliest and latest timestamp from a table.

    This uses two very small indexed queries.
    """

    print()
    print("Finding table time range...")

    # --------------------------------------------------------
    # Earliest timestamp
    # --------------------------------------------------------

    oldest_response = (
        supabase
        .table(table_name)
        .select(order_column)
        .order(
            order_column,
            desc=False,
        )
        .limit(1)
        .execute()
    )

    # --------------------------------------------------------
    # Latest timestamp
    # --------------------------------------------------------

    newest_response = (
        supabase
        .table(table_name)
        .select(order_column)
        .order(
            order_column,
            desc=True,
        )
        .limit(1)
        .execute()
    )

    if not oldest_response.data:
        return None, None

    if not newest_response.data:
        return None, None

    # --------------------------------------------------------
    # Convert timestamps
    # --------------------------------------------------------

    oldest = pd.to_datetime(
        oldest_response.data[0][order_column],
        format="mixed",
        utc=True,
    )

    newest = pd.to_datetime(
        newest_response.data[0][order_column],
        format="mixed",
        utc=True,
    )

    print(f"Earliest: {oldest}")
    print(f"Latest:   {newest}")

    return oldest, newest


# ============================================================
# Fetch one time window
# ============================================================

def fetch_window(
    table_name: str,
    start_time: pd.Timestamp,
    end_time: pd.Timestamp,
    order_column: str = "timestamp",
    page_size: int = 1_000,
):
    """
    Fetch one bounded time window.

    The query is bounded by:

        timestamp >= start_time
        timestamp < end_time

    We ALSO paginate inside the window using the timestamp
    cursor.

    This means a window can contain more than `page_size`
    rows without losing data.

    Example:

        Window = 14 minutes
        Page size = 1,000

    If the window contains 7,235 rows, this function will
    internally fetch:

        Page 1 -> 1,000
        Page 2 -> 1,000
        Page 3 -> 1,000
        ...
        Page 8 -> 235

    and combine them into one DataFrame.
    """

    print(
        f"Querying: "
        f"{start_time} → {end_time}"
    )

    chunks = []

    cursor_timestamp = None

    page_number = 0

    while True:

        page_number += 1

        # ----------------------------------------------------
        # Build bounded query
        # ----------------------------------------------------

        query = (
            supabase
            .table(table_name)
            .select("*")
            .gte(
                order_column,
                start_time.isoformat(),
            )
            .lt(
                order_column,
                end_time.isoformat(),
            )
        )

        # ----------------------------------------------------
        # Continue from previous page
        # ----------------------------------------------------

        if cursor_timestamp is not None:

            query = query.gt(
                order_column,
                cursor_timestamp,
            )

        # ----------------------------------------------------
        # Execute query
        # ----------------------------------------------------

        response = (
            query
            .order(
                order_column,
                desc=False,
            )
            .limit(page_size)
            .execute()
        )

        rows = response.data

        if not rows:
            break

        # ----------------------------------------------------
        # Convert to DataFrame
        # ----------------------------------------------------

        chunk = pd.DataFrame(rows)

        if chunk.empty:
            break

        # ----------------------------------------------------
        # Timestamp conversion
        #
        # format="mixed" handles timestamps such as:
        #
        # 2026-08-10T05:53:02+00:00
        #
        # and:
        #
        # 2026-08-10T03:26:24.364000+00:00
        # ----------------------------------------------------

        chunk[order_column] = pd.to_datetime(
            chunk[order_column],
            format="mixed",
            utc=True,
        )

        chunk = (
            chunk
            .sort_values(order_column)
            .reset_index(drop=True)
        )

        chunks.append(chunk)

        # ----------------------------------------------------
        # Update cursor
        # ----------------------------------------------------

        last_timestamp = (
            chunk[order_column].max()
        )

        cursor_timestamp = (
            last_timestamp.isoformat()
        )

        # ----------------------------------------------------
        # Logging
        # ----------------------------------------------------

        print(
            f"  Page {page_number:,}: "
            f"{len(chunk):,} rows"
        )

        # ----------------------------------------------------
        # Final page
        # ----------------------------------------------------

        if len(chunk) < page_size:
            break

    # ========================================================
    # No data
    # ========================================================

    if not chunks:
        return None

    # ========================================================
    # Combine pages
    # ========================================================

    return pd.concat(
        chunks,
        ignore_index=True,
    )


# ============================================================
# Remove duplicates
# ============================================================

def remove_duplicates(
    df: pd.DataFrame,
    table_name: str,
) -> pd.DataFrame:

    df = df.copy()

    before = len(df)

    # --------------------------------------------------------
    # Klines
    # --------------------------------------------------------

    if table_name == "klines":

        duplicate_columns = [
            "symbol",
            "interval",
            "timestamp",
        ]

    # --------------------------------------------------------
    # Liquidations
    # --------------------------------------------------------

    elif table_name == "liquidations":

        duplicate_columns = [
            "symbol",
            "timestamp",
            "side",
        ]

    # --------------------------------------------------------
    # Trades
    # --------------------------------------------------------

    elif table_name == "trades":

        duplicate_columns = [
            "symbol",
            "timestamp",
            "side",
            "price",
        ]

    # --------------------------------------------------------
    # Orderbook snapshots
    # --------------------------------------------------------

    elif table_name == "orderbook_snapshots":

        duplicate_columns = [
            "symbol",
            "timestamp",
        ]

    # --------------------------------------------------------
    # Open interest / funding rates / other
    # --------------------------------------------------------

    else:

        duplicate_columns = [
            "timestamp",
        ]

    # --------------------------------------------------------
    # Only use columns that exist
    # --------------------------------------------------------

    existing_columns = [
        column
        for column in duplicate_columns
        if column in df.columns
    ]

    if existing_columns:

        df = df.drop_duplicates(
            subset=existing_columns,
            keep="last",
        )

    removed = before - len(df)

    if removed > 0:

        print(
            f"Duplicates removed: "
            f"{removed:,}"
        )

    return df


# ============================================================
# Export table
# ============================================================

def export_table(
    table_name: str,
    output_filename: str,
    order_column: str,
    window_days: float,
    page_size: int,
    remove_dupes: bool,
):

    output_path = OUTPUT_DIR / output_filename

    print()
    print("=" * 70)
    print(f"Exporting: {table_name}")
    print(f"Output:    {output_path}")
    print(f"Window:    {window_days} days")
    print(f"Page size: {page_size:,}")
    print(f"Dedup:     {remove_dupes}")
    print("=" * 70)

    # --------------------------------------------------------
    # Find overall time range
    # --------------------------------------------------------

    oldest, newest = get_table_time_range(
        table_name,
        order_column,
    )

    if oldest is None:

        print(
            f"No data found in {table_name}."
        )

        return

    # --------------------------------------------------------
    # Iterate through windows
    # --------------------------------------------------------

    window_start = oldest

    all_chunks = []

    total_rows = 0
    window_number = 0

    window_delta = pd.Timedelta(
        days=window_days
    )

    while window_start < newest:

        window_number += 1

        window_end = min(
            window_start + window_delta,
            newest + pd.Timedelta(
                microseconds=1
            ),
        )

        print()
        print(
            f"Window {window_number:,}: "
            f"{window_start} → {window_end}"
        )

        # ----------------------------------------------------
        # Fetch window
        # ----------------------------------------------------

        chunk = fetch_window(
            table_name=table_name,
            start_time=window_start,
            end_time=window_end,
            order_column=order_column,
            page_size=page_size,
        )

        # ----------------------------------------------------
        # Process returned data
        # ----------------------------------------------------

        if chunk is not None:

            rows_count = len(chunk)

            total_rows += rows_count

            all_chunks.append(chunk)

            print(
                f"Received: {rows_count:,} rows "
                f"| Total: {total_rows:,}"
            )

        else:

            print(
                "No rows in this window."
            )

        # ----------------------------------------------------
        # Move to next window
        # ----------------------------------------------------

        window_start = window_end

    # ========================================================
    # No data
    # ========================================================

    if not all_chunks:

        print()
        print(
            f"No data found in {table_name}."
        )

        return

    # ========================================================
    # Combine
    # ========================================================

    print()
    print("Combining time windows...")

    df = pd.concat(
        all_chunks,
        ignore_index=True,
    )

    # ========================================================
    # Timestamp handling
    # ========================================================

    if order_column in df.columns:

        df[order_column] = pd.to_datetime(
            df[order_column],
            format="mixed",
            utc=True,
        )

        df = (
            df
            .sort_values(order_column)
            .reset_index(drop=True)
        )

    # ========================================================
    # Remove duplicates
    # ========================================================

    if remove_dupes:

        print()
        print("Removing duplicates...")

        df = remove_duplicates(
            df,
            table_name,
        )

    else:

        print()
        print(
            "Duplicate removal disabled."
        )

    # ========================================================
    # Save Parquet
    # ========================================================

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    df.to_parquet(
        output_path,
        index=False,
        engine="pyarrow",
        compression="snappy",
    )

    # ========================================================
    # Verification
    # ========================================================

    print()
    print("-" * 70)
    print(f"Finished: {table_name}")
    print("-" * 70)

    print(
        f"Rows:     {len(df):,}"
    )

    print(
        f"Columns:  {len(df.columns)}"
    )

    if order_column in df.columns:

        print(
            f"Earliest: "
            f"{df[order_column].min()}"
        )

        print(
            f"Latest:   "
            f"{df[order_column].max()}"
        )

    print(
        f"File: {output_path}"
    )

    print("-" * 70)


# ============================================================
# Main
# ============================================================

def main():

    print()
    print("=" * 70)
    print("RAW MARKET DATA EXPORT")
    print("=" * 70)

    print(
        f"Output directory: "
        f"{OUTPUT_DIR}"
    )

    # --------------------------------------------------------
    # Export enabled tables
    # --------------------------------------------------------

    for table_name, config in TABLES.items():

        if not config["download"]:

            print(
                f"Skipping {table_name} "
                f"(download=False)"
            )

            continue

        export_table(
            table_name=table_name,
            output_filename=config["output"],
            order_column=config["order_column"],
            window_days=config["window_days"],
            page_size=config["page_size"],
            remove_dupes=config["remove_duplicates"],
        )

    print()
    print("=" * 70)
    print("ALL EXPORTS COMPLETED")
    print("=" * 70)


# ============================================================
# Entry point
# ============================================================

if __name__ == "__main__":
    main()

