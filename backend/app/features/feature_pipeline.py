# backend/app/features/feature_pipeline.py
# python -m app.features.feature_pipeline
from pathlib import Path

import numpy as np
import pandas as pd

from app.features.price_features import (
    calculate_price_features,

)

from app.features.oi_features import (
    calculate_oi_features,
)

from app.features.funding_features import (
    calculate_funding_features,
)

from app.features.config import (
    PRICE_FEATURE_CONFIG,OI_FEATURE_CONFIG,FUNDING_FEATURE_CONFIG
)



# ============================================================
# Configuration
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[2]
print("ROOT_DIR: ",ROOT_DIR)
RAW_DIR = ROOT_DIR / "data" / "raw"
FEATURE_DIR = ROOT_DIR / "data" / "features"

KLINES_FILE = RAW_DIR / "klines_1m.parquet"
OI_FILE = RAW_DIR / "open_interest.parquet"
FUNDING_FILE = RAW_DIR / "funding_rates.parquet"


FEATURE_DIR.mkdir(
    parents=True,
    exist_ok=True,
)




# ============================================================
# Utilities
# ============================================================

def prepare_timestamp(df: pd.DataFrame,) -> pd.DataFrame:

    df = df.copy()

    df["timestamp"] = pd.to_datetime(df["timestamp"],utc=True,)

    df = (
        df
        .sort_values("timestamp")
        .drop_duplicates(
            subset=["timestamp"],
            keep="last",
        )
        .reset_index(drop=True)
    )

    return df


# ============================================================
# Load raw data
# ============================================================

def load_raw_data():

    print("Loading raw Parquet files...")

    klines = pd.read_parquet(KLINES_FILE)
    oi = pd.read_parquet(OI_FILE)
    funding = pd.read_parquet(FUNDING_FILE)

    klines = prepare_timestamp(klines)
    oi = prepare_timestamp(oi)
    funding = prepare_timestamp(funding)

    print()
    print("Raw data:")

    print(
        f"Klines : {len(klines):,} rows | "
        f"{klines['timestamp'].min()} "
        f"-> {klines['timestamp'].max()}"
    )

    print(
        f"OI     : {len(oi):,} rows | "
        f"{oi['timestamp'].min()} "
        f"-> {oi['timestamp'].max()}"
    )

    print(
        f"Funding: {len(funding):,} rows | "
        f"{funding['timestamp'].min()} "
        f"-> {funding['timestamp'].max()}"
    )

    return klines, oi, funding

    
# ============================================================
# Find common overlapping period
# ============================================================

def find_common_period(
    klines: pd.DataFrame,
    oi: pd.DataFrame,
    funding: pd.DataFrame,
):

    starts = [
        klines["timestamp"].min(),
        oi["timestamp"].min(),
        funding["timestamp"].min(),
    ]

    ends = [
        klines["timestamp"].max(),
        oi["timestamp"].max(),
        funding["timestamp"].max(),
    ]

    common_start = max(starts)
    common_end = min(ends)

    if common_start >= common_end:
        raise ValueError(
            "No common overlapping timestamp range "
            "exists between the datasets."
        )

    print()
    print("Common period:")
    print(f"START: {common_start}")
    print(f"END  : {common_end}")

    return common_start, common_end


# ============================================================
# Cut all raw data to common period
# ============================================================

def cut_to_common_period(
    df: pd.DataFrame,
    start: pd.Timestamp,
    end: pd.Timestamp,
) -> pd.DataFrame:

    return (
        df[
            (df["timestamp"] >= start)
            & (df["timestamp"] <= end)
        ]
        .copy()
        .reset_index(drop=True)
    )


# ============================================================
# Resample Klines
# ============================================================
TIMEFRAME_OFFSETS = {
    "5min": pd.Timedelta(minutes=5),
    "15min": pd.Timedelta(minutes=15),
    "1h": pd.Timedelta(hours=1),
    "4h": pd.Timedelta(hours=4),
}

