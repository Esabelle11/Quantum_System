# ============================================================
# Prepare Model Dataset
# ============================================================
#
# python -m scripts.prepare_train_test
#
# Step 5:
# Train / Validation / Test Split
#
# Input:
#   data/features/feature_full.parquet
#   data/targets/target_full.parquet
#
# Output:
#   data/train/feature.parquet
#   data/train/target.parquet
#
#   data/splits/train/feature.parquet
#   data/splits/train/target.parquet
#
#   data/splits/validation/feature.parquet
#   data/splits/validation/target.parquet
#
#   data/splits/test/feature.parquet
#   data/splits/test/target.parquet
#
# ============================================================

from pathlib import Path

import pandas as pd


# ============================================================
# Paths
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[1]

FEATURE_DIR = ROOT_DIR / "data" / "features"
TARGET_DIR = ROOT_DIR / "data" / "targets"

TRAIN_DIR = ROOT_DIR / "data" / "train"
SPLIT_DIR = ROOT_DIR / "data" / "splits"


FEATURE_FILE = FEATURE_DIR / "feature_full.parquet"
TARGET_FILE = TARGET_DIR / "target_full.parquet"


# ============================================================
# Split Configuration
# ============================================================

TRAIN_RATIO = 0.70
VALIDATION_RATIO = 0.15
TEST_RATIO = 0.15


# ============================================================
# Utility
# ============================================================

def ensure_directories() -> None:

    TRAIN_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    for split in ["train", "validation", "test"]:

        (SPLIT_DIR / split).mkdir(
            parents=True,
            exist_ok=True,
        )


# ============================================================
# Timestamp Preparation
# ============================================================

def prepare_timestamp(
    df: pd.DataFrame,
    name: str,
) -> pd.DataFrame:

    df = df.copy()

    if "timestamp" not in df.columns:

        raise ValueError(
            f"{name} does not contain a 'timestamp' column."
        )

    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        utc=True,
        errors="coerce",
    )

    invalid_timestamp_count = df["timestamp"].isna().sum()

    if invalid_timestamp_count > 0:

        print(
            f"[WARNING] {name}: "
            f"{invalid_timestamp_count:,} invalid timestamps."
        )

        df = df.dropna(
            subset=["timestamp"]
        )

    return df


# ============================================================
# Remove Timestamp Columns
# ============================================================

def remove_timestamp_columns(
    df: pd.DataFrame,
) -> pd.DataFrame:

    columns_to_remove = [
        column
        for column in df.columns
        if "timestamp" in column.lower()
    ]

    # Keep canonical timestamp temporarily.
    columns_to_remove = [
        column
        for column in columns_to_remove
        if column != "timestamp"
    ]

    if columns_to_remove:

        print(
            f"Removing timestamp columns: "
            f"{columns_to_remove}"
        )

        df = df.drop(
            columns=columns_to_remove
        )

    return df


# ============================================================
# Remove Target OHLCV / Market Columns
# ============================================================

def remove_target_market_columns(
    df: pd.DataFrame,
) -> pd.DataFrame:

    market_suffixes = (
        "open",
        "high",
        "low",
        "close",
        "volume",
        "turnover",
    )

    columns_to_remove = []

    for column in df.columns:

        column_lower = column.lower()

        # Never remove canonical timestamp here.
        if column == "timestamp":
            continue

        # Remove OHLCV / turnover regardless of timeframe prefix.
        if column_lower.endswith(market_suffixes):

            columns_to_remove.append(column)

    if columns_to_remove:

        print(
            "Removing target market columns:"
        )

        for column in columns_to_remove:
            print(f"  - {column}")

        df = df.drop(
            columns=columns_to_remove
        )

    return df


# ============================================================
# Remove Timeframe Columns
# ============================================================

def remove_timeframe_metadata(
    df: pd.DataFrame,
) -> pd.DataFrame:

    """
    Remove columns that are metadata rather than
    actual model features / targets.

    Examples:
        timeframe
        timeframe_5m
        timeframe_15m
        timeframe_1h
        timeframe_4h
    """

    columns_to_remove = []

    for column in df.columns:

        column_lower = column.lower()

        if column_lower == "timeframe":

            columns_to_remove.append(column)

        elif column_lower.startswith("timeframe_"):

            columns_to_remove.append(column)

    if columns_to_remove:

        print(
            f"Removing timeframe metadata: "
            f"{columns_to_remove}"
        )

        df = df.drop(
            columns=columns_to_remove
        )

    return df


# ============================================================
# Validate Numeric Data
# ============================================================

def validate_numeric_columns(
    df: pd.DataFrame,
    name: str,
) -> None:

    non_numeric_columns = [
        column
        for column in df.columns
        if column != "timestamp"
        and not pd.api.types.is_numeric_dtype(
            df[column]
        )
    ]

    if non_numeric_columns:

        raise TypeError(
            f"{name} contains non-numeric columns "
            f"after cleaning:\n"
            f"{non_numeric_columns}"
        )


