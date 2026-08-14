import pandas as pd
import numpy as np


# ============================================================
# Funding Change
# ============================================================

def calculate_funding_change(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "funding_change" not in config:
        return df

    for key, periods in config["funding_change"].items():

        df[f"funding_change_{key}"] = (
            df["funding_rate"].diff(periods)
        )

    return df


# ============================================================
# Rolling Funding Mean
# ============================================================

def calculate_funding_mean(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "funding_mean" not in config:
        return df

    for key, window_config in config["funding_mean"].items():

        # Support either:
        #
        # "12": 12
        #
        # or:
        #
        # "12": {"window": 12, "min_periods": 6}
        #
        if isinstance(window_config, dict):

            window = window_config["window"]

            min_periods = window_config.get(
                "min_periods",
                window,
            )

        else:

            window = window_config
            min_periods = window

        df[f"funding_ma_{key}"] = (
            df["funding_rate"]
            .rolling(
                window,
                min_periods=min_periods,
            )
            .mean()
        )

    return df


# ============================================================
# Rolling Funding Standard Deviation
# ============================================================

def calculate_funding_std(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "funding_std" not in config:
        return df

    for key, window_config in config["funding_std"].items():

        if isinstance(window_config, dict):

            window = window_config["window"]

            min_periods = window_config.get(
                "min_periods",
                window,
            )

        else:

            window = window_config
            min_periods = window

        df[f"funding_std_{key}"] = (
            df["funding_rate"]
            .rolling(
                window,
                min_periods=min_periods,
            )
            .std()
        )

    return df


# ============================================================
# Funding Cumulative
# ============================================================

def calculate_funding_cumulative(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "funding_cumulative" not in config:
        return df

    for key, window_config in config["funding_cumulative"].items():

        if isinstance(window_config, dict):

            window = window_config["window"]

        else:

            window = window_config

        df[f"funding_cumulative_{key}"] = (
            df["funding_rate"]
            .rolling(window)
            .sum()
        )

    return df


# ============================================================
# Funding Z-Score
# ============================================================

def calculate_funding_zscore(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "funding_zscore" not in config:
        return df

    for key, window_config in config["funding_zscore"].items():

        if isinstance(window_config, dict):

            window = window_config["window"]

            min_periods = window_config.get(
                "min_periods",
                window,
            )

        else:

            window = window_config
            min_periods = window

        rolling_mean = (
            df["funding_rate"]
            .rolling(
                window,
                min_periods=min_periods,
            )
            .mean()
        )

        rolling_std = (
            df["funding_rate"]
            .rolling(
                window,
                min_periods=min_periods,
            )
            .std()
        )

        df[f"funding_zscore_{key}"] = (
            (
                df["funding_rate"]
                - rolling_mean
            )
            / rolling_std
        )

    return df


# ============================================================
# Funding Extreme
# ============================================================

def calculate_funding_extreme(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "funding_extreme" not in config:
        return df

    for key, threshold in config["funding_extreme"].items():

        zscore_column = (
            f"funding_zscore_{key}"
        )

        if zscore_column not in df.columns:
            continue

        df[f"funding_extreme_{key}"] = (
            df[zscore_column].abs()
            >= threshold
        )

    return df


# ============================================================
# Main Funding Feature Builder
# ============================================================

def calculate_funding_features(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    df = calculate_funding_change(
        df,
        config,
    )

    df = calculate_funding_mean(
        df,
        config,
    )

    df = calculate_funding_std(
        df,
        config,
    )

    df = calculate_funding_cumulative(
        df,
        config,
    )

    df = calculate_funding_zscore(
        df,
        config,
    )

    df = calculate_funding_extreme(
        df,
        config,
    )

    return df