def resample_klines(
    klines: pd.DataFrame,
    timeframe: str,
) -> pd.DataFrame:

    df = klines.copy()

    df = df.set_index("timestamp")

    result = (
        df.resample(timeframe)
        .agg(
            {
                "open": "first",
                "high": "max",
                "low": "min",
                "close": "last",
                "volume": "sum",
                "turnover": "sum",
            }
        )
        .dropna(
            subset=[
                "open",
                "high",
                "low",
                "close",
            ]
        )
        .reset_index()
    )

    # --------------------------------------------------------
    # Label candle by its completion time
    # --------------------------------------------------------

    result["timestamp"] = (
        result["timestamp"]
        + TIMEFRAME_OFFSETS[timeframe]
    )

    return result

# ============================================================
# Resample OI
# ============================================================

def resample_oi(
    oi: pd.DataFrame,
    timeframe: str,
) -> pd.DataFrame:

    df = oi.copy()

    df = df.set_index("timestamp")

    result = (
        df["open_interest"]
        .resample(timeframe)
        .last()
        .ffill()
        .rename("open_interest")
        .reset_index()
    )

    # --------------------------------------------------------
    # Label the OI value by the end of its timeframe window.
    #
    # Example:
    # 13:00 -> 13:15
    # becomes timestamp = 13:15
    #
    # This ensures that the value is only used after the
    # corresponding timeframe period has completed.
    # --------------------------------------------------------


    if timeframe not in TIMEFRAME_OFFSETS:
        raise ValueError(
            f"Unsupported timeframe: {timeframe}. "
            f"Supported: {list(TIMEFRAME_OFFSETS.keys())}"
        )

    result["timestamp"] = (
        result["timestamp"]
        + TIMEFRAME_OFFSETS[timeframe]
    )

    return result


# ============================================================
# Align funding
# ============================================================

def align_funding(
    base: pd.DataFrame,
    funding: pd.DataFrame,
) -> pd.DataFrame:

    left = (
        base
        .sort_values("timestamp")
        .copy()
    )

    right = (
        funding[
            [
                "timestamp",
                "funding_rate",
            ]
        ]
        .sort_values("timestamp")
        .copy()
    )

    # Only use funding observations that have
    # already occurred.
    result = pd.merge_asof(
        left,
        right,
        on="timestamp",
        direction="backward",
    )

    return result


# ============================================================
# Build price features
# ============================================================

def build_price_features(
    df: pd.DataFrame,
    timeframe: str,
) -> pd.DataFrame:

    feature_config = PRICE_FEATURE_CONFIG[timeframe]

    df = calculate_price_features(
        df,
        feature_config,
    )

    return df


# ============================================================
# Build timeframe
# ============================================================

def build_timeframe(
    klines: pd.DataFrame,
    oi: pd.DataFrame,
    funding: pd.DataFrame,
    timeframe: str,
) -> pd.DataFrame:

    print()
    print("=" * 60)
    print(f"Building {timeframe} features")
    print("=" * 60)

    # --------------------------------------------------------
    # Price
    # --------------------------------------------------------
    price = resample_klines(klines,timeframe,)
    print(f"Price rows: {len(price):,}")

    # --------------------------------------------------------
    # OI
    # --------------------------------------------------------
    oi_tf = resample_oi(oi,timeframe,)

    # --------------------------------------------------------
    # Price features
    # --------------------------------------------------------
    price = build_price_features(price,timeframe)

    # --------------------------------------------------------
    # Merge OI
    # --------------------------------------------------------
    price = price.merge(
        oi_tf,
        on="timestamp",
        how="left",
    )

    # Forward-fill OI only
    # after the OI observation exists.
    price["open_interest"] = (price["open_interest"].ffill())

    # --------------------------------------------------------
    # OI features
    # --------------------------------------------------------
    price = calculate_oi_features(price, OI_FEATURE_CONFIG[timeframe])

    # --------------------------------------------------------
    # Funding
    # --------------------------------------------------------

    price = align_funding(price,funding,)

    # --------------------------------------------------------
    # Funding features
    # --------------------------------------------------------
    price = calculate_funding_features(price,FUNDING_FEATURE_CONFIG[timeframe])

    return price


