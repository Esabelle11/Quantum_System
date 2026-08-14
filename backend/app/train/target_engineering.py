# python -m app.train.target_engineering
import sys
from pathlib import Path

import numpy as np
import pandas as pd


# ============================================================
# Project Path
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT_DIR))


# ============================================================
# Configuration
# ============================================================

FEATURE_DIR = ROOT_DIR / "data" / "features"
TARGET_DIR = ROOT_DIR / "data" / "targets"

TARGET_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# Timeframe Configuration
# ============================================================
TARGET_HORIZONS = {
    "5m": {
        "5m": 1,
        "10m": 2,
        "15m": 3,
        "30m": 6,
        "1h": 12,
        "4h": 48,
    },
    "15m": {
        "15m": 1,
        "30m": 2,
        "1h": 4,
        "4h": 16,
    },
    "1h": {
        "1h": 1,
        "2h": 2,
        "4h": 4,
        "5h": 5,
        "6h": 6,
    },
    "4h": {
        "4h": 1,
        # "8h":2
    },
}


# ============================================================
# Helper Functions
# ============================================================

def validate_dataframe(
    df: pd.DataFrame,
    file_path: Path,
) -> None:
    """Validate that the input dataframe contains required columns."""

    required_columns = {
        "timestamp",
        "close",
        "high",
        "low",
    }

    missing = required_columns - set(df.columns)

    if missing:
        raise ValueError(
            f"{file_path.name} is missing required columns: "
            f"{sorted(missing)}"
        )