# ============================================================
# Main Dataset Preparation
# ============================================================

def prepare_dataset() -> tuple[
    pd.DataFrame,
    pd.DataFrame,
]:

    print("=" * 70)
    print("Loading full feature and target datasets")
    print("=" * 70)

    feature = pd.read_parquet(
        FEATURE_FILE
    )

    target = pd.read_parquet(
        TARGET_FILE
    )

    print(
        f"Feature rows: {len(feature):,}"
    )

    print(
        f"Target rows : {len(target):,}"
    )

    print(
        f"Feature columns: {len(feature.columns):,}"
    )

    print(
        f"Target columns : {len(target.columns):,}"
    )

    # --------------------------------------------------------
    # Timestamp
    # --------------------------------------------------------

    feature = prepare_timestamp(
        feature,
        "Feature",
    )

    target = prepare_timestamp(
        target,
        "Target",
    )

    # --------------------------------------------------------
    # Sort
    # --------------------------------------------------------

    feature = feature.sort_values(
        "timestamp"
    ).reset_index(
        drop=True
    )

    target = target.sort_values(
        "timestamp"
    ).reset_index(
        drop=True
    )

    # --------------------------------------------------------
    # Duplicate timestamps
    # --------------------------------------------------------

    feature_duplicate_count = (
        feature["timestamp"]
        .duplicated()
        .sum()
    )

    target_duplicate_count = (
        target["timestamp"]
        .duplicated()
        .sum()
    )

    if feature_duplicate_count > 0:

        raise ValueError(
            "Feature dataset contains duplicate timestamps: "
            f"{feature_duplicate_count:,}"
        )

    if target_duplicate_count > 0:

        raise ValueError(
            "Target dataset contains duplicate timestamps: "
            f"{target_duplicate_count:,}"
        )

    # --------------------------------------------------------
    # Keep timestamp for alignment
    # --------------------------------------------------------

    feature_timestamp = feature[
        ["timestamp"]
    ].copy()

    target_timestamp = target[
        ["timestamp"]
    ].copy()

    # --------------------------------------------------------
    # Clean Feature
    # --------------------------------------------------------

    feature = remove_timestamp_columns(
        feature
    )

    feature = remove_timeframe_metadata(
        feature
    )

    # --------------------------------------------------------
    # Clean Target
    # --------------------------------------------------------

    target = remove_timestamp_columns(
        target
    )

    target = remove_target_market_columns(
        target
    )

    target = remove_timeframe_metadata(
        target
    )

    # --------------------------------------------------------
    # Reattach canonical timestamp
    # --------------------------------------------------------

    # feature.insert(
    #     0,
    #     "timestamp",
    #     feature_timestamp["timestamp"].values,
    # )

    # target.insert(
    #     0,
    #     "timestamp",
    #     target_timestamp["timestamp"].values,
    # )

    # ========================================================
    # ALIGN FEATURE + TARGET
    # ========================================================

    print()
    print("=" * 70)
    print("Aligning feature and target timestamps")
    print("=" * 70)

    feature = feature.set_index(
        "timestamp"
    )

    target = target.set_index(
        "timestamp"
    )

    # --------------------------------------------------------
    # Find common timestamps
    # --------------------------------------------------------

    common_timestamps = (
        feature.index
        .intersection(target.index)
    )

    print(
        f"Feature timestamps : {len(feature):,}"
    )

    print(
        f"Target timestamps  : {len(target):,}"
    )

    print(
        f"Common timestamps  : {len(common_timestamps):,}"
    )

    if len(common_timestamps) == 0:

        raise ValueError(
            "No common timestamps between "
            "feature and target datasets."
        )

    # --------------------------------------------------------
    # Keep only common timestamps
    # --------------------------------------------------------

    feature = feature.loc[
        common_timestamps
    ].sort_index()

    target = target.loc[
        common_timestamps
    ].sort_index()

    # ========================================================
    # Remove NaN
    # ========================================================

    print()
    print("=" * 70)
    print("Removing rows containing NaN")
    print("=" * 70)

    combined = pd.concat(
        [
            feature.add_prefix("X__"),
            target.add_prefix("Y__"),
        ],
        axis=1,
    )

    rows_before = len(combined)

    combined = combined.dropna(
        axis=0,
        how="any",
    )

    rows_after = len(combined)

    removed_rows = (
        rows_before - rows_after
    )

    print(
        f"Rows before NaN removal: "
        f"{rows_before:,}"
    )

    print(
        f"Rows after NaN removal : "
        f"{rows_after:,}"
    )

    print(
        f"Rows removed            : "
        f"{removed_rows:,}"
    )

    # ========================================================
    # Split X and Y again
    # ========================================================

    feature_columns = [
        column
        for column in combined.columns
        if column.startswith("X__")
    ]

    target_columns = [
        column
        for column in combined.columns
        if column.startswith("Y__")
    ]

    feature = combined[
        feature_columns
    ].copy()

    target = combined[
        target_columns
    ].copy()

    feature.columns = [
        column.removeprefix("X__")
        for column in feature.columns
    ]

    target.columns = [
        column.removeprefix("Y__")
        for column in target.columns
    ]

    # ========================================================
    # Numeric Validation
    # ========================================================

    validate_numeric_columns(
        feature,
        "Feature",
    )

    validate_numeric_columns(
        target,
        "Target",
    )

    # ========================================================
    # Final Validation
    # ========================================================

    if len(feature) != len(target):

        raise ValueError(
            "Feature and target row counts do not match."
        )

    if not feature.index.equals(
        target.index
    ):

        raise ValueError(
            "Feature and target timestamps are not aligned."
        )

    if feature.index.has_duplicates:

        raise ValueError(
            "Feature dataset contains duplicate timestamps."
        )

    if target.index.has_duplicates:

        raise ValueError(
            "Target dataset contains duplicate timestamps."
        )

    # ========================================================
    # Print Final Dataset Information
    # ========================================================

    print()
    print("=" * 70)
    print("FINAL CLEAN DATASET")
    print("=" * 70)

    print(
        f"Rows       : {len(feature):,}"
    )

    print(
        f"Features   : {len(feature.columns):,}"
    )

    print(
        f"Targets    : {len(target.columns):,}"
    )

    print(
        f"Start      : {feature.index.min()}"
    )

    print(
        f"End        : {feature.index.max()}"
    )

    print()
    print("Feature columns:")
    print(
        list(feature.columns)
    )

    print()
    print("Target columns:")
    print(
        list(target.columns)
    )

    return feature, target