# ============================================================
# Main
# ============================================================

def main():

    print("=" * 70)
    print("BTCUSDT FEATURE ENGINEERING PIPELINE")
    print("=" * 70)

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------
    klines, oi, funding = load_raw_data()

    # --------------------------------------------------------
    # Common period
    # --------------------------------------------------------
    common_start, common_end = (find_common_period(klines, oi,funding,))

    # --------------------------------------------------------
    # Cut raw data
    # --------------------------------------------------------
    klines = cut_to_common_period(klines,common_start,common_end,)
    oi = cut_to_common_period(oi,common_start,common_end,)
    funding = cut_to_common_period(funding,common_start,common_end,)

    print()
    print("After common-period cut:")

    print(f"Klines : {len(klines):,}")
    print(f"OI     : {len(oi):,}")
    print(f"Funding: {len(funding):,}")

    # --------------------------------------------------------
    # Build individual timeframes
    # --------------------------------------------------------

    feature_5m = build_timeframe(
        klines,
        oi,
        funding,
        "5min",
    )

    feature_15m = build_timeframe(
        klines,
        oi,
        funding,
        "15min",
    )

    feature_1h = build_timeframe(
        klines,
        oi,
        funding,
        "1h",
    )

    feature_4h = build_timeframe(
        klines,
        oi,
        funding,
        "4h",
    )

    # --------------------------------------------------------
    # Save individual feature datasets
    # --------------------------------------------------------

    feature_5m.to_parquet(
        FEATURE_DIR / "feature_5m.parquet",
        index=False,
    )

    feature_15m.to_parquet(
        FEATURE_DIR / "feature_15m.parquet",
        index=False,
    )

    feature_1h.to_parquet(
        FEATURE_DIR / "feature_1h.parquet",
        index=False,
    )

    feature_4h.to_parquet(
        FEATURE_DIR / "feature_4h.parquet",
        index=False,
    )

    print()
    print("Individual feature files saved.")

    # --------------------------------------------------------
    # Build full multi-timeframe dataset
    # --------------------------------------------------------

    feature_full = build_full_features(
        feature_5m,
        feature_15m,
        feature_1h,
        feature_4h,
    )

    feature_full.to_parquet(
        FEATURE_DIR / "feature_full.parquet",
        index=False,
    )

    print()
    print(
        f"Full feature rows: "
        f"{len(feature_full):,}"
    )

    print(
        f"Full feature columns: "
        f"{len(feature_full.columns):,}"
    )

    print()
    print("=" * 70)
    print("FEATURE ENGINEERING COMPLETE")
    print("=" * 70)


# ============================================================
# Full multi-timeframe dataset
# ============================================================

# def build_full_features(
#     feature_5m: pd.DataFrame,
#     feature_15m: pd.DataFrame,
#     feature_1h: pd.DataFrame,
#     feature_4h: pd.DataFrame,
# ) -> pd.DataFrame:

#     # The 5m timeframe becomes the base timeline.
#     base = feature_5m.copy()

#     base = base.sort_values("timestamp")

#     # Remove timestamp-independent raw columns from
#     # higher timeframe datasets that would otherwise
#     # collide or become confusing.
#     def prepare_higher_tf(
#         df: pd.DataFrame,
#         prefix: str,
#     ) -> pd.DataFrame:

#         df = df.copy()

#         df = df.add_prefix(f"{prefix}_")

#         df = df.rename(
#             columns={
#                 f"{prefix}_timestamp":
#                     "timestamp"
#             }
#         )

#         return df

