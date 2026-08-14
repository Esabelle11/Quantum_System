import numpy as np
import pandas as pd


# ============================================================
# OI Change
# ============================================================

def calculate_oi_change(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "oi_change" not in config:
        return df

    for key, periods in config["oi_change"].items():

        df[f"oi_change_{key}"] = (df["open_interest"].pct_change(periods))

    return df


# ============================================================
# OI Momentum / Trend
# ============================================================

def calculate_oi_momentum(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "oi_momentum" not in config:
        return df

    for key, window in config["oi_momentum"].items():

        oi_ma = (df["open_interest"].rolling(window).mean())

        # df[f"oi_ma_{key}"] = oi_ma

        df[f"oi_vs_ma_{key}"] = (df["open_interest"] / oi_ma - 1)

    return df


# ============================================================
# Price-OI Relationship
# ============================================================

def calculate_price_oi_relation(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "price_oi_relation" not in config:
        return df

    for key, periods in config["price_oi_relation"].items():

        price_return = (df["close"].pct_change(periods))
        oi_change = (df["open_interest"].pct_change(periods))

        # df[f"price_return_{key}"] = price_return
        # df[f"oi_change_relation_{key}"] = oi_change

        # df[f"price_oi_product_{key}"] = (price_return * oi_change)
        df[f"price_oi_same_direction_{key}"] = (np.sign(price_return) == np.sign(oi_change)).astype(int)
        df[f"price_oi_regime_{key}"] = (np.sign(price_return) * 2 + np.sign(oi_change))

    return df


# ============================================================
# Rolling OI Standard Deviation
# ============================================================

def calculate_oi_std(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "oi_std" not in config:
        return df

    for key, window in config["oi_std"].items():
        df[f"oi_std_{key}"] = (df["open_interest"].rolling(window).std())

    return df


# ============================================================
# OI Z-Score
# ============================================================

def calculate_oi_zscore(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "oi_zscore" not in config:
        return df

    for key, window in config["oi_zscore"].items():

        mean = (df["open_interest"].rolling(window).mean())
        std = (df["open_interest"].rolling(window).std())

        df[f"oi_zscore_{key}"] = ((df["open_interest"] - mean)/ std)

    return df


# ============================================================
# Main OI Feature Builder
# ============================================================

def calculate_oi_features(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    df = calculate_oi_change(df,config,)
    df = calculate_oi_momentum(df,config,)
    df = calculate_price_oi_relation(df,config,)
    df = calculate_oi_std(df,config,)
    df = calculate_oi_zscore(df,config,)

    return df


    