# ============================================================
# Save Master Dataset
# ============================================================

def save_master_dataset(
    feature: pd.DataFrame,
    target: pd.DataFrame,
) -> None:

    feature_output = (
        TRAIN_DIR / "feature.parquet"
    )

    target_output = (
        TRAIN_DIR / "target.parquet"
    )

    feature.to_parquet(
        feature_output,
        index=True,
    )

    target.to_parquet(
        target_output,
        index=True,
    )

    print()
    print("=" * 70)
    print("MASTER DATASET SAVED")
    print("=" * 70)

    print(
        f"Feature: {feature_output}"
    )

    print(
        f"Target : {target_output}"
    )


# ============================================================
# Chronological Split
# ============================================================

def split_dataset(
    feature: pd.DataFrame,
    target: pd.DataFrame,
) -> None:

    if (
        TRAIN_RATIO
        + VALIDATION_RATIO
        + TEST_RATIO
        != 1.0
    ):

        raise ValueError(
            "Train/validation/test ratios must sum to 1.0."
        )

    total_rows = len(feature)

    train_end = int(
        total_rows * TRAIN_RATIO
    )

    validation_end = (
        train_end
        + int(
            total_rows
            * VALIDATION_RATIO
        )
    )

    train_feature = feature.iloc[
        :train_end
    ]

    train_target = target.iloc[
        :train_end
    ]

    validation_feature = feature.iloc[
        train_end:validation_end
    ]

    validation_target = target.iloc[
        train_end:validation_end
    ]

    test_feature = feature.iloc[
        validation_end:
    ]

    test_target = target.iloc[
        validation_end:
    ]

    splits = {
        "train": (
            train_feature,
            train_target,
        ),
        "validation": (
            validation_feature,
            validation_target,
        ),
        "test": (
            test_feature,
            test_target,
        ),
    }

    print()
    print("=" * 70)
    print("CHRONOLOGICAL SPLIT")
    print("=" * 70)

    for split_name, (
        split_feature,
        split_target,
    ) in splits.items():

        split_dir = (
            SPLIT_DIR / split_name
        )

        feature_path = (
            split_dir / "feature.parquet"
        )

        target_path = (
            split_dir / "target.parquet"
        )

        split_feature.to_parquet(
            feature_path,
            index=True,
        )

        split_target.to_parquet(
            target_path,
            index=True,
        )

        print()
        print(
            f"{split_name.upper()}"
        )

        print(
            f"Rows: {len(split_feature):,}"
        )

        print(
            f"Start: {split_feature.index.min()}"
        )

        print(
            f"End:   {split_feature.index.max()}"
        )

        print(
            f"Feature: {feature_path}"
        )

        print(
            f"Target : {target_path}"
        )


# ============================================================
# Main
# ============================================================

def main() -> None:

    print()
    print("=" * 70)
    print("QUANTUM SYSTEM - STEP 5")
    print("TRAIN / VALIDATION / TEST PREPARATION")
    print("=" * 70)

    ensure_directories()

    feature, target = prepare_dataset()

    save_master_dataset(
        feature,
        target,
    )

    split_dataset(
        feature,
        target,
    )

    print()
    print("=" * 70)
    print("STEP 5 COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()