import sys
from pathlib import Path

import pandas as pd


# Make sure `app` imports work if needed later
ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

RAW_DIR = ROOT_DIR / "data" / "raw"


FILES = {
    "Klines": "klines_1m.parquet",
    "Open Interest": "open_interest.parquet",
    "Funding Rates": "funding_rates.parquet",
}


def inspect_parquet(name: str, filename: str):
    path = RAW_DIR / filename

    print()
    print("=" * 80)
    print(f"{name}")
    print("=" * 80)

    if not path.exists():
        print(f"❌ File not found: {path}")
        return

    print(f"File: {path}")
    print(f"Size: {path.stat().st_size / (1024 ** 2):.2f} MB")

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    df = pd.read_parquet(path)

    print()
    print(f"Rows:    {len(df):,}")
    print(f"Columns: {len(df.columns)}")

    # --------------------------------------------------------
    # Columns
    # --------------------------------------------------------

    print()
    print("Columns:")
    for column in df.columns:
        print(f"  - {column}: {df[column].dtype}")

    # --------------------------------------------------------
    # First / last rows
    # --------------------------------------------------------

    print()
    print("First 5 rows:")
    print(df.head(5).to_string(index=False))

    print()
    print("Last 5 rows:")
    print(df.tail(5).to_string(index=False))

    # --------------------------------------------------------
    # Timestamp information
    # --------------------------------------------------------

    if "timestamp" in df.columns:

        print()
        print("Timestamp information:")

        timestamp = pd.to_datetime(
            df["timestamp"],
            utc=True,
        )

        print(f"  Earliest: {timestamp.min()}")
        print(f"  Latest:   {timestamp.max()}")

        print()
        print("Timestamp dtype:")
        print(f"  {df['timestamp'].dtype}")

        # Check sorting
        is_sorted = timestamp.is_monotonic_increasing

        print()
        print(f"Sorted ascending: {'✅ Yes' if is_sorted else '❌ No'}")

    # --------------------------------------------------------
    # Missing values
    # --------------------------------------------------------

    print()
    print("Missing values:")

    null_counts = df.isnull().sum()

    if null_counts.sum() == 0:
        print("  ✅ No missing values")
    else:
        for column, count in null_counts.items():
            if count > 0:
                percentage = count / len(df) * 100
                print(
                    f"  {column}: "
                    f"{count:,} ({percentage:.4f}%)"
                )

    # --------------------------------------------------------
    # Duplicate rows
    # --------------------------------------------------------

    print()
    duplicate_count = df.duplicated().sum()

    if duplicate_count == 0:
        print("Duplicate rows: ✅ None")
    else:
        print(
            f"Duplicate rows: ❌ {duplicate_count:,}"
        )

    # --------------------------------------------------------
    # Kline-specific checks
    # --------------------------------------------------------

    if name == "Klines":

        print()
        print("Kline-specific information:")

        if "symbol" in df.columns:
            print(
                f"Symbols: "
                f"{df['symbol'].dropna().unique().tolist()}"
            )

        if "interval" in df.columns:
            print(
                f"Intervals: "
                f"{df['interval'].dropna().unique().tolist()}"
            )

        if "close" in df.columns:
            print()
            print("Close price:")
            print(f"  Min: {df['close'].min()}")
            print(f"  Max: {df['close'].max()}")

    # --------------------------------------------------------
    # Memory usage
    # --------------------------------------------------------

    memory_mb = df.memory_usage(
        deep=True
    ).sum() / (1024 ** 2)

    print()
    print(f"Memory usage when loaded: {memory_mb:.2f} MB")


def main():

    print()
    print("=" * 80)
    print("PARQUET DATA CHECK")
    print("=" * 80)

    print(f"Raw data directory: {RAW_DIR}")

    for name, filename in FILES.items():
        inspect_parquet(name, filename)

    print()
    print("=" * 80)
    print("CHECK COMPLETED")
    print("=" * 80)


if __name__ == "__main__":
    main()

# python -m scripts.check_raw_parquet