def prepare_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Prepare dataframe for target engineering."""

    df = df.copy()

    # --------------------------------------------------------
    # Timestamp
    # --------------------------------------------------------

    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        unit="ms",
        utc=True,
        errors="coerce",
    )

    # --------------------------------------------------------
    # Price / volume columns
    # --------------------------------------------------------

    numeric_columns = [
        "open",
        "high",
        "low",
        "close",
        "volume",
        "turnover",
    ]

    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(
                df[column],
                errors="coerce",
            )

    # --------------------------------------------------------
    # Remove invalid rows
    # --------------------------------------------------------

    required_columns = [
        "timestamp",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "turnover",
    ]

    df = df.dropna(
        subset=required_columns
    )

    # --------------------------------------------------------
    # Sort chronologically
    # --------------------------------------------------------

    df = df.sort_values(
        "timestamp"
    ).reset_index(drop=True)

    # --------------------------------------------------------
    # Remove duplicate timestamps
    # --------------------------------------------------------

    df = df.drop_duplicates(
        subset=["timestamp"],
        keep="last",
    ).reset_index(drop=True)

    # --------------------------------------------------------
    # Keep only raw market columns
    # --------------------------------------------------------

    df = df[
        [
            "timestamp",
            "open",
            "high",
            "low",
            "close",
            "volume",
            "turnover",
        ]
    ]

    return df

# ============================================================
# Future Return
# ============================================================

def create_future_return_target(
    df: pd.DataFrame,
    periods: int,
    name: str,
) -> pd.DataFrame:
    """
    Create a future-return target.

    Formula:

        future_return =
            future_close / current_close - 1

    Example:

        current close = 100,000
        future close  = 100,500

        future_return = 0.005
                      = +0.5%
    """

    future_close = df["close"].shift(-periods)

    df[name] = (
        future_close / df["close"]
    ) - 1.0

    return df


# ============================================================
# Future Maximum Return
# ============================================================

def create_future_max_return_target(
    df: pd.DataFrame,
    periods: int,
    name: str,
) -> pd.DataFrame:
    """
    Create maximum future return over the next `periods` rows.

    Example:

        Current close = 100,000

        Next 1 hour:
            High prices:
            100,200
            100,800
            101,300
            100,900

        future_max_return_1h:

            101,300 / 100,000 - 1
            = +1.3%

    This measures the maximum upside available
    during the future horizon.
    """

    future_high = (
        df["high"]
        .shift(-1)
        .rolling(
            window=periods,
            min_periods=periods,
        )
        .max()
        .shift(-(periods - 1))
    )

    df[name] = (
        future_high / df["close"]
    ) - 1.0

    return df


# ============================================================
# Future Minimum Return
# ============================================================

def create_future_min_return_target(
    df: pd.DataFrame,
    periods: int,
    name: str,
) -> pd.DataFrame:
    """
    Create minimum future return over the next `periods` rows.

    Example:

        Current close = 100,000

        Next 1 hour:
            Low prices:
            99,800
            99,500
            99,200
            99,600

        future_min_return_1h:

            99,200 / 100,000 - 1
            = -0.8%

    This measures the maximum downside experienced
    during the future horizon.
    """

    future_low = (
        df["low"]
        .shift(-1)
        .rolling(window=periods,min_periods=periods,)
        .min()
        .shift(-(periods - 1))
    )

    df[name] = (future_low / df["close"]) - 1.0

    return df


# ============================================================
# Process One File
# ============================================================

def process_feature_file(
    timeframe: str,
    horizon_config: dict,
) -> None:

    input_file = FEATURE_DIR / f"feature_{timeframe}.parquet"
    output_file = TARGET_DIR / f"target_{timeframe}.parquet"

    print()
    print("=" * 70)
    print(f"Processing: {input_file.name}")
    print("=" * 70)

    # --------------------------------------------------------
    # Check input
    # --------------------------------------------------------

    if not input_file.exists():
        print(f"[SKIP] File not found: {input_file}")
        return

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    df = pd.read_parquet(input_file)

    print(f"Original rows: {len(df):,}")
    print(f"Original columns: {len(df.columns)}")

    # --------------------------------------------------------
    # Validate
    # --------------------------------------------------------

    validate_dataframe(
        df,
        input_file,
    )

    # --------------------------------------------------------
    # Prepare
    # --------------------------------------------------------

    df = prepare_dataframe(df)

    print(
        f"Date range: "
        f"{df['timestamp'].min()} -> "
        f"{df['timestamp'].max()}"
    )

    # --------------------------------------------------------
    # Create future targets
    # --------------------------------------------------------

    for target_name, periods in horizon_config.items():

        # ----------------------------------------------------
        # Future return
        # ----------------------------------------------------

        return_column = f"future_return_{target_name}"

        df = create_future_return_target(
            df=df,
            periods=periods,
            name=return_column,
        )

        print(
            f"Created {return_column:<30} "
            f"(shift={periods})"
        )

        # ----------------------------------------------------
        # Future maximum return
        # ----------------------------------------------------

        max_column = f"future_max_return_{target_name}"

        df = create_future_max_return_target(
            df=df,
            periods=periods,
            name=max_column,
        )

        print(
            f"Created {max_column:<30} "
            f"(horizon={periods} rows)"
        )

        # ----------------------------------------------------
        # Future minimum return
        # ----------------------------------------------------

        min_column = f"future_min_return_{target_name}"

        df = create_future_min_return_target(
            df=df,
            periods=periods,
            name=min_column,
        )

        print(
            f"Created {min_column:<30} "
            f"(horizon={periods} rows)"
        )

    # --------------------------------------------------------
    # Add future close targets
    # --------------------------------------------------------

    for target_name, periods in horizon_config.items():

        column_name = f"future_close_{target_name}"

        df[column_name] = (
            df["close"].shift(-periods)
        )

    # --------------------------------------------------------
    # Add future direction targets
    # --------------------------------------------------------

    #
    # Direction:
    #
    #   +1 = price increases
    #    0 = price unchanged
    #   -1 = price decreases
    #
    # These are raw direction labels.
    #
    # Later we can create threshold-based:
    #
    #   LONG
    #   SHORT
    #   HOLD
    #

    for target_name in horizon_config.keys():

        return_column = f"future_return_{target_name}"
        direction_column = f"future_direction_{target_name}"

        df[direction_column] = np.sign(
            df[return_column]
        ).astype("Int64")

    # --------------------------------------------------------
    # Remove rows without valid targets
    # --------------------------------------------------------

    target_columns = []

    for target_name in horizon_config.keys():

        target_columns.extend(
            [
                f"future_return_{target_name}",
                f"future_max_return_{target_name}",
                f"future_min_return_{target_name}",
            ]
        )

    before_drop = len(df)

    df = df.dropna(
        subset=target_columns
    ).reset_index(drop=True)

    removed = before_drop - len(df)

    print(
        f"Removed {removed:,} rows "
        f"without future target values."
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    df.to_parquet(
        output_file,
        index=False,
        engine="pyarrow",
    )

    print()
    print(f"Saved: {output_file}")
    print(f"Final rows: {len(df):,}")
    print(f"Final columns: {len(df.columns)}")

    # --------------------------------------------------------
    # Target statistics
    # --------------------------------------------------------

    print()
    print("Target statistics:")

    for target_name in horizon_config.keys():

        return_column = (
            f"future_return_{target_name}"
        )

        max_column = (
            f"future_max_return_{target_name}"
        )

        min_column = (
            f"future_min_return_{target_name}"
        )

        print()
        print(f"  [{target_name}]")

        print(
            f"    {return_column:<30} "
            f"mean={df[return_column].mean():.6f} "
            f"std={df[return_column].std():.6f} "
            f"min={df[return_column].min():.6f} "
            f"max={df[return_column].max():.6f}"
        )

        print(
            f"    {max_column:<30} "
            f"mean={df[max_column].mean():.6f} "
            f"std={df[max_column].std():.6f} "
            f"min={df[max_column].min():.6f} "
            f"max={df[max_column].max():.6f}"
        )

        print(
            f"    {min_column:<30} "
            f"mean={df[min_column].mean():.6f} "
            f"std={df[min_column].std():.6f} "
            f"min={df[min_column].min():.6f} "
            f"max={df[min_column].max():.6f}"
        )


# ============================================================
# Process full TARFGET File
# ============================================================

def build_full_targets(
    target_5m: pd.DataFrame,
    target_15m: pd.DataFrame,
    target_1h: pd.DataFrame,
    target_4h: pd.DataFrame,
) -> pd.DataFrame:
    print()
    print("=" * 70)
    print(f"Processing: FULL TARGET")
    print("=" * 70)

    # ========================================================
    # 5m becomes the base prediction timeline
    # ========================================================

    base = target_5m.copy()

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
        target_15m,
        "15m",
    )

    tf1h = prepare_higher_tf(
        target_1h,
        "1h",
    )

    tf4h = prepare_higher_tf(
        target_4h,
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


# ============================================================
# Main
# ============================================================
def main():

    print("=" * 70)
    print("TARGET ENGINEERING")
    print("=" * 70)

    print(f"Feature directory: {FEATURE_DIR}")
    print(f"Target directory:  {TARGET_DIR}")

    # --------------------------------------------------------
    # Process individual timeframe datasets
    # --------------------------------------------------------

    for timeframe, horizon_config in TARGET_HORIZONS.items():

        process_feature_file(
            timeframe=timeframe,
            horizon_config=horizon_config,
        )

    # --------------------------------------------------------
    # target_full.parquet
    # --------------------------------------------------------
    # --------------------------------------------------------
    # Load generated target files
    # --------------------------------------------------------

    target_5m = pd.read_parquet(
        TARGET_DIR / "target_5m.parquet"
    )

    target_15m = pd.read_parquet(
        TARGET_DIR / "target_15m.parquet"
    )

    target_1h = pd.read_parquet(
        TARGET_DIR / "target_1h.parquet"
    )

    target_4h = pd.read_parquet(
        TARGET_DIR / "target_4h.parquet"
    )
    target_full = build_full_targets(
        target_5m,
        target_15m,
        target_1h,
        target_4h,
    )

    target_full.to_parquet(
        TARGET_DIR / "target_full.parquet",
        index=False,
    )

    print(
        f"Full feature rows: "
        f"{len(target_full):,}"
    )

    print(
        f"Full feature columns: "
        f"{len(target_full.columns):,}"
    )

 

    print()
    print("=" * 70)
    print("TARGET ENGINEERING COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()

