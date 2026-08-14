# ============================================================
# prepare_experiments.py
# ============================================================
# python -m scripts.prepare_experiments
from pathlib import Path
import pandas as pd


# ============================================================
# PATHS
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[1]

SPLIT_DIR = ROOT_DIR / "data" / "splits"
EXPERIMENT_DIR = ROOT_DIR / "data" / "experiments"


SPLITS = {
    "train": SPLIT_DIR / "train",
    "validation": SPLIT_DIR / "validation",
    "test": SPLIT_DIR / "test",
}


# ============================================================
# EXPERIMENT CONFIGURATION
# ============================================================

# ------------------------------------------------------------
# Base 5m target family
# ------------------------------------------------------------

BASE_HORIZONS = {
    "5m": "future",
    "10m": "future",
    "15m": "future",
    "30m": "future",
    "1h": "future",
    "4h": "future",
}


# ------------------------------------------------------------
# 1h target family
# ------------------------------------------------------------

H1_HORIZONS = {
    "1h": "1h",
    "2h": "1h",
    "4h": "1h",
    "5h": "1h",
    "6h": "1h",
}


# ------------------------------------------------------------
# 4h target family
# ------------------------------------------------------------

H4_HORIZONS = {
    "4h": "4h",
}


# ------------------------------------------------------------
# Research groups
# ------------------------------------------------------------

HORIZON_GROUPS = {
    "very_short": [
        ("base", "5m"),
        ("base", "10m"),
    ],

    "short": [
        ("base", "15m"),
        ("base", "30m"),
    ],

    "medium": [
        ("base", "1h"),
        ("h1", "2h"),
    ],

    "longer_short_term": [
        ("base", "4h"),
        ("h1", "4h"),
        ("h1", "5h"),
        ("h1", "6h"),
    ],
}


# ============================================================
# TARGET COLUMN BUILDERS
# ============================================================

def build_target_columns(
    source: str,
    horizon: str,
    model_type: str,
) -> list[str]:

    # --------------------------------------------------------
    # Determine prefix
    # --------------------------------------------------------

    if source == "base":
        prefix = "future_"

    elif source == "h1":
        prefix = "1h_future_"

    elif source == "h4":
        prefix = "4h_future_"

    else:
        raise ValueError(f"Unknown source: {source}")


    # --------------------------------------------------------
    # Direction
    # --------------------------------------------------------

    if model_type == "direction":

        return [
            f"{prefix}direction_{horizon}"
        ]


    # --------------------------------------------------------
    # Return
    # --------------------------------------------------------

    if model_type == "return":

        return [
            f"{prefix}return_{horizon}"
        ]


    # --------------------------------------------------------
    # Return + MFE + MAE
    # --------------------------------------------------------

    if model_type == "return_mfe_mae":

        return [
            f"{prefix}return_{horizon}",
            f"{prefix}max_return_{horizon}",
            f"{prefix}min_return_{horizon}",
        ]


    # --------------------------------------------------------
    # Multi-task
    # --------------------------------------------------------

    if model_type == "multitask":

        return [
            f"{prefix}direction_{horizon}",
            f"{prefix}return_{horizon}",
            f"{prefix}max_return_{horizon}",
            f"{prefix}min_return_{horizon}",
        ]


    raise ValueError(f"Unknown model type: {model_type}")


# ============================================================
# LOAD DATA
# ============================================================

# def load_split(split_name: str):

#     split_dir = SPLITS[split_name]

#     feature_file = split_dir / "feature.parquet"
#     target_file = split_dir / "target.parquet"

#     if not feature_file.exists():
#         raise FileNotFoundError(feature_file)

#     if not target_file.exists():
#         raise FileNotFoundError(target_file)

#     feature = pd.read_parquet(feature_file)
#     target = pd.read_parquet(target_file)

#     return feature, target


def load_split(split_name: str):

    split_dir = SPLITS[split_name]

    feature_file = split_dir / "feature.parquet"
    target_file = split_dir / "target.parquet"

    if not feature_file.exists():
        raise FileNotFoundError(feature_file)

    if not target_file.exists():
        raise FileNotFoundError(target_file)

    feature = pd.read_parquet(feature_file)
    target = pd.read_parquet(target_file)

    # ========================================================
    # NORMALIZE TIMESTAMP
    # ========================================================

    # Feature timestamp
    if "timestamp" not in feature.columns:

        if feature.index.name == "timestamp":
            feature = feature.reset_index()

        else:
            raise ValueError(
                f"[{split_name}] Feature dataset has no "
                f"'timestamp' column and index is not "
                f"named 'timestamp'.\n"
                f"Columns: {feature.columns.tolist()}\n"
                f"Index name: {feature.index.name}"
            )

    # Target timestamp
    if "timestamp" not in target.columns:

        if target.index.name == "timestamp":
            target = target.reset_index()

        else:
            raise ValueError(
                f"[{split_name}] Target dataset has no "
                f"'timestamp' column and index is not "
                f"named 'timestamp'.\n"
                f"Columns: {target.columns.tolist()}\n"
                f"Index name: {target.index.name}"
            )

    return feature, target


    