#     tf15 = prepare_higher_tf(feature_15m, "15m",)
#     tf1h = prepare_higher_tf(feature_1h, "1h",)
#     tf4h = prepare_higher_tf(feature_4h,"4h",)

#     # --------------------------------------------------------
#     # Merge using backward as-of alignment.
#     #
#     # IMPORTANT:
#     # At a 5m timestamp we only use the most recent
#     # COMPLETED higher timeframe candle.
#     # --------------------------------------------------------

#     base = pd.merge_asof(
#         base.sort_values("timestamp"),
#         tf15.sort_values("timestamp"),
#         on="timestamp",
#         direction="backward",
#     )

#     base = pd.merge_asof(
#         base.sort_values("timestamp"),
#         tf1h.sort_values("timestamp"),
#         on="timestamp",
#         direction="backward",
#     )

#     base = pd.merge_asof(
#         base.sort_values("timestamp"),
#         tf4h.sort_values("timestamp"),
#         on="timestamp",
#         direction="backward",
#     )

#     return base.reset_index(drop=True)

def build_full_features(
    feature_5m: pd.DataFrame,
    feature_15m: pd.DataFrame,
    feature_1h: pd.DataFrame,
    feature_4h: pd.DataFrame,
) -> pd.DataFrame:

    # ========================================================
    # 5m becomes the base prediction timeline
    # ========================================================

    base = feature_5m.copy()

    base = base.sort_values("timestamp").reset_index(drop=True)

    # Keep the base timestamp explicitly.
    base = base.rename(
        columns={
            "timestamp": "timestamp"
        }
    )

    # ========================================================
    # Prepare higher timeframe datasets
    # ========================================================

    def prepare_higher_tf(
        df: pd.DataFrame,
        prefix: str,
    ) -> pd.DataFrame:

        df = df.copy()

        # Keep the original timeframe timestamp.
        df[f"{prefix}_timestamp"] = df["timestamp"]

        # Temporary timestamp used for merge_asof.
        df = df.rename(
            columns={
                "timestamp": "_merge_timestamp"
            }
        )

        # Prefix all feature columns.
        feature_columns = [
            column
            for column in df.columns
            if column not in [
                "_merge_timestamp",
                f"{prefix}_timestamp",
            ]
        ]

        df = df.rename(
            columns={
                column: f"{prefix}_{column}"
                for column in feature_columns
            }
        )

        return df

    tf15 = prepare_higher_tf(
        feature_15m,
        "15m",
    )

    tf1h = prepare_higher_tf(
        feature_1h,
        "1h",
    )

    tf4h = prepare_higher_tf(
        feature_4h,
        "4h",
    )

    # ========================================================
    # Merge 15m
    # ========================================================

    base = pd.merge_asof(
        base.sort_values("timestamp"),
        tf15.sort_values("_merge_timestamp"),
        left_on="timestamp",
        right_on="_merge_timestamp",
        direction="backward",
        allow_exact_matches=False,
    )

    base = base.drop(
        columns=["_merge_timestamp"]
    )

    # ========================================================
    # Merge 1h
    # ========================================================

    base = pd.merge_asof(
        base.sort_values("timestamp"),
        tf1h.sort_values("_merge_timestamp"),
        left_on="timestamp",
        right_on="_merge_timestamp",
        direction="backward",
        allow_exact_matches=False,
    )

    base = base.drop(
        columns=["_merge_timestamp"]
    )

    # ========================================================
    # Merge 4h
    # ========================================================

    base = pd.merge_asof(
        base.sort_values("timestamp"),
        tf4h.sort_values("_merge_timestamp"),
        left_on="timestamp",
        right_on="_merge_timestamp",
        direction="backward",
        allow_exact_matches=False,
    )

    base = base.drop(
        columns=["_merge_timestamp"]
    )

    # ========================================================
    # Final cleanup
    # ========================================================

    return base.reset_index(drop=True)



if __name__ == "__main__":
    main()