# ============================================================
# VALIDATE ALIGNMENT
# ============================================================

def validate_alignment(
    feature: pd.DataFrame,
    target: pd.DataFrame,
    split_name: str,
):

    if len(feature) != len(target):
        raise ValueError(
            f"[{split_name}] Row mismatch: "
            f"feature={len(feature)}, "
            f"target={len(target)}"
        )

    if "timestamp" in feature.columns and "timestamp" in target.columns:

        if not feature["timestamp"].equals(target["timestamp"]):

            raise ValueError(
                f"[{split_name}] Timestamp mismatch"
            )

    print(
        f"✓ {split_name}: "
        f"{len(feature):,} rows aligned"
    )


# ============================================================
# CREATE EXPERIMENT
# ============================================================

def create_experiment(
    experiment_name: str,
    source: str,
    horizon: str,
    model_type: str,
):

    print()
    print("=" * 70)
    print(
        f"EXPERIMENT: "
        f"{experiment_name} / "
        f"{source} / "
        f"{horizon} / "
        f"{model_type}"
    )
    print("=" * 70)


    target_columns = build_target_columns(
        source=source,
        horizon=horizon,
        model_type=model_type,
    )


    print("\nTarget columns:")

    for column in target_columns:
        print(f"  {column}")


    # --------------------------------------------------------
    # Output directory
    # --------------------------------------------------------

    output_dir = (
        EXPERIMENT_DIR
        / experiment_name
        / model_type
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )


    # --------------------------------------------------------
    # Process train / validation / test
    # --------------------------------------------------------

    for split_name in SPLITS:

        feature, target = load_split(split_name)

        validate_alignment(
            feature,
            target,
            split_name,
        )


        # ----------------------------------------------------
        # Verify target columns exist
        # ----------------------------------------------------

        missing = [
            column
            for column in target_columns
            if column not in target.columns
        ]

        if missing:

            raise ValueError(
                f"\nMissing target columns "
                f"for {experiment_name}/"
                f"{model_type}/{horizon}:\n"
                + "\n".join(
                    f"  - {column}"
                    for column in missing
                )
            )


        # ----------------------------------------------------
        # Keep timestamp + target
        # ----------------------------------------------------

        target_subset = target[
            ["timestamp"] + target_columns
        ].copy()


        # ----------------------------------------------------
        # Remove rows with missing targets
        # ----------------------------------------------------

        before = len(target_subset)

        valid_mask = (
            target_subset[target_columns]
            .notna()
            .all(axis=1)
        )

        target_subset = target_subset[
            valid_mask
        ].reset_index(drop=True)

        removed = before - len(target_subset)


        # ----------------------------------------------------
        # Align feature rows to target rows
        # ----------------------------------------------------

        if removed > 0:

            valid_indices = valid_mask[valid_mask].index

            feature_subset = (
                feature
                .iloc[valid_indices]
                .reset_index(drop=True)
            )

        else:

            feature_subset = (
                feature
                .reset_index(drop=True)
            )


        # ----------------------------------------------------
        # Final validation
        # ----------------------------------------------------

        if len(feature_subset) != len(target_subset):

            raise ValueError(
                f"Final row mismatch for "
                f"{split_name}"
            )


        if not feature_subset[
            "timestamp"
        ].equals(
            target_subset["timestamp"]
        ):

            raise ValueError(
                f"Final timestamp mismatch "
                f"for {split_name}"
            )


        # ----------------------------------------------------
        # Save
        # ----------------------------------------------------

        split_output = output_dir / split_name

        split_output.mkdir(
            parents=True,
            exist_ok=True,
        )


        feature_file = (
            split_output / "feature.parquet"
        )

        target_file = (
            split_output / "target.parquet"
        )


        feature_subset.to_parquet(
            feature_file,
            index=False,
        )

        target_subset.to_parquet(
            target_file,
            index=False,
        )


        print(
            f"\n{split_name.upper()}"
        )

        print(
            f"  Rows: "
            f"{len(feature_subset):,}"
        )

        print(
            f"  Removed null rows: "
            f"{removed:,}"
        )

        print(
            f"  Feature: "
            f"{feature_file}"
        )

        print(
            f"  Target: "
            f"{target_file}"
        )


# ============================================================
# MAIN
# ============================================================

def main():

    MODEL_TYPES = [
        "direction",
        "return",
        "return_mfe_mae",
        "multitask",
    ]


    print("=" * 70)
    print("QUANTUM SYSTEM — EXPERIMENT DATA PREPARATION")
    print("=" * 70)


    for group_name, experiments in HORIZON_GROUPS.items():

        for source, horizon in experiments:

            for model_type in MODEL_TYPES:

                create_experiment(
                    experiment_name=group_name,
                    source=source,
                    horizon=horizon,
                    model_type=model_type,
                )


    print()
    print("=" * 70)
    print("ALL EXPERIMENT DATASETS CREATED")
    print("=" * 70)


if __name__ == "__main__":